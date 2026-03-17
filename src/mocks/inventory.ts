export interface IInventoryItem {
  id: string;
  name: string;
  supplier: string;
  category: "Raw Material" | "Consumable" | "Component";
  quantity: string;
  minStock: string;
  status: "Critical" | "Good";
  location: string;
}

export const INVENTORY_MOCK: IInventoryItem[] = [
  { id: "MAT-001", name: "Steel Plates", supplier: "Steel Co.", category: "Raw Material", quantity: "45 kg", minStock: "100 kg", status: "Critical", location: "Warehouse A - Shelf 12" },
  { id: "MAT-002", name: "Copper Wire", supplier: "Metal Supplies Inc.", category: "Raw Material", quantity: "12 m", minStock: "50 m", status: "Critical", location: "Warehouse A - Shelf 8" },
  { id: "MAT-003", name: "Hydraulic Fluid", supplier: "Fluid Systems Ltd.", category: "Consumable", quantity: "8 L", minStock: "20 L", status: "Critical", location: "Warehouse B - Tank 3" },
  { id: "MAT-004", name: "Bearing Units", supplier: "Bearing Corp.", category: "Component", quantity: "150 pcs", minStock: "50 pcs", status: "Good", location: "Warehouse A - Shelf 15" },
];