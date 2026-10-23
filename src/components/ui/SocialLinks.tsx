import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { profile, type SocialIcon } from "@/lib/data/profile";
import { cn } from "@/lib/utils/cn";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  mail: Mail,
} satisfies Record<SocialIcon, typeof Github>;

export function SocialLinks({
  className,
  linkClassName,
  showLabels = false,
}: {
  className?: string;
  linkClassName?: string;
  showLabels?: boolean;
}) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)}>
      {profile.socials.map((social) => {
        const Icon = iconMap[social.icon];
        const isExternal = social.href.startsWith("http");

        return (
          <li key={social.label}>
            <a
              href={social.href}
              aria-label={social.label}
              title={social.label}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent",
                showLabels ? "h-10 px-4 text-sm font-medium" : "h-10 w-10",
                linkClassName
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {showLabels ? <span>{social.label}</span> : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
