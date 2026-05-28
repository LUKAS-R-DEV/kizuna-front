export type HealthComponentInfo = {
  label: string;
  status: string;
  detail?: string;
};

const LABELS: Record<string, string> = {
  db: "PostgreSQL",
  diskSpace: "Disco",
  ping: "Ping",
  rabbit: "RabbitMQ",
  mongo: "MongoDB",
  mongoHealth: "MongoDB",
  livenessState: "Liveness",
  readinessState: "Readiness",
  ssl: "SSL",
};

export function extractHealthComponents(data: unknown): Record<string, HealthComponentInfo> {
  const body = data as { status?: string; components?: Record<string, { status?: string; details?: Record<string, unknown> }> };
  const out: Record<string, HealthComponentInfo> = {};

  if (body?.components) {
    for (const [key, val] of Object.entries(body.components)) {
      if (key === "discoveryComposite") continue;
      const details = val?.details ?? {};
      const detail =
        (details.database as string) ||
        (details.version as string) ||
        (details.error as string) ||
        undefined;
      out[key] = {
        label: LABELS[key] ?? key,
        status: val?.status ?? "UNKNOWN",
        detail,
      };
    }
  } else if (body?.status) {
    out.service = { label: "Serviço", status: body.status };
  }

  return out;
}
