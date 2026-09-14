export const DEFAULT_EUR_SIZES = [
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
];

export function getProductSizeOptions(sizes?: string[]) {
  const normalized = (sizes || []).map((size) => String(size).trim()).filter(Boolean);
  return normalized.length ? [...new Set(normalized)] : DEFAULT_EUR_SIZES;
}
