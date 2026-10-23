import Link from "next/link";
import { Clock, Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { profile } from "@/lib/data/profile";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    description: "Cara tercepat untuk menghubungi saya",
  },
  {
    icon: Phone,
    label: "Telepon / WhatsApp",
    value: profile.phone,
    href: `tel:${profile.phoneHref}`,
    description: "Senin–Jumat, 09.00–18.00 WIB",
  },
  {
    icon: MapPin,
    label: "Lokasi",
    value: profile.location,
    description: "Tersedia untuk kerja remote",
  },
] as const;

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Kontak"
          title="Punya ide? Mari bicarakan."
          description="Saya terbuka untuk proyek freelance, kolaborasi, atau sekadar berdiskusi tentang web dan desain. Ceritakan kebutuhan Anda lewat form di samping."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MessageSquare className="h-4 w-4 text-accent" aria-hidden="true" />
                Informasi kontak
              </div>

              <ul className="mt-5 space-y-5">
                {contactItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.label} className="flex gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        {"href" in item && item.href ? (
                          <a
                            href={item.href}
                            className="mt-0.5 block break-words text-sm font-medium transition-colors hover:text-accent"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-0.5 text-sm font-medium">{item.value}</p>
                        )}
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs text-muted-foreground">Temukan saya di</p>
                <SocialLinks className="mt-2.5" />
              </div>
            </div>

            <div className="rounded-3xl border border-accent/20 bg-accent-soft p-6">
              <div className="flex items-center gap-2 text-accent">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <p className="text-sm font-semibold">Waktu respons</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                {profile.responseTime}. Untuk urusan mendesak, silakan hubungi
                nomor telepon yang tertera.
              </p>
              <Link
                href={`mailto:${profile.email}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              >
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                Kirim email langsung
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <div className="mb-6">
              <h3 className="font-display text-xl font-bold">Kirim pesan</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Isi form berikut. Kolom bertanda <span className="text-accent">*</span>{" "}
                wajib diisi.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
