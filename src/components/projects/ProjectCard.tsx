import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import type { Project } from "@/lib/data/projects";
import { projectCategoryMap } from "@/lib/data/projects";
import { cn } from "@/lib/utils/cn";

export function ProjectCard({
  project,
  onSelect,
  priority = false,
}: {
  project: Project;
  onSelect: () => void;
  priority?: boolean;
}) {
  const categoryLabels = project.category
    .map((category) => projectCategoryMap.get(category) ?? category)
    .join(" · ");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-soft">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={project.cover}
          alt={project.coverAlt}
          fill
          priority={priority}
          quality={78}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-80" />

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          {project.featured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-zinc-900 shadow-sm backdrop-blur">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
              Featured
            </span>
          ) : (
            <span />
          )}
          <span className="rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            {project.year}
          </span>
        </div>

        <p className="pointer-events-none absolute bottom-3 left-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white/85">
          {categoryLabels}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          <span>{project.role}</span>
          <span aria-hidden="true">·</span>
          <span>{project.duration}</span>
        </div>

        <h3 className="mt-2 font-display text-xl font-bold tracking-tight transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 ? (
            <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
              +{project.tags.length - 4}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4 text-xs">
          <span className="text-muted-foreground">Klik untuk detail</span>
          <span className="inline-flex items-center gap-1 font-semibold text-accent">
            Lihat proyek
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSelect}
        aria-label={`Lihat detail proyek ${project.title}`}
        aria-haspopup="dialog"
        className={cn(
          "absolute inset-0 z-10 rounded-2xl",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        )}
      />
    </article>
  );
}
