export interface QualityBatch {
  id: string;
  productName: string;
  poNumber: string;
  quantity: number;
  completedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'In Queue';
  inspector?: string;
  notes?: string;
}

export const MOCK_QUALITY_BATCHES: QualityBatch[] = [
  {
    id: "B-2024-045",
    productName: "Industrial Gear Type A",
    poNumber: "PO-1044",
    quantity: 75,
    completedDate: "2026-03-11",
    status: "Pending"
  },
  {
    id: "B-2024-046",
    productName: "Motor Assembly",
    poNumber: "PO-1043",
    quantity: 50,
    completedDate: "2026-03-10",
    status: "In Queue"
  }
];

export const MOCK_QUALITY_HISTORY: QualityBatch[] = [
  {
    id: "B-2024-044",
    productName: "Hydraulic Pump",
    poNumber: "PO-1042",
    quantity: 30,
    completedDate: "2026-03-09",
    status: "Approved",
    inspector: "Sarah Williams",
    notes: "All units passed quality standards."
  },
  {
    id: "B-2024-043",
    productName: "Control Panel",
    poNumber: "PO-1041",
    quantity: 15,
    completedDate: "2026-03-08",
    status: "Rejected",
    inspector: "Sarah Williams",
    notes: "Found defects in 3 units. Returned for rework."
  }
];