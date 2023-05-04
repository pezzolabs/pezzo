export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-") // replace whitespace with hyphens
    .replace(/[^\w-]+/g, "") // remove non-word characters
    .replace(/--+/g, "-") // replace multiple hyphens with a single hyphen
    .replace(/^-+/, "") // remove leading hyphens
    .replace(/-+$/, ""); // remove trailing hyphens
}