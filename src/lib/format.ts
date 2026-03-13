export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function cleanText(value: unknown) {
  if (typeof value === "number") {
    return String(value)
  }

  if (typeof value !== "string") {
    return value == null ? "" : String(value)
  }

  return value.replace(/\s+/g, " ").trim()
}

export function normalizeLabel(value: string) {
  return cleanText(value)
    .replace(/\b[a-z]/g, (match) => match.toUpperCase())
    .replace(/\bHb\b/g, "Hb")
}

export function displayValue(value: string | string[] | null | undefined, fallback = "Not available") {
  if (Array.isArray(value)) {
    const filtered = value.map((item) => cleanText(item)).filter(Boolean)
    return filtered.length ? filtered.join(", ") : fallback
  }

  const cleaned = cleanText(value)
  return cleaned || fallback
}

export function parseNumber(value: string) {
  const numeric = Number.parseFloat(cleanText(value).replace("%", ""))
  return Number.isFinite(numeric) ? numeric : null
}

export function markdownToPlainText(markdown: string) {
  return markdown
    .replace(/^#+\s+/gm, "")
    .replace(/[*_`>#-]/g, " ")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
}

export function buildExcerpt(markdown: string, length = 220) {
  const plain = markdownToPlainText(markdown)
  if (plain.length <= length) {
    return plain
  }

  return `${plain.slice(0, length).trimEnd()}...`
}
