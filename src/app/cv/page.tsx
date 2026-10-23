import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { PrintButton } from "@/app/cv/PrintButton";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { buttonStyles } from "@/components/ui/Button";
import { experiences } from "@/lib/data/experiences";
import { profile } from "@/lib/data/profile";
import { projects } from "@/lib/data/projects";
import { coreSkills, toolSkills } from "@/lib/data/skills";
import { absoluteUrl } from "@/lib/site";
import { formatRange } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "CV",
  description: `Curriculum Vitae ${profile.name} — ${profile.role}.`,
  alternates: { canonical: absoluteUrl("/cv/") },
};

export default function CvPage() {
  const workExperiences = experiences.filter(
    (experience) => experience.type === "work"
  );
  const educationExperiences = experiences.filter(
    (experience) => experience.type === "education"
  );
  const selectedProjects = projects.filter((project) => project.featured);

  return (
    <>
      <Navigation />
      <main
        id="main-content"
        className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6 print:max-w-none print:p-0"
      >
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className={buttonStyles({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali ke portofolio
          </Link>
          <PrintButton />
        </div>

        <article className="print-plain rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10">
          <header className="border-b border-border pb-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-fuchsia-500 font-display text-2xl font-bold text-white print:hidden">
                  {profile.initials}
                </span>
                <div>
                  <h1 className="font-display text-3xl font-bold tracking-tight">
                    {profile.name}
                  </h1>
                  <p className="mt-1 text-sm font-medium text-accent">{profile.role}</p>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                    {profile.headline}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 hover:text-accent"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {profile.email}
              </a>
              <a
                href={`tel:${profile.phoneHref}`}
                className="inline-flex items-center gap-1.5 hover:text-accent"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {profile.phone}
              </a>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {profile.location}
              </span>
            </div>
            <SocialLinks className="no-print mt-4" />
          </header>

          <section className="mt-7">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Profil
            </h2>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              {profile.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="mt-7">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
              Pengalaman kerja
            </h2>
            <div className="mt-4 space-y-5">
              {workExperiences.map((experience) => (
                <div key={experience._id}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-sm font-bold">{experience.role}</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatRange(experience.start, experience.end)}
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-accent">
                    {experience.org} · {experience.location}
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-relaxed text-muted-foreground">
                    {experience.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-7">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              Pendidikan
            </h2>
            <div className="mt-4 space-y-4">
              {educationExperiences.map((experience) => (
                <div key={experience._id}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-sm font-bold">{experience.role}</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatRange(experience.start, experience.end)}
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-accent">
                    {experience.org} · {experience.location}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-7">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Keahlian
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium">Core</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {coreSkills.map((skill) => skill.name).join(" · ")}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium">Tools</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {toolSkills.map((skill) => skill.name).join(" · ")}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-7">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Proyek terpilih
            </h2>
            <div className="mt-3 space-y-3">
              {selectedProjects.map((project) => (
                <div key={project._id}>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-sm font-bold">{project.title}</h3>
                    <p className="text-xs text-muted-foreground">{project.year}</p>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {project.summary}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {project.tags.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-8 border-t border-border pt-4 text-[10px] text-muted-foreground">
            Referensi portofolio lengkap: {profile.siteName} · Diperbarui{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </footer>
        </article>
      </main>
    </>
  );
}
