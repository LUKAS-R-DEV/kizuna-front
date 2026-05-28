import { auditApi, aiApi, coreApi, dataApi, iamApi, notificationApi } from "@/lib/api";

export type HealthState = "GREEN" | "YELLOW" | "RED" | "OFFLINE";

export type ServiceId = "core" | "iam" | "data" | "audit" | "notification" | "ai";

export interface ServiceHealthDefinition {
  id: ServiceId;
  name: string;
  essential: boolean;
  probe: (timestamp: number) => ReturnType<typeof coreApi.get>;
}

/** Serviços essenciais: sem eles o fluxo principal (login, OP, estoque) não funciona. */
export const HEALTH_SERVICES: ServiceHealthDefinition[] = [
  {
    id: "core",
    name: "CORE",
    essential: true,
    probe: (t) => coreApi.get(`/actuator/health?t=${t}`, { timeout: 3000 }),
  },
  {
    id: "iam",
    name: "IAM",
    essential: true,
    probe: (t) => iamApi.get(`/actuator/health?t=${t}`, { timeout: 3000 }),
  },
  {
    id: "data",
    name: "DATA",
    essential: true,
    probe: (t) => dataApi.get(`/actuator/health?t=${t}`, { timeout: 3000 }),
  },
  {
    id: "audit",
    name: "AUDIT",
    essential: false,
    probe: (t) => auditApi.get(`/actuator/health?t=${t}`, { timeout: 3000 }),
  },
  {
    id: "notification",
    name: "NOTIF",
    essential: false,
    probe: (t) => notificationApi.get(`/actuator/health?t=${t}`, { timeout: 3000 }),
  },
  {
    id: "ai",
    name: "AI",
    essential: false,
    probe: (t) => aiApi.get(`/actuator/health?t=${t}`, { timeout: 3000 }),
  },
];

export type ServiceHealthStatus = Record<ServiceId, boolean>;

function isProbeUp(result: PromiseSettledResult<{ status: number; data?: { status?: string } }>): boolean {
  if (result.status !== "fulfilled") {
    return false;
  }
  const res = result.value;
  return res.status === 200 && res.data?.status === "UP";
}

export function computeSystemHealth(statuses: ServiceHealthStatus): HealthState {
  const values = HEALTH_SERVICES.map((s) => statuses[s.id]);
  const allDown = values.every((up) => !up);
  if (allDown) {
    return "OFFLINE";
  }

  const essentialDown = HEALTH_SERVICES.some((s) => s.essential && !statuses[s.id]);
  if (essentialDown) {
    return "RED";
  }

  const optionalDown = HEALTH_SERVICES.some((s) => !s.essential && !statuses[s.id]);
  if (optionalDown) {
    return "YELLOW";
  }

  return "GREEN";
}

export async function probeAllServices(timestamp = Date.now()): Promise<ServiceHealthStatus> {
  const results = await Promise.allSettled(HEALTH_SERVICES.map((s) => s.probe(timestamp)));

  return HEALTH_SERVICES.reduce((acc, service, index) => {
    acc[service.id] = isProbeUp(results[index]);
    return acc;
  }, {} as ServiceHealthStatus);
}

export function healthPresentation(state: HealthState) {
  switch (state) {
    case "GREEN":
      return {
        colorClass: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
        colorHex: "text-emerald-500",
        textStatus: "Sistema nominal",
      };
    case "YELLOW":
      return {
        colorClass: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]",
        colorHex: "text-amber-500",
        textStatus: "Degradação parcial",
      };
    case "RED":
      return {
        colorClass: "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.4)] animate-pulse",
        colorHex: "text-red-500",
        textStatus: "Falha crítica",
      };
    case "OFFLINE":
      return {
        colorClass: "bg-slate-700 shadow-none grayscale animate-pulse",
        colorHex: "text-slate-500",
        textStatus: "Sem conexão",
      };
    default:
      return {
        colorClass: "bg-slate-500",
        colorHex: "text-slate-500",
        textStatus: "Verificando...",
      };
  }
}
