export interface IActiveOrder {
  id: string;
  product: string;
  plannedQuantity: number;
  producedQuantity: number;
  priority: "High" | "Medium" | "Low";
  deadline: string;
  startedAt: string;
  status: "Idle" | "Running" | "Paused";
}

export const ACTIVE_ORDER_MOCK: IActiveOrder = {
  id: "PO-1045",
  product: "Industrial Gear Type A",
  plannedQuantity: 100,
  producedQuantity: 45,
  priority: "High",
  deadline: "2026-03-12",
  startedAt: "2026-03-09 08:00",
  status: "Idle"
};

export const NEXT_IN_LINE_MOCK = [
  { id: "PO-1046", product: "Hydraulic Pump", quantity: 50, priority: "Medium" },
  { id: "PO-1047", product: "Control Panel", quantity: 25, priority: "Low" },
  { id: "PO-1048", product: "Motor Assembly", quantity: 75, priority: "High" },
];