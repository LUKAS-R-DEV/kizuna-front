export const RECIPES_MOCK = [
  {
    id: 1,
    name: "Industrial Gear Assembly",
    productName: "High-Strength Gear A1",
    description: "Standard industrial gear used in heavy machinery. Requires precision forging and heat treatment.",
    estimatedProductTime: 45, // minutes
    items: [
      { inventoryName: "Steel Alloy Grade-S", inventoryId: 101, quantity: 5.5 },
      { inventoryName: "Lubricant Type-X", inventoryId: 205, quantity: 0.5 },
      { inventoryName: "Hardening Agent", inventoryId: 312, quantity: 0.2 }
    ]
  },
  {
    id: 2,
    name: "Hydraulic Pump Unit",
    productName: "MegaPump 5000",
    description: "High-pressure hydraulic pump for mining equipment. Compact design with maximum efficiency.",
    estimatedProductTime: 120, // minutes
    items: [
      { inventoryName: "Iron Casting", inventoryId: 440, quantity: 1.0 },
      { inventoryName: "Seal Kit Prototype", inventoryId: 550, quantity: 2.0 },
      { inventoryName: "Pressure Valve v2", inventoryId: 660, quantity: 4.0 }
    ]
  },
  {
    id: 3,
    name: "Control Panel Matrix",
    productName: "Matrix Board X2",
    description: "Advanced control panel for automated production lines. Integrated with KIZUNA OS.",
    estimatedProductTime: 90, // minutes
    items: [
      { inventoryName: "PCB Mainboard", inventoryId: 770, quantity: 1.0 },
      { inventoryName: "Capacitor Set", inventoryId: 880, quantity: 24.0 },
      { inventoryName: "Microchip K-Shield", inventoryId: 990, quantity: 2.0 }
    ]
  }
];
