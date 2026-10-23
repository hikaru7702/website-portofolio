export const WORKS_FILTER_EVENT = "portfolio:filter-works";
export const WORKS_SEARCH_FOCUS_EVENT = "portfolio:focus-works-search";
const WORKS_SEARCH_FOCUS_KEY = "portfolio-focus-works-search";

export interface WorksFilterDetail {
  tag?: string;
  category?: string;
}

export function requestWorksFilter(detail: WorksFilterDetail) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent<WorksFilterDetail>(WORKS_FILTER_EVENT, { detail }));
  document.getElementById("works")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function focusWorksSearch() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(WORKS_SEARCH_FOCUS_EVENT));
}

export function queueWorksSearchFocus() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(WORKS_SEARCH_FOCUS_KEY, "1");
  } catch {
    // sessionStorage dapat diblokir; navigasi tetap berjalan.
  }
}

export function consumeWorksSearchFocus() {
  if (typeof window === "undefined") return false;

  try {
    const queued = window.sessionStorage.getItem(WORKS_SEARCH_FOCUS_KEY) === "1";
    if (queued) window.sessionStorage.removeItem(WORKS_SEARCH_FOCUS_KEY);
    return queued;
  } catch {
    return false;
  }
}
