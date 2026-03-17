import { 
  CheckCircle2, Activity, TriangleAlert, ShieldCheck, 
  PackageSearch, Clock 
} from "lucide-react";

export const DASHBOARD_KPIS = [
  { label: "Done Today", value: "24", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "In Progress", value: "08", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Low Stock", value: "03", icon: TriangleAlert, color: "text-red-600", bg: "bg-red-50" },
  { label: "Inspections", value: "02", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
];

export const PRODUCTION_QUEUE = [
  { id: "PO-1045", name: "Industrial Gear Type A", priority: "High", deadline: "12:00", variant: "destructive" as const },
  { id: "PO-1046", name: "Hydraulic Pump X1", priority: "Medium", deadline: "14:30", variant: "secondary" as const },
  { id: "PO-1047", name: "Control Panel V4", priority: "Low", deadline: "17:00", variant: "outline" as const },
  { id: "PO-1048", name: "Servo Motor Assembly", priority: "High", deadline: "18:30", variant: "destructive" as const },
];

export const INVENTORY_ALERTS = [
  { item: "Steel Plates", current: "45kg", min: "100kg" },
  { item: "Copper Wire", current: "12m", min: "50m" },
];