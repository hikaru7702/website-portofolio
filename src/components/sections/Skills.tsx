"use client";

import { ArrowUpRight, MousePointerClick, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { RadarChart } from "@/components/skills/RadarChart";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { coreSkills, toolSkills, type Skill } from "@/lib/data/skills";
import { requestWorksFilter } from "@/lib/events";

function SkillName({ skill, className }: { skill: Skill; className?: string }) {
  if (!skill.filterTag) {
    return <span className={className}>{skill.name}</span>;
  }

  return (
    <button
      type="button"
      onClick={() => requestWorksFilter({ tag: skill.filterTag })}
      title={`Lihat proyek yang menggunakan ${skill.name}`}
      className={`${className ?? ""} group inline-flex items-center gap-1 text-left transition-colors hover:text-accent`}
    >
      {skill.name}
      <ArrowUpRight
        className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    </button>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Keahlian"
            title="Alat & kemampuan"
            description="Kombinasi keterampilan teknis dan desain yang saya gunakan setiap hari untuk membangun produk digital."
          />
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs text-muted-foreground">
            <MousePointerClick className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            Klik skill untuk memfilter karya
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold">Radar kompetensi</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Enam kompetensi inti yang paling sering saya gunakan.
                </p>
              </div>
              <Badge tone="accent">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Core
              </Badge>
            </div>

            <div className="mt-3">
              <RadarChart skills={coreSkills} />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                Level 5 = mahir
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-border" aria-hidden="true" />
                Skala 1–5
              </span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:col-span-2 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-bold">Keahlian teknis</h3>
                <Badge tone="outline">{coreSkills.length} inti</Badge>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {coreSkills.map((skill) => (
                  <div key={skill._id}>
                    <div className="flex items-center justify-between gap-3">
                      <SkillName
                        skill={skill}
                        className="text-sm font-medium text-foreground"
                      />
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {skill.yearsOfUse
                          ? `${skill.yearsOfUse} thn`
                          : `Level ${skill.level}/5`}
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={`Tingkat ${skill.name}`}
                      aria-valuemin={1}
                      aria-valuemax={5}
                      aria-valuenow={skill.level}
                      aria-valuetext={`${skill.level} dari 5`}
                      className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-fuchsia-500 transition-[width] duration-700"
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-accent" aria-hidden="true" />
                <h3 className="font-display text-base font-bold">Tools</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {toolSkills.map((skill) => (
                  <SkillName
                    key={skill._id}
                    skill={skill}
                    className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-accent/20 bg-accent-soft p-6">
              <div className="flex items-center gap-2 text-accent">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <h3 className="font-display text-base font-bold">Fokus kerja</h3>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
                <li>Performa &amp; Core Web Vitals</li>
                <li>Aksesibilitas WCAG</li>
                <li>Design system yang konsisten</li>
                <li>Kode yang mudah dirawat</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
