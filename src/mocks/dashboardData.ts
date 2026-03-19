import { 
  CheckCircle2, Activity, TriangleAlert, ShieldCheck, 
  PackageSearch, Clock, ClipboardList
} from "lucide-react";

export const DASHBOARD_KPIS = [
  { label: "Completed Today", value: "24", icon: PackageSearch, color: "text-green-600", bg: "bg-green-100/50", trend: "12%", trendUp: true, trendColor: "text-green-500" },
  { label: "In Production", value: "8", icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-100/50", trend: "5%", trendUp: false, trendColor: "text-blue-500" },
  { label: "Low Stock Alerts", value: "3", icon: TriangleAlert, color: "text-yellow-600", bg: "bg-yellow-100/50" },
  { label: "Pending Inspection", value: "2", icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-100/50" },
];

export const PRODUCTION_QUEUE = [
  { id: "PO-1045", name: "Industrial Gear Type A", priority: "High", deadline: "2026-03-12" },
  { id: "PO-1046", name: "Hydraulic Pump", priority: "Medium", deadline: "2026-03-13" },
  { id: "PO-1047", name: "Control Panel", priority: "Low", deadline: "2026-03-15" },
];

export const INVENTORY_ALERTS = [
  { item: "Steel Plates", current: "45 kg", min: "100 kg" },
  { item: "Copper Wire", current: "12 m", min: "50 m" },
  { item: "Hydraulic Fluid", current: "8 L", min: "20 L" }
];

export const PENDING_INSPECTIONS = [
  { id: "B-2024-045", product: "Industrial Gear Type A", date: "2026-03-11", status: "Pending" },
  { id: "B-2024-046", product: "Motor Assembly", date: "2026-03-10", status: "Pending" },
];