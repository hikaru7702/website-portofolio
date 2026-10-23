"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Github,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import type { Project } from "@/lib/data/projects";
import { projectCategoryMap } from "@/lib/data/projects";

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [onClose]);

  const paragraphs = project.body.split(/\n\n+/);
  const categoryLabels = project.category.map(
    (category) => projectCategoryMap.get(category) ?? category
  );

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/65 p-3 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-modal-title-${project.slug}`}
        aria-describedby={`project-modal-summary-${project.slug}`}
        tabIndex={-1}
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl outline-none"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted sm:aspect-[2/1]">
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            priority
            quality={82}
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              {project.featured ? <Badge tone="accent">Featured</Badge> : null}
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                {project.year}
              </span>
              {categoryLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur"
                >
                  {label}
                </span>
              ))}
            </div>
            <h2
              id={`project-modal-title-${project.slug}`}
              className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              {project.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup detail proyek"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
            <div>
              <p
                id={`project-modal-summary-${project.slug}`}
                className="text-sm font-medium leading-relaxed text-foreground"
              >
                {project.summary}
              </p>

              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm">
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs text-muted-foreground">Peran</dt>
                    <dd className="mt-0.5 font-medium">{project.role}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Durasi</dt>
                    <dd className="mt-0.5 font-medium">{project.duration}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Tahun</dt>
                    <dd className="mt-0.5 font-medium">{project.year}</dd>
                  </div>
                </dl>
              </div>

              {project.highlights.length > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold">Sorotan</h3>
                  <ul className="mt-2 space-y-2">
                    {project.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex gap-2 text-xs leading-relaxed text-muted-foreground"
                      >
                        <CheckCircle2
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>

          <div className="mt-7 flex flex-col gap-2 border-t border-border pt-5 sm:flex-row sm:items-center">
            <Link
              href={`/works/${project.slug}`}
              className={buttonStyles({ className: "w-full sm:w-auto" })}
            >
              Buka halaman proyek
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {project.externalUrl ? (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({
                  variant: "outline",
                  className: "w-full sm:w-auto",
                })}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Situs
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({
                  variant: "outline",
                  className: "w-full sm:w-auto",
                })}
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                Kode
              </a>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className={buttonStyles({
                variant: "ghost",
                className: "w-full sm:ml-auto sm:w-auto",
              })}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
