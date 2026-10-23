import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass, Mail } from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { buttonStyles } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main
        id="main-content"
        className="grid min-h-screen place-items-center px-4 pb-20 pt-28"
      >
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent-soft text-accent">
            <Compass className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="mt-6 font-mono text-sm font-semibold text-accent">404</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Halaman tidak ditemukan
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Tautan yang Anda buka mungkin sudah dipindahkan atau tidak pernah ada.
            Mari kembali ke halaman utama.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
            <Link href="/" className={buttonStyles()}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali ke beranda
            </Link>
            <Link
              href="/#contact"
              className={buttonStyles({ variant: "outline" })}
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Hubungi saya
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
