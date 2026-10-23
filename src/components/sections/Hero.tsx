import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Code2,
  Download,
  Layers,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { profile } from "@/lib/data/profile";
import { projects } from "@/lib/data/projects";
import { coreSkills } from "@/lib/data/skills";

const floatingTech = [
  { label: "React", className: "-left-4 -top-5", delay: "0s" },
  { label: "TypeScript", className: "-right-4 -top-5", delay: "1.2s" },
  { label: "Next.js", className: "-left-4 -bottom-5", delay: "0.6s" },
  { label: "Tailwind", className: "-right-4 -bottom-5", delay: "1.8s" },
];

export function Hero() {
  const stats = [
    {
      value: `${profile.yearsOfExperience}+`,
      label: "Tahun pengalaman",
      icon: Clock,
    },
    {
      value: `${projects.length}`,
      label: "Proyek dikerjakan",
      icon: Layers,
    },
    {
      value: `${coreSkills.length}`,
      label: "Skill inti",
      icon: Zap,
    },
  ];

  return (
    <section id="hero" className="relative overflow-hidden pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-radial opacity-70" />
        <div className="absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl dark:bg-accent/10" />
        <div className="absolute -right-32 top-40 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {profile.availability}
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Halo, saya <span className="text-gradient">{profile.name}</span>.
            </h1>

            <p className="mt-5 max-w-xl font-display text-2xl font-semibold leading-snug tracking-tight text-muted-foreground sm:text-3xl">
              {profile.headline}
            </p>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {profile.tagline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#works" className={buttonStyles({ size: "lg" })}>
                Lihat Karya
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/cv"
                className={buttonStyles({ variant: "outline", size: "lg" })}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Lihat CV
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
                {profile.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent" aria-hidden="true" />
                {profile.responseTime}
              </span>
              <SocialLinks />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {floatingTech.map((tech) => (
              <span
                key={tech.label}
                aria-hidden="true"
                style={{ animationDelay: tech.delay }}
                className={`absolute z-20 hidden animate-float items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-soft lg:inline-flex ${tech.className}`}
              >
                <Code2 className="h-3.5 w-3.5 text-accent" />
                {tech.label}
              </span>
            ))}

            <div className="relative z-10 rounded-[2rem] border border-border bg-card p-2 shadow-soft">
              <div className="relative overflow-hidden rounded-[1.6rem] border border-border/70 bg-gradient-to-br from-accent-soft via-card to-card p-6 sm:p-8">
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/15 blur-2xl"
                />

                <div className="relative flex items-center gap-5">
                  <div className="relative">
                    <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-accent to-fuchsia-500 font-display text-3xl font-bold text-white shadow-glow">
                      {profile.initials}
                    </div>
                    <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-emerald-500 text-white">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {profile.role}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold">{profile.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{profile.location}</p>
                  </div>
                </div>

                <div className="relative mt-7 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card/80">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="px-3 py-4 text-center">
                        <Icon
                          className="mx-auto mb-1.5 h-4 w-4 text-accent"
                          aria-hidden="true"
                        />
                        <p className="font-display text-xl font-bold leading-none">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-[10px] leading-tight text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="relative mt-5">
                  <p className="text-xs font-medium text-muted-foreground">Tech stack favorit</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {coreSkills.slice(0, 5).map((skill) => (
                      <span
                        key={skill._id}
                        className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative mt-6 flex items-center justify-between border-t border-border/70 pt-4">
                  <span className="text-xs text-muted-foreground">
                    Siap membantu ide Anda
                  </span>
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    Mulai diskusi
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
