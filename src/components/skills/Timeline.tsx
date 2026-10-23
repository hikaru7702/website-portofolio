"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { experiences, type Experience } from "@/lib/data/experiences";
import { cn } from "@/lib/utils/cn";
import { formatMonth } from "@/lib/utils/date";

type ExperienceFilter = "all" | "work" | "education";

const filters: { id: ExperienceFilter; label: string; icon: typeof Briefcase }[] = [
  { id: "all", label: "Semua", icon: CheckCircle2 },
  { id: "work", label: "Pekerjaan", icon: Briefcase },
  { id: "education", label: "Pendidikan", icon: GraduationCap },
];

export function Timeline() {
  const [filter, setFilter] = useState<ExperienceFilter>("all");
  const listRef = useRef<HTMLOListElement>(null);

  const items = useMemo(() => {
    return experiences
      .filter((experience) => filter === "all" || experience.type === filter)
      .sort((a, b) => b.start.localeCompare(a.start));
  }, [filter]);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>("[data-timeline-item]")
    );

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter pengalaman"
        className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-card p-1"
      >
        {filters.map((item) => {
          const Icon = item.icon;
          const count =
            item.id === "all"
              ? experiences.length
              : experiences.filter((experience) => experience.type === item.id).length;
          const isActive = filter === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {item.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px]",
                  isActive
                    ? "bg-accent-foreground/15 text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <ol
        ref={listRef}
        className="relative mt-9 space-y-7 before:absolute before:bottom-4 before:left-[15px] before:top-2 before:w-px before:bg-border lg:before:left-1/2 lg:before:-translate-x-1/2"
      >
        {items.map((experience, index) => (
          <TimelineItem key={experience._id} experience={experience} index={index} />
        ))}
      </ol>
    </div>
  );
}

function TimelineItem({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  const isEven = index % 2 === 0;
  const isWork = experience.type === "work";
  const Icon = isWork ? Briefcase : GraduationCap;

  return (
    <li
      data-timeline-item
      style={{ transitionDelay: `${index * 60}ms` }}
      className={cn(
        "reveal relative lg:grid lg:grid-cols-2 lg:gap-16",
        isEven ? "" : ""
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-[9px] top-6 z-10 h-3.5 w-3.5 rounded-full border-2 border-background ring-4 ring-background lg:left-1/2 lg:-translate-x-1/2",
          isWork ? "bg-accent" : "bg-emerald-500"
        )}
      />

      <div
        className={cn(
          "ml-10 lg:ml-0",
          isEven ? "lg:col-start-1 lg:pr-2" : "lg:col-start-2 lg:pl-2"
        )}
      >
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-accent/30 hover:shadow-soft sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={isWork ? "accent" : "success"}>
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {isWork ? "Pekerjaan" : "Pendidikan"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              <time dateTime={experience.start}>{formatMonth(experience.start)}</time>
              <span aria-hidden="true"> — </span>
              {experience.end ? (
                <time dateTime={experience.end}>{formatMonth(experience.end)}</time>
              ) : (
                <span>Sekarang</span>
              )}
            </span>
          </div>

          <h3 className="mt-3 font-display text-lg font-bold tracking-tight">
            {experience.role}
          </h3>
          <p className="mt-0.5 text-sm font-medium text-accent">
            {experience.orgUrl ? (
              <a
                href={experience.orgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                {experience.org}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            ) : (
              experience.org
            )}
          </p>

          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {experience.location}
          </p>

          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {experience.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2">
                <CheckCircle2
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border/70 pt-4">
            {experience.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </article>
      </div>
    </li>
  );
}
