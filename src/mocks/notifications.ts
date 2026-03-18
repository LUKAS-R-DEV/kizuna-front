export interface Notification {
  id: string;
  title: string;
  category: 'Produção' | 'Estoque' | 'Qualidade';
  description: string;
  timestamp: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  isNew: boolean;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "EV-9021",
    title: "Production Order Completed",
    category: "Produção",
    description: "Order PO-1044 for Motor Assembly (75 units) has been completed successfully and is ready for quality inspection.",
    timestamp: "2026-03-11 14:25:00",
    type: "success",
    isNew: true
  },
  {
    id: "AL-4020",
    title: "Critical Stock Alert",
    category: "Estoque",
    description: "Steel Plates inventory is critically low (45 kg). Current stock is below minimum required level (100 kg). Immediate restocking recommended.",
    timestamp: "2026-03-11 14:10:00",
    type: "danger",
    isNew: true
  },
  {
    id: "QA-1019",
    title: "Quality Inspection Required",
    category: "Qualidade",
    description: "Batch B-2024-045 for Industrial Gear Type A is waiting for quality inspection. 75 units completed.",
    timestamp: "2026-03-11 13:45:00",
    type: "warning",
    isNew: true
  },
  {
    id: "EV-9018",
    title: "Production Started",
    category: "Produção",
    description: "Line 03 has started processing Order PO-1045.",
    timestamp: "2026-03-11 12:00:00",
    type: "info",
    isNew: false
  }
];