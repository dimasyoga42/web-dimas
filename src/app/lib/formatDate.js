export function formatDate(dateStr) {
  if (!dateStr) return "-";

  const normalized = dateStr.replace(/(\.\d{3})\d+/, "$1");
  const date = new Date(normalized);

  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
