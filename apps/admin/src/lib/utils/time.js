export function toTimeInput(value) {
  return value ? value.slice(0, 5) : "";
}

export function formatTimeRange(start, end) {
  return `${start} - ${end}`;
}