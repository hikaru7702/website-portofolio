"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw, WifiOff, X } from "lucide-react";
import { basePath } from "@/lib/site";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const INSTALL_DISMISS_KEY = "portfolio-install-dismissed-at";
const INSTALL_PROMPT_DELAY_MS = 12_000;
const INSTALL_DISMISS_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function wasInstallDismissedRecently() {
  try {
    const dismissedAt = Number(window.localStorage.getItem(INSTALL_DISMISS_KEY));
    return (
      Number.isFinite(dismissedAt) &&
      dismissedAt > 0 &&
      Date.now() - dismissedAt < INSTALL_DISMISS_WINDOW_MS
    );
  } catch {
    return false;
  }
}

function rememberInstallDismissal() {
  try {
    window.localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now()));
  } catch {
    // localStorage dapat diblokir pada mode privat; prompt tetap bisa ditutup.
  }
}

export function PWAProvider() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    let installTimer: number | undefined;
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);

      if (wasInstallDismissedRecently()) return;

      installTimer = window.setTimeout(
        () => setShowInstall(true),
        INSTALL_PROMPT_DELAY_MS
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    let removeLoadListener: (() => void) | undefined;

    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register(
            `${basePath}/sw.js`,
            { scope: `${basePath}/` }
          );

          if (registration.waiting && navigator.serviceWorker.controller) {
            setWaitingWorker(registration.waiting);
          }

          registration.addEventListener("updatefound", () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;

            installingWorker.addEventListener("statechange", () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setWaitingWorker(installingWorker);
              }
            });
          });
        } catch (error) {
          console.warn("Registrasi service worker gagal:", error);
        }
      };

      if (document.readyState === "complete") {
        void registerServiceWorker();
      } else {
        const handleLoad = () => void registerServiceWorker();
        window.addEventListener("load", handleLoad, { once: true });
        removeLoadListener = () => window.removeEventListener("load", handleLoad);
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.clearTimeout(installTimer);
      removeLoadListener?.();
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setShowInstall(false);
    }

    setInstallPrompt(null);
  }

  function handleDismissInstall() {
    setShowInstall(false);
    setInstallDismissed(true);
    rememberInstallDismissal();
  }

  function handleReload() {
    if (!waitingWorker) return;
    waitingWorker.postMessage({ type: "SKIP_WAITING" });
    window.setTimeout(() => window.location.reload(), 500);
  }

  return (
    <>
      {isOffline ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 top-0 z-[90] flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-amber-950 print:hidden"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          Anda sedang offline. Konten yang pernah dibuka tetap dapat diakses.
        </div>
      ) : null}

      <div className="fixed bottom-4 right-4 z-[90] flex max-w-[calc(100vw-2rem)] flex-col gap-2 print:hidden">
        {showInstall && !installDismissed ? (
          <div
            role="status"
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
              <Download className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Pasang sebagai aplikasi</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Akses portofolio lebih cepat, bahkan saat offline.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleInstall()}
                  className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:bg-accent-hover"
                >
                  Pasang
                </button>
                <button
                  type="button"
                  onClick={handleDismissInstall}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Nanti saja
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismissInstall}
              aria-label="Tutup ajakan pemasangan"
              className="ml-1 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {waitingWorker ? (
          <div
            role="status"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
          >
            <RefreshCw className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <p className="min-w-0 flex-1 text-sm">Versi baru portofolio tersedia.</p>
            <button
              type="button"
              onClick={handleReload}
              className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:bg-accent-hover"
            >
              Muat ulang
            </button>
            <button
              type="button"
              onClick={() => setWaitingWorker(null)}
              aria-label="Tutup notifikasi pembaruan"
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
