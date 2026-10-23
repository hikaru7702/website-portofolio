"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  ChevronDown,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/lib/data/projects";
import { projectCategories, projects } from "@/lib/data/projects";
import {
  consumeWorksSearchFocus,
  WORKS_FILTER_EVENT,
  WORKS_SEARCH_FOCUS_EVENT,
  type WorksFilterDetail,
} from "@/lib/events";
import { cn } from "@/lib/utils/cn";

type SortOption = "newest" | "oldest" | "title";

const sortLabels: Record<SortOption, string> = {
  newest: "Terbaru",
  oldest: "Terlama",
  title: "Judul A–Z",
};

const validCategoryIds = new Set(projectCategories.map((category) => category.id));

export function Showcase() {
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [initialized, setInitialized] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setQuery(queryInput.trim().toLowerCase());
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [queryInput]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("q") ?? "";
    const categoryParam = params.get("category");
    const tagParam = params.get("tag");
    const sortParam = params.get("sort");

    if (queryParam) {
      setQueryInput(queryParam);
      setQuery(queryParam.trim().toLowerCase());
    }

    if (categoryParam) {
      const categories = categoryParam
        .split(",")
        .map((category) => category.trim())
        .filter((category) => validCategoryIds.has(category as never));
      if (categories.length > 0) setSelectedCategories(categories);
    }

    if (tagParam) setActiveTag(tagParam);

    if (sortParam === "newest" || sortParam === "oldest" || sortParam === "title") {
      setSort(sortParam);
    }

    let focusTimer: number | undefined;
    const focusFromStorage = consumeWorksSearchFocus();
    if (params.get("focus") === "search" || focusFromStorage) {
      focusTimer = window.setTimeout(() => {
        document
          .getElementById("works")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        searchRef.current?.focus({ preventScroll: true });
      }, 350);
    }

    setInitialized(true);

    return () => window.clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const params = new URLSearchParams();
    if (queryInput.trim()) params.set("q", queryInput.trim());
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }
    if (activeTag) params.set("tag", activeTag);
    if (sort !== "newest") params.set("sort", sort);

    const queryString = params.toString();
    const nextUrl = `${window.location.pathname}${
      queryString ? `?${queryString}` : ""
    }${window.location.hash}`;

    window.history.replaceState(null, "", nextUrl);
  }, [activeTag, initialized, queryInput, selectedCategories, sort]);

  useEffect(() => {
    const handleFilter = (event: Event) => {
      const detail = (event as CustomEvent<WorksFilterDetail>).detail;
      if (!detail) return;

      if (detail.tag) {
        setActiveTag(detail.tag);
        setQueryInput("");
        setQuery("");
        setSelectedCategories([]);
      }

      if (detail.category && validCategoryIds.has(detail.category as never)) {
        setSelectedCategories([detail.category]);
      }

      window.setTimeout(() => {
        document.getElementById("works")?.scrollIntoView({ behavior: "smooth" });
      }, 30);
    };

    const handleSearchFocus = () => {
      searchRef.current?.focus({ preventScroll: true });
    };

    window.addEventListener(WORKS_FILTER_EVENT, handleFilter);
    window.addEventListener(WORKS_SEARCH_FOCUS_EVENT, handleSearchFocus);

    return () => {
      window.removeEventListener(WORKS_FILTER_EVENT, handleFilter);
      window.removeEventListener(WORKS_SEARCH_FOCUS_EVENT, handleSearchFocus);
    };
  }, []);

  const filteredProjects = useMemo(() => {
    const result = projects.filter((project) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        project.category.some((category) => selectedCategories.includes(category));

      const matchesTag =
        !activeTag ||
        project.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase());

      const searchableText = [
        project.title,
        project.summary,
        project.role,
        ...project.tags,
        ...project.category,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      return matchesCategory && matchesTag && matchesSearch;
    });

    return [...result].sort((a, b) => {
      if (sort === "oldest") return a.year - b.year;
      if (sort === "title") return a.title.localeCompare(b.title, "id");
      return b.year - a.year || Number(b.featured) - Number(a.featured);
    });
  }, [activeTag, query, selectedCategories, sort]);

  const categoryCounts = useMemo(() => {
    return projectCategories.reduce<Record<string, number>>((counts, category) => {
      counts[category.id] = projects.filter((project) =>
        project.category.includes(category.id)
      ).length;
      return counts;
    }, {});
  }, []);

  const hasActiveFilters =
    queryInput.trim().length > 0 ||
    selectedCategories.length > 0 ||
    activeTag !== null;

  function toggleCategory(categoryId: string) {
    setSelectedCategories((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    );
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    setSort(event.target.value as SortOption);
  }

  function handleReset() {
    setQueryInput("");
    setQuery("");
    setSelectedCategories([]);
    setActiveTag(null);
    setSort("newest");
    searchRef.current?.focus({ preventScroll: true });
  }

  const closeModal = useCallback(() => setSelectedProject(null), []);

  return (
    <>
      <section
        id="works"
        className="relative border-y border-border/70 bg-muted/30 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Portofolio"
              title="Karya terpilih"
              description="Kumpulan proyek yang pernah saya kerjakan — dari aplikasi web, mobile, sampai design system. Gunakan filter untuk menemukan yang relevan."
            />
            <Badge tone="accent" className="w-fit shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              {projects.length} proyek
            </Badge>
          </div>

          <div className="mt-9 flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Kategori
              </span>
              <button
                type="button"
                onClick={() => setSelectedCategories([])}
                aria-pressed={selectedCategories.length === 0}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  selectedCategories.length === 0
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground"
                )}
              >
                Semua
              </button>
              {projectCategories.map((category) => {
                const isSelected = selectedCategories.includes(category.id);

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                      isSelected
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground"
                    )}
                  >
                    {category.label}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px]",
                        isSelected
                          ? "bg-accent-foreground/15 text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {categoryCounts[category.id] ?? 0}
                    </span>
                  </button>
                );
              })}

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Reset filter
                </button>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <label htmlFor="works-search" className="sr-only">
                  Cari proyek berdasarkan judul, deskripsi, atau teknologi
                </label>
                <input
                  ref={searchRef}
                  id="works-search"
                  type="text"
                  value={queryInput}
                  onChange={(event) => setQueryInput(event.target.value)}
                  placeholder="Cari proyek, teknologi, atau peran..."
                  className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                {queryInput ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQueryInput("");
                      searchRef.current?.focus();
                    }}
                    aria-label="Hapus pencarian"
                    className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>

              <div className="relative shrink-0">
                <label htmlFor="works-sort" className="sr-only">
                  Urutkan proyek
                </label>
                <select
                  id="works-sort"
                  value={sort}
                  onChange={handleSortChange}
                  className="h-12 w-full appearance-none rounded-full border border-border bg-card pl-4 pr-10 text-sm font-medium outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 md:w-44"
                >
                  {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                    <option key={option} value={option}>
                      {sortLabels[option]}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span role="status" aria-live="polite">
                Menampilkan <strong className="font-semibold text-foreground">{filteredProjects.length}</strong>{" "}
                dari {projects.length} proyek
              </span>
              {activeTag ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
                  Tag: {activeTag}
                  <button
                    type="button"
                    onClick={() => setActiveTag(null)}
                    aria-label={`Hapus filter tag ${activeTag}`}
                    className="rounded-full p-0.5 hover:bg-accent/15"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              ) : null}
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  onSelect={() => setSelectedProject(project)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
                <SearchX className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">
                Tidak ada proyek yang cocok
              </h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Coba kata kunci lain atau hapus beberapa filter untuk melihat
                lebih banyak karya.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className={buttonStyles({ variant: "outline", className: "mt-5" })}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Reset semua filter
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedProject ? (
        <ProjectModal project={selectedProject} onClose={closeModal} />
      ) : null}
    </>
  );
}
