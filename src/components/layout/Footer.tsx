import Link from "next/link";
import { ArrowUp, Mail, MapPin } from "lucide-react";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { profile } from "@/lib/data/profile";

const footerLinks = [
  { href: "/#works", label: "Karya" },
  { href: "/#skills", label: "Keahlian" },
  { href: "/#experience", label: "Pengalaman" },
  { href: "/#contact", label: "Kontak" },
  { href: "/cv", label: "CV" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-fuchsia-500 font-bold text-white">
                {profile.initials}
              </span>
              <span className="font-display text-lg font-bold">{profile.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {profile.tagline}
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {profile.availability}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Navigasi</h2>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Mari terhubung</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {profile.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {profile.location}
              </li>
            </ul>
            <SocialLinks className="mt-5" />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}. Dibangun dengan Next.js, Tailwind CSS, dan PWA.
          </p>
          <Link
            href="#hero"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
          >
            Kembali ke atas
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
