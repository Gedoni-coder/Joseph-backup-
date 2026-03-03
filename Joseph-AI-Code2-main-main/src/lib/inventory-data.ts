export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  unitCost: number;
  unitPrice: number;
  location: string;
  supplier: string;
  lastStockUpdate: Date;
  status: "in-stock" | "low-stock" | "out-of-stock" | "overstock";
  batchNumbers?: string[];
  serialNumbers?: string[];
  expiryDate?: Date;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: "purchase" | "sale" | "adjustment" | "transfer" | "return";
  quantity: number;
  unitCost: number;
  totalValue: number;
  location: string;
  reference: string;
  timestamp: Date;
  notes?: string;
}

export interface DemandForecast {
  id: string;
  itemId: string;
  itemName: string;
  forecastPeriod: "weekly" | "monthly" | "quarterly";
  currentDemand: number;
  predictedDemand: number;
  confidence: number;
  seasonalFactor: number;
  trendFactor: number;
  factors: ForecastFactor[];
  reorderSuggestion: {
    quantity: number;
    timing: Date;
    urgency: "low" | "medium" | "high";
  };
}

export interface ForecastFactor {
  name: string;
  impact: number;
  confidence: number;
}

export interface InventoryValuation {
  id: string;
  method: "FIFO" | "LIFO" | "WeightedAverage";
  totalValue: number;
  breakdown: ValuationBreakdown[];
  lastCalculated: Date;
  variance: number;
  costOfGoodsSold: number;
}

export interface ValuationBreakdown {
  category: string;
  quantity: number;
  averageCost: number;
  totalValue: number;
  percentage: number;
}

export interface DeadStock {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  quantity: number;
  daysStagnant: number;
  originalValue: number;
  currentValue: number;
  depreciation: number;
  lastMovement: Date;
  recommendedAction: "markdown" | "liquidate" | "donate" | "dispose";
  reason: string;
}

export interface Location {
  id: string;
  name: string;
  type: "warehouse" | "store" | "distribution-center" | "supplier";
  address: string;
  capacity: number;
  currentUtilization: number;
  manager: string;
  status: "active" | "inactive" | "maintenance";
}

export interface InventoryAudit {
  id: string;
  auditDate: Date;
  location: string;
  auditor: string;
  status: "planned" | "in-progress" | "completed" | "reviewed";
  totalItemsAudited: number;
  discrepancies: AuditDiscrepancy[];
  accuracy: number;
  adjustments: StockMovement[];
}

export interface AuditDiscrepancy {
  itemId: string;
  itemName: string;
  expectedQuantity: number;
  actualQuantity: number;
  variance: number;
  varianceValue: number;
  reason?: string;
}

export interface TurnoverMetrics {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  turnoverRatio: number;
  averageInventory: number;
  costOfGoodsSold: number;
  daysOfSupply: number;
  velocityRating: "fast" | "medium" | "slow";
  recommendation: string;
}

// Mock data
export const inventoryItems: InventoryItem[] = [
  {
    id: "1",
    sku: "TECH-001",
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    currentStock: 245,
    minimumStock: 50,
    maximumStock: 500,
    reorderPoint: 75,
    unitCost: 45.5,
    unitPrice: 89.99,
    location: "Warehouse A",
    supplier: "TechSupply Co",
    lastStockUpdate: new Date("2024-12-12T08:30:00"),
    status: "in-stock",
    batchNumbers: ["BT2024001", "BT2024002"],
    serialNumbers: ["BT001245", "BT001246", "BT001247"],
  },
  {
    id: "2",
    sku: "HOME-025",
    name: "Smart Coffee Maker",
    category: "Appliances",
    currentStock: 15,
    minimumStock: 20,
    maximumStock: 100,
    reorderPoint: 25,
    unitCost: 125.0,
    unitPrice: 249.99,
    location: "Warehouse B",
    supplier: "HomeGoods Inc",
    lastStockUpdate: new Date("2024-12-11T16:45:00"),
    status: "low-stock",
  },
  {
    id: "3",
    sku: "FASH-112",
    name: "Designer Running Shoes",
    category: "Footwear",
    currentStock: 0,
    minimumStock: 30,
    maximumStock: 200,
    reorderPoint: 40,
    unitCost: 65.0,
    unitPrice: 149.99,
    location: "Store Front",
    supplier: "Fashion Direct",
    lastStockUpdate: new Date("2024-12-10T12:00:00"),
    status: "out-of-stock",
  },
  {
    id: "4",
    sku: "OFFICE-089",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    currentStock: 185,
    minimumStock: 25,
    maximumStock: 150,
    reorderPoint: 35,
    unitCost: 180.0,
    unitPrice: 399.99,
    location: "Warehouse A",
    supplier: "Office Pro Ltd",
    lastStockUpdate: new Date("2024-12-12T09:15:00"),
    status: "overstock",
  },
];

export const stockMovements: StockMovement[] = [
  {
    id: "1",
    itemId: "1",
    type: "sale",
    quantity: -25,
    unitCost: 45.5,
    totalValue: -1137.5,
    location: "Warehouse A",
    reference: "ORD-2024-1205",
    timestamp: new Date("2024-12-12T10:30:00"),
    notes: "Bulk order to Electronics Plus",
  },
  {
    id: "2",
    itemId: "2",
    type: "purchase",
    quantity: 50,
    unitCost: 125.0,
    totalValue: 6250.0,
    location: "Warehouse B",
    reference: "PO-2024-0892",
    timestamp: new Date("2024-12-11T14:20:00"),
    notes: "Quarterly restock",
  },
  {
    id: "3",
    itemId: "3",
    type: "sale",
    quantity: -8,
    unitCost: 65.0,
    totalValue: -520.0,
    location: "Store Front",
    reference: "SALE-2024-3401",
    timestamp: new Date("2024-12-10T16:45:00"),
    notes: "Holiday promotion sales",
  },
];

export const demandForecasts: DemandForecast[] = [
  {
    id: "1",
    itemId: "1",
    itemName: "Wireless Bluetooth Headphones",
    forecastPeriod: "monthly",
    currentDemand: 180,
    predictedDemand: 220,
    confidence: 87,
    seasonalFactor: 1.15,
    trendFactor: 1.08,
    factors: [
      { name: "Holiday Season", impact: 25, confidence: 92 },
      { name: "Marketing Campaign", impact: 15, confidence: 78 },
      { name: "Competitor Launch", impact: -8, confidence: 65 },
    ],
    reorderSuggestion: {
      quantity: 150,
      timing: new Date("2024-12-20T00:00:00"),
      urgency: "medium",
    },
  },
  {
    id: "2",
    itemId: "2",
    itemName: "Smart Coffee Maker",
    forecastPeriod: "monthly",
    currentDemand: 45,
    predictedDemand: 65,
    confidence: 74,
    seasonalFactor: 1.35,
    trendFactor: 1.12,
    factors: [
      { name: "Winter Season", impact: 30, confidence: 88 },
      { name: "New Features", impact: 12, confidence: 70 },
    ],
    reorderSuggestion: {
      quantity: 80,
      timing: new Date("2024-12-15T00:00:00"),
      urgency: "high",
    },
  },
];

export const inventoryValuation: InventoryValuation = {
  id: "1",
  method: "FIFO",
  totalValue: 2847500,
  breakdown: [
    {
      category: "Electronics",
      quantity: 1245,
      averageCost: 85.5,
      totalValue: 106447.5,
      percentage: 37.4,
    },
    {
      category: "Appliances",
      quantity: 875,
      averageCost: 165.0,
      totalValue: 144375.0,
      percentage: 50.7,
    },
    {
      category: "Footwear",
      quantity: 450,
      averageCost: 58.75,
      totalValue: 26437.5,
      percentage: 9.3,
    },
    {
      category: "Furniture",
      quantity: 125,
      averageCost: 195.8,
      totalValue: 24475.0,
      percentage: 8.6,
    },
  ],
  lastCalculated: new Date("2024-12-12T06:00:00"),
  variance: -2.3,
  costOfGoodsSold: 1245800,
};

export const deadStock: DeadStock[] = [
  {
    id: "1",
    itemId: "5",
    itemName: "Vintage Desk Lamp",
    category: "Lighting",
    quantity: 45,
    daysStagnant: 180,
    originalValue: 3375.0,
    currentValue: 1687.5,
    depreciation: 50,
    lastMovement: new Date("2024-06-15T00:00:00"),
    recommendedAction: "markdown",
    reason: "Seasonal item with low demand",
  },
  {
    id: "2",
    itemId: "6",
    itemName: "Outdated Phone Cases",
    category: "Accessories",
    quantity: 120,
    daysStagnant: 240,
    originalValue: 1800.0,
    currentValue: 360.0,
    depreciation: 80,
    lastMovement: new Date("2024-04-25T00:00:00"),
    recommendedAction: "liquidate",
    reason: "Model discontinued, compatibility issues",
  },
];

export const locations: Location[] = [
  {
    id: "1",
    name: "Warehouse A",
    type: "warehouse",
    address: "1234 Industrial Blvd, City, State 12345",
    capacity: 10000,
    currentUtilization: 7850,
    manager: "John Smith",
    status: "active",
  },
  {
    id: "2",
    name: "Warehouse B",
    type: "warehouse",
    address: "5678 Commerce Dr, City, State 12345",
    capacity: 8000,
    currentUtilization: 6200,
    manager: "Sarah Johnson",
    status: "active",
  },
  {
    id: "3",
    name: "Store Front",
    type: "store",
    address: "9012 Main St, Downtown, State 12345",
    capacity: 2000,
    currentUtilization: 1650,
    manager: "Mike Chen",
    status: "active",
  },
];

export const inventoryAudits: InventoryAudit[] = [
  {
    id: "1",
    auditDate: new Date("2024-12-01T09:00:00"),
    location: "Warehouse A",
    auditor: "Internal Audit Team",
    status: "completed",
    totalItemsAudited: 1250,
    discrepancies: [
      {
        itemId: "1",
        itemName: "Wireless Bluetooth Headphones",
        expectedQuantity: 250,
        actualQuantity: 245,
        variance: -5,
        varianceValue: -227.5,
        reason: "Damaged units removed",
      },
      {
        itemId: "4",
        itemName: "Ergonomic Office Chair",
        expectedQuantity: 150,
        actualQuantity: 185,
        variance: 35,
        varianceValue: 6300.0,
        reason: "Late delivery receipt not recorded",
      },
    ],
    accuracy: 98.2,
    adjustments: [],
  },
];

export const turnoverMetrics: TurnoverMetrics[] = [
  {
    id: "1",
    itemId: "1",
    itemName: "Wireless Bluetooth Headphones",
    category: "Electronics",
    turnoverRatio: 8.5,
    averageInventory: 200,
    costOfGoodsSold: 77400,
    daysOfSupply: 43,
    velocityRating: "fast",
    recommendation: "Maintain current stock levels, strong performer",
  },
  {
    id: "2",
    itemId: "2",
    itemName: "Smart Coffee Maker",
    category: "Appliances",
    turnoverRatio: 4.2,
    averageInventory: 85,
    costOfGoodsSold: 37800,
    daysOfSupply: 87,
    velocityRating: "medium",
    recommendation: "Monitor demand patterns, consider promotional activity",
  },
  {
    id: "3",
    itemId: "4",
    itemName: "Ergonomic Office Chair",
    category: "Furniture",
    turnoverRatio: 1.8,
    averageInventory: 150,
    costOfGoodsSold: 32400,
    daysOfSupply: 203,
    velocityRating: "slow",
    recommendation: "Review pricing strategy and reduce inventory levels",
  },
];
