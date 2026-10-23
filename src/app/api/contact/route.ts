import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { contactSchema, contactSubjectLabels } from "@/lib/schemas/contact";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const MIN_FILL_TIME_MS = 1_200;

interface RateBucket {
  timestamps: number[];
}

const globalForRateLimit = globalThis as typeof globalThis & {
  __portfolioContactRateLimit?: Map<string, RateBucket>;
};

const rateLimitStore =
  globalForRateLimit.__portfolioContactRateLimit ??
  (globalForRateLimit.__portfolioContactRateLimit = new Map<string, RateBucket>());

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || realIp || "unknown";
}

function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const bucket = rateLimitStore.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter(
    (timestamp) => now - timestamp < RATE_WINDOW_MS
  );

  if (bucket.timestamps.length >= RATE_LIMIT) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000)
    );

    rateLimitStore.set(key, bucket);
    return { allowed: false as const, retryAfterSeconds };
  }

  bucket.timestamps.push(now);
  rateLimitStore.set(key, bucket);
  return { allowed: true as const, retryAfterSeconds: 0 };
}

function createTicketId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `TKT-${date}-${suffix}`;
}

async function sendEmailNotification(input: {
  name: string;
  email: string;
  subject: string;
  budget?: string;
  message: string;
  ticketId: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return { sent: false, reason: "email-not-configured" as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: input.email,
      subject: `[Portfolio] ${input.subject} — ${input.name}`,
      text: [
        `Tiket: ${input.ticketId}`,
        `Nama: ${input.name}`,
        `Email: ${input.email}`,
        `Subjek: ${input.subject}`,
        input.budget ? `Anggaran: ${input.budget}` : null,
        "",
        "Pesan:",
        input.message,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend error ${response.status}: ${detail}`);
  }

  return { sent: true as const };
}

export async function POST(request: NextRequest) {
  try {
    const ipHash = hashIp(getClientIp(request));
    const rateLimit = checkRateLimit(ipHash);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Terlalu banyak pesan dari perangkat ini. Silakan coba lagi nanti.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
            "Cache-Control": "no-store",
          },
        }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "Format permintaan tidak valid." },
        { status: 400 }
      );
    }

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Data formulir belum valid. Periksa kembali isian Anda.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // Honeypot dan pengisian terlalu cepat dianggap bot: beri respons sukses
    // tanpa memproses pesan agar bot tidak belajar dari error.
    const isLikelyBot =
      Boolean(data.honeypot && data.honeypot.length > 0) ||
      (typeof data.startedAt === "number" &&
        Date.now() - data.startedAt < MIN_FILL_TIME_MS);

    if (isLikelyBot) {
      return NextResponse.json(
        { ok: true, ticketId: createTicketId(), filtered: true },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const ticketId = createTicketId();
    const subjectLabel = contactSubjectLabels[data.subject];
    const userAgent = request.headers.get("user-agent")?.slice(0, 200) ?? "unknown";

    console.info("[contact] pesan baru", {
      ticketId,
      ipHash,
      subject: subjectLabel,
      userAgent,
      hasBudget: Boolean(data.budget),
    });

    try {
      await sendEmailNotification({
        name: data.name,
        email: data.email,
        subject: subjectLabel,
        budget: data.budget || undefined,
        message: data.message,
        ticketId,
      });
    } catch (error) {
      // Pesan tetap dicatat di server walau email gagal terkirim.
      console.error("[contact] gagal mengirim email", error);
    }

    return NextResponse.json(
      { ok: true, ticketId },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[contact] unexpected error", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Maaf, terjadi kesalahan di server. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
