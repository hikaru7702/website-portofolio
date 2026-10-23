"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { buttonStyles } from "@/components/ui/Button";
import { profile } from "@/lib/data/profile";
import { focusWorksSearch, queueWorksSearchFocus } from "@/lib/events";
import { cn } from "@/lib/utils/cn";

const sections = [
  { id: "hero", label: "Beranda" },
  { id: "works", label: "Karya" },
  { id: "skills", label: "Keahlian" },
  { id: "experience", label: "Pengalaman" },
  { id: "contact", label: "Kontak" },
] as const;

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isHome || !("IntersectionObserver" in window)) return;

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.5] }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function sectionHref(sectionId: string) {
    return isHome ? `#${sectionId}` : `/#${sectionId}`;
  }

  function handleSearch() {
    setIsOpen(false);

    if (!isHome) {
      queueWorksSearchFocus();
      router.push("/#works");
      return;
    }

    document.getElementById("works")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(focusWorksSearch, 350);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "border-border/80 bg-background/85 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-background/60 backdrop-blur-md"
      )}
    >
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          aria-label={`${profile.name} — kembali ke beranda`}
          className="group flex items-center gap-3 rounded-full pr-2"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent to-fuchsia-500 text-sm font-bold text-white shadow-sm transition-transform duration-300 group-hover:-rotate-6">
            {profile.initials}
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-sm font-bold">{profile.name}</span>
            <span className="mt-1 text-[11px] text-muted-foreground">{profile.role}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {sections.map((section) => {
            const isActive = isHome && activeSection === section.id;

            return (
              <Link
                key={section.id}
                href={sectionHref(section.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {section.label}
                {isActive ? (
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-accent" />
                ) : null}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleSearch}
            aria-label="Cari karya"
            title="Cari karya"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <ThemeToggle />
          <Link
            href={isHome ? "#contact" : "/#contact"}
            className={buttonStyles({
              size: "sm",
              className: "ml-1 hidden sm:inline-flex",
            })}
          >
            Hubungi
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          >
            {isOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 top-16 z-40 cursor-default bg-black/20 backdrop-blur-sm lg:hidden"
          />
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-16 z-50 animate-fade-in border-b border-border bg-background p-4 shadow-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={sectionHref(section.id)}
                  onClick={() => setIsOpen(false)}
                  aria-current={
                    isHome && activeSection === section.id ? "page" : undefined
                  }
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isHome && activeSection === section.id
                      ? "bg-accent-soft text-accent"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {section.label}
                </Link>
              ))}
              <Link
                href={isHome ? "#contact" : "/#contact"}
                onClick={() => setIsOpen(false)}
                className={buttonStyles({ className: "mt-3 w-full" })}
              >
                Hubungi Saya
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
