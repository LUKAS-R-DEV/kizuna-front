/** Fuso operacional exibido na interface (backend permanece em UTC). */
export const APP_TIMEZONE = "America/Sao_Paulo";

/** Interpreta o LocalDateTime do backend (sem offset) como instante UTC. */
export function parseServerUtc(raw: string): number {
  const trimmed = raw.trim();
  const hasTimezone = /[zZ]$|[+-]\d{2}:\d{2}$/.test(trimmed);
  const iso = hasTimezone ? trimmed : `${trimmed}Z`;
  return new Date(iso).getTime();
}

export function formatAppTime(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  return date.toLocaleTimeString("pt-BR", {
    timeZone: APP_TIMEZONE,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    ...options,
  });
}

export function formatAppDateTime(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string
{
  return date.toLocaleString("pt-BR", {
    timeZone: APP_TIMEZONE,
    hour12: false,
    ...options,
  });
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Audit/API: LocalDateTime do backend (array ou string sem offset) = UTC, igual ao relógio do header. */
export function parseAuditTimestampMs(timestamp: unknown): number | null {
  if (timestamp == null) return null;

  if (Array.isArray(timestamp)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = timestamp as number[];
    if (year == null || month == null || day == null) return null;
    const iso = `${year}-${pad2(month)}-${pad2(day)}T${pad2(hour)}:${pad2(minute)}:${pad2(second)}`;
    return parseServerUtc(iso);
  }

  if (typeof timestamp === "string") {
    const trimmed = timestamp.trim();
    if (!trimmed) return null;
    return parseServerUtc(trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T"));
  }

  const d = new Date(timestamp as string | number);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

export function formatAuditLogTimestamp(timestamp: unknown): { date: string; time: string } {
  const ms = parseAuditTimestampMs(timestamp);
  if (ms == null) return { date: "—", time: "—" };
  const date = new Date(ms);
  return {
    time: formatAppTime(date),
    date: date.toLocaleDateString("pt-BR", {
      timeZone: APP_TIMEZONE,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  };
}

/** Converte data/hora do backend (ISO UTC, array LocalDateTime ou string) para Brasília. */
export function formatApiDateTime(
  value: unknown,
  options?: Intl.DateTimeFormatOptions
): string {
  const ms = parseAuditTimestampMs(value);
  if (ms == null) return "";
  return formatAppDateTime(new Date(ms), options);
}
