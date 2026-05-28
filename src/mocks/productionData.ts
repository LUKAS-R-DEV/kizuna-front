// src/mocks/productionData.ts

export interface IProductionOrder {
  id: string;
  product: string;
  quantity: string;
  status: "In Production" | "Pending" | "Completed" | "Cancelled";
  priority: "High" | "Medium" | "Low";
  deadline: string;
  operator: string;
}

export const PRODUCTION_ORDERS_MOCK: IProductionOrder[] = [
  { 
    id: "PO-1045", 
    product: "Industrial Gear Type A", 
    quantity: "100 units", 
    status: "In Production", 
    priority: "High", 
    deadline: "2026-03-12",
    operator: "Lucas Rafael"
  },
  { 
    id: "PO-1046", 
    product: "Hydraulic Pump X1", 
    quantity: "50 units", 
    status: "Pending", 
    priority: "Medium", 
    deadline: "2026-03-13",
    operator: "Maria Silva"
  },
  { 
    id: "PO-1047", 
    product: "Control Panel v2", 
    quantity: "25 units", 
    status: "Pending", 
    priority: "Low", 
    deadline: "2026-03-15",
    operator: "João Santos"
  },
  { 
    id: "PO-1044", 
    product: "Motor Assembly", 
    quantity: "75 units", 
    status: "Completed", 
    priority: "High", 
    deadline: "2026-03-10",
    operator: "Lucas Rafael"
  },
  { 
    id: "PO-1043", 
    product: "Valve System", 
    quantity: "30 units", 
    status: "Cancelled", 
    priority: "Low", 
    deadline: "2026-03-11",
    operator: "Sarah Williams"
  }
];