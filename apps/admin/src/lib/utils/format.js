export function formatLabel(text) {
  return text
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/(^|\s)\w/g, (l) => l.toUpperCase());
}