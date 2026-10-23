"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import {
  contactSchema,
  contactSubjectLabels,
  contactSubjects,
  type ContactFormValues,
} from "@/lib/schemas/contact";
import { profile } from "@/lib/data/profile";
import { cn } from "@/lib/utils/cn";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const inputClassName =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60";

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "collab",
  budget: "",
  message: "",
  consent: false,
  honeypot: "",
};

export function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [startedAt, setStartedAt] = useState<number | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  useEffect(() => {
    setStartedAt(Date.now());
  }, []);

  const messageLength = watch("message")?.length ?? 0;
  const consentValue = watch("consent");
  const isBusy = isSubmitting || status === "submitting";

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("submitting");
    setServerError("");

    try {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        throw new Error(
          "Anda sedang offline. Sambungkan internet lalu coba kirim lagi."
        );
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, startedAt }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        ticketId?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message || "Pesan gagal dikirim. Coba lagi.");
      }

      setTicketId(payload.ticketId ?? "");
      setStatus("success");
      reset(defaultValues);
      setStartedAt(Date.now());
    } catch (error) {
      setStatus("error");
      setServerError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-bold">Pesan terkirim!</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Terima kasih sudah menghubungi saya. Saya akan menanggapi secepatnya,
          biasanya dalam 24 jam.
        </p>
        {ticketId ? (
          <p className="mt-4 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground">
            Tiket: <span className="font-semibold text-foreground">{ticketId}</span>
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setTicketId("");
            }}
            className={buttonStyles({ variant: "outline" })}
          >
            Kirim pesan lain
          </button>
          <a
            href={`mailto:${profile.email}`}
            className={buttonStyles({ variant: "ghost" })}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email langsung
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">
            Nama lengkap <span className="text-accent">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="Nama Anda"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={cn(inputClassName, errors.name && "border-red-400 focus:border-red-400 focus:ring-red-400/20")}
            {...register("name")}
          />
          {errors.name ? (
            <p id="contact-name-error" role="alert" className="mt-1 text-xs text-red-500">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={cn(inputClassName, errors.email && "border-red-400 focus:border-red-400 focus:ring-red-400/20")}
            {...register("email")}
          />
          {errors.email ? (
            <p id="contact-email-error" role="alert" className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium">
            Subjek <span className="text-accent">*</span>
          </label>
          <select
            id="contact-subject"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
            className={cn(inputClassName, "appearance-none", errors.subject && "border-red-400")}
            {...register("subject")}
          >
            {contactSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {contactSubjectLabels[subject]}
              </option>
            ))}
          </select>
          {errors.subject ? (
            <p id="contact-subject-error" role="alert" className="mt-1 text-xs text-red-500">
              {errors.subject.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-budget" className="mb-1.5 block text-sm font-medium">
            Anggaran <span className="text-muted-foreground">(opsional)</span>
          </label>
          <input
            id="contact-budget"
            type="text"
            inputMode="text"
            placeholder="Mis. Rp 5.000.000"
            className={inputClassName}
            {...register("budget")}
          />
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label htmlFor="contact-message" className="block text-sm font-medium">
            Pesan <span className="text-accent">*</span>
          </label>
          <span
            className={cn(
              "text-[11px]",
              messageLength > 2000 ? "text-red-500" : "text-muted-foreground"
            )}
          >
            {messageLength}/2000
          </span>
        </div>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Ceritakan sedikit tentang proyek, ide, atau peluang yang ingin Anda diskusikan..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={cn(inputClassName, "resize-y", errors.message && "border-red-400 focus:border-red-400 focus:ring-red-400/20")}
          {...register("message")}
        />
        {errors.message ? (
          <p id="contact-message-error" role="alert" className="mt-1 text-xs text-red-500">
            {errors.message.message}
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-muted-foreground">
            Minimal 20 karakter agar saya bisa memahami kebutuhan Anda.
          </p>
        )}
      </div>

      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Jangan diisi</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("honeypot")}
        />
      </div>

      <div>
        <label htmlFor="contact-consent" className="flex cursor-pointer items-start gap-2.5">
          <input
            id="contact-consent"
            type="checkbox"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "contact-consent-error" : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-accent focus:ring-accent"
            {...register("consent")}
          />
          <span className="text-xs leading-relaxed text-muted-foreground">
            Saya menyetujui data yang dikirim (nama, email, dan isi pesan) diproses
            hanya untuk keperluan komunikasi terkait pesan ini.
          </span>
        </label>
        {errors.consent ? (
          <p id="contact-consent-error" role="alert" className="mt-1 text-xs text-red-500">
            {errors.consent.message}
          </p>
        ) : null}
      </div>

      {status === "error" && serverError ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{serverError}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isBusy || !consentValue}
        className={buttonStyles({ className: "w-full", size: "lg" })}
      >
        {isBusy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Mengirim pesan...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Kirim pesan
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-muted-foreground">
        Data Anda tidak dibagikan ke pihak ketiga. Anda juga bisa mengirim email
        langsung ke{" "}
        <a href={`mailto:${profile.email}`} className="font-medium text-accent hover:underline">
          {profile.email}
        </a>
        .
      </p>
    </form>
  );
}
