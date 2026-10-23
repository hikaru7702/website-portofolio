import Link from "next/link";
import { FileText } from "lucide-react";
import { Timeline } from "@/components/skills/Timeline";
import { buttonStyles } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  return (
    <section
      id="experience"
      className="border-y border-border/70 bg-muted/30 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Perjalanan"
            title="Pengalaman & pendidikan"
            description="Jejak langkah yang membentuk cara saya bekerja — dari proyek freelance, tim produk, sampai bangku kuliah."
          />
          <Link
            href="/cv"
            className={buttonStyles({ variant: "outline", className: "w-fit" })}
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Lihat CV lengkap
          </Link>
        </div>

        <div className="mt-8">
          <Timeline />
        </div>
      </div>
    </section>
  );
}
