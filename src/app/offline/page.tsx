import type { Metadata } from "next";
import Link from "next/link";
import { Home, WifiOff } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Mode offline",
  description: "Halaman ini belum tersedia saat offline.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main
      id="main-content"
      className="grid min-h-screen place-items-center px-4 py-20"
    >
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300">
          <WifiOff className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">
          Anda sedang offline
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Halaman ini belum tersimpan di perangkat Anda. Kembali ke beranda untuk
          membuka konten yang sudah pernah dikunjungi.
        </p>
        <Link
          href="/"
          className={buttonStyles({ className: "mt-6 w-full" })}
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
