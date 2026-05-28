export function formatRemainingMinutes(minutes?: number | string | null): string {
  if (minutes == null || minutes === "") return "TBD";
  const value = typeof minutes === "string" ? Number(minutes) : minutes;
  if (Number.isNaN(value)) return "TBD";
  if (value <= 0) return "0 min";

  const hours = Math.floor(value / 60);
  const mins = Math.floor(value % 60);
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins} min`;
}
