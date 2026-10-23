import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Github,
  UserRound,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import {
  getProjectBySlug,
  projectCategoryMap,
  projects,
} from "@/lib/data/projects";
import { profile } from "@/lib/data/profile";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  ""
);

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Proyek tidak ditemukan" };
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/works/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `/works/${project.slug}`,
      images: [
        {
          url: project.cover,
          width: 1200,
          height: 750,
          alt: project.coverAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [project.cover],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const paragraphs = project.body.split(/\n\n+/);
  const categoryLabels = project.category.map(
    (category) => projectCategoryMap.get(category) ?? category
  );

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    dateCreated: String(project.year),
    keywords: project.tags.join(", "),
    image: `${siteUrl}${project.cover}`,
    url: `${siteUrl}/works/${project.slug}`,
    author: {
      "@type": "Person",
      name: profile.name,
    },
  };

  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-16">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <Link
            href="/#works"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Semua karya
          </Link>
        </div>

        <article>
          <header className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <div className="relative aspect-[16/9] max-h-[540px] w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-soft">
              <Image
                src={project.cover}
                alt={project.coverAlt}
                fill
                priority
                quality={85}
                sizes="(max-width: 1280px) 100vw, 1216px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
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
                <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {project.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                  {project.summary}
                </p>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                  Peran
                </p>
                <p className="mt-1 text-sm font-semibold">{project.role}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  Durasi
                </p>
                <p className="mt-1 text-sm font-semibold">{project.duration}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  Tahun
                </p>
                <p className="mt-1 text-sm font-semibold">{project.year}</p>
              </div>
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_17rem]">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Tentang proyek
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {project.highlights.length > 0 ? (
                  <div className="mt-10">
                    <h2 className="font-display text-2xl font-bold tracking-tight">
                      Sorotan
                    </h2>
                    <ul className="mt-4 space-y-3">
                      {project.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                        >
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                            aria-hidden="true"
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <aside className="space-y-3">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h2 className="text-sm font-semibold">Tertarik dengan proyek serupa?</h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    Saya terbuka untuk diskusi proyek baru atau kolaborasi.
                  </p>
                  <Link
                    href="/#contact"
                    className={buttonStyles({ className: "mt-4 w-full", size: "sm" })}
                  >
                    Hubungi saya
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                {project.externalUrl || project.repoUrl ? (
                  <div className="space-y-2 rounded-2xl border border-border bg-card p-5">
                    <h2 className="text-sm font-semibold">Tautan</h2>
                    {project.externalUrl ? (
                      <a
                        href={project.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonStyles({
                          variant: "outline",
                          size: "sm",
                          className: "w-full",
                        })}
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        Kunjungi situs
                      </a>
                    ) : null}
                    {project.repoUrl ? (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonStyles({
                          variant: "outline",
                          size: "sm",
                          className: "w-full",
                        })}
                      >
                        <Github className="h-3.5 w-3.5" aria-hidden="true" />
                        Kode sumber
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </aside>
            </div>

            {nextProject ? (
              <nav
                aria-label="Proyek berikutnya"
                className="mt-14 border-t border-border pt-8"
              >
                <Link
                  href={`/works/${nextProject.slug}`}
                  className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition-all hover:border-accent/40 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between"
                >
                  <span>
                    <span className="text-xs text-muted-foreground">Proyek berikutnya</span>
                    <span className="mt-1 block font-display text-lg font-bold transition-colors group-hover:text-accent">
                      {nextProject.title}
                    </span>
                  </span>
                  <ArrowRight
                    className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </nav>
            ) : null}
          </div>
        </article>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
    </>
  );
}
