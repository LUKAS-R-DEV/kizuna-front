export interface IStockMovement {
  id: string;
  materialId: string;
  materialName: string;
  type: "IN" | "OUT";
  quantity: string;
  user: string;
  timestamp: string;
  reason: string;
}

export const MOVEMENTS_MOCK: IStockMovement[] = [
  { id: "MOV-9920", materialId: "MAT-001", materialName: "Steel Plates", type: "IN", quantity: "+50 kg", user: "Lucas Rafael", timestamp: "2026-03-13 14:20", reason: "Supplier Delivery" },
  { id: "MOV-9921", materialId: "MAT-004", materialName: "Bearing Units", type: "OUT", quantity: "-12 pcs", user: "Mike Johnson", timestamp: "2026-03-13 11:05", reason: "Production Order PO-1045" },
  { id: "MOV-9922", materialId: "MAT-003", materialName: "Hydraulic Fluid", type: "OUT", quantity: "-2 L", user: "Mike Johnson", timestamp: "2026-03-12 16:45", reason: "Maintenance" },
  { id: "MOV-9923", materialId: "MAT-006", materialName: "Electronic Components", type: "IN", quantity: "+100 pcs", user: "Jane Smith", timestamp: "2026-03-12 09:30", reason: "Restock" },
];