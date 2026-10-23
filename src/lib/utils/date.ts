const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
] as const;

export function formatMonth(value: string | null | undefined) {
  if (!value) return "Sekarang";

  const [year, month] = value.split("-");
  if (!month) return year;

  const monthLabel = MONTHS[Number(month) - 1] ?? month;
  return `${monthLabel} ${year}`;
}

export function formatRange(start: string, end: string | null | undefined) {
  return `${formatMonth(start)} — ${formatMonth(end)}`;
}
