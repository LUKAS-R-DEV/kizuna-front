import React, { createContext, useContext, useState, useEffect } from "react";
import {
  computeSystemHealth,
  healthPresentation,
  probeAllServices,
  type HealthState,
  type ServiceHealthStatus,
} from "@/lib/systemHealth";

interface HealthContextValue {
  health: HealthState;
  colorClass: string;
  textStatus: string;
  colorHex: string;
  iamUp: boolean;
  aiUp: boolean;
  lastCheck: string;
  serviceStatuses: ServiceHealthStatus | null;
}

const defaultPresentation = healthPresentation("OFFLINE");

const HealthContext = createContext<HealthContextValue>({
  health: "OFFLINE",
  colorClass: defaultPresentation.colorClass,
  textStatus: defaultPresentation.textStatus,
  colorHex: defaultPresentation.colorHex,
  iamUp: false,
  aiUp: false,
  lastCheck: "--:--:--",
  serviceStatuses: null,
});

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [health, setHealth] = useState<HealthState>("OFFLINE");
  const [serviceStatuses, setServiceStatuses] = useState<ServiceHealthStatus | null>(null);
  const [lastCheck, setLastCheck] = useState<string>("--:--:--");

  useEffect(() => {
    const checkHealth = async () => {
      const timestamp = Date.now();
      setLastCheck(new Date().toLocaleTimeString());

      try {
        const statuses = await probeAllServices(timestamp);
        setServiceStatuses(statuses);
        setHealth(computeSystemHealth(statuses));
      } catch (e) {
        console.error("[HEALTH] Unexpected error in checkHealth:", e);
        setHealth("RED");
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const presentation = healthPresentation(health);

  return (
    <HealthContext.Provider
      value={{
        health,
        colorClass: presentation.colorClass,
        textStatus: presentation.textStatus,
        colorHex: presentation.colorHex,
        iamUp: serviceStatuses?.iam ?? false,
        aiUp: serviceStatuses?.ai ?? false,
        lastCheck,
        serviceStatuses,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);
