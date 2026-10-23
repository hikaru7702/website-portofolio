const fallbackSiteUrl = "http://localhost:3000";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl
).replace(/\/+$/, "");

export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(
  /\/+$/,
  ""
);

export function publicPath(path: string) {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteUrl(path = "") {
  return `${siteUrl}${path.startsWith("/") ? path : path ? `/${path}` : ""}`;
}
