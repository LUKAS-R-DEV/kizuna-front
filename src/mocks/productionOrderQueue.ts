export interface IProductionOrder {
  id: string;
  product: string;
  quantity: string;
  status: "In Production" | "Pending" | "Completed" | "Cancelled";
  priority: "High" | "Medium" | "Low";
  deadline: string;
  startTime: string; // Novo
  duration: string;  // Novo
  position: number;  // Novo
}

export const PRODUCTION_QUEUE_MOCK: IProductionOrder[] = [
  { 
    id: "PO-1045", product: "Industrial Gear Type A", quantity: "100 units", 
    status: "In Production", priority: "High", deadline: "2026-03-12",
    startTime: "2026-03-11 08:00", duration: "4 hours", position: 1 
  },
  { 
    id: "PO-1046", product: "Hydraulic Pump", quantity: "50 units", 
    status: "Pending", priority: "Medium", deadline: "2026-03-13",
    startTime: "2026-03-11 12:00", duration: "3 hours", position: 2 
  },
  { 
    id: "PO-1047", product: "Control Panel", quantity: "25 units", 
    status: "Pending", priority: "Low", deadline: "2026-03-15",
    startTime: "2026-03-11 15:00", duration: "2 hours", position: 3 
  }
];