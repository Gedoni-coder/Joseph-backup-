export interface Supplier {
  id: string;
  name: string;
  category: "raw-materials" | "components" | "finished-goods" | "services";
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    website?: string;
  };
  performanceMetrics: {
    onTimeDelivery: number;
    qualityRating: number;
    costCompetitiveness: number;
    responseTime: number;
    overallScore: number;
  };
  contracts: SupplierContract[];
  riskAssessment: {
    financialStability: "low" | "medium" | "high";
    geopoliticalRisk: "low" | "medium" | "high";
    supplierDependency: "low" | "medium" | "high";
    overallRisk: "low" | "medium" | "high";
  };
  certifications: string[];
  sustainabilityScore: number;
}

export interface SupplierContract {
  id: string;
  startDate: Date;
  endDate: Date;
  value: number;
  terms: string;
  status: "active" | "expired" | "pending" | "terminated";
}

export interface ProcurementOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  orderDate: Date;
  expectedDelivery: Date;
  actualDelivery?: Date;
  status: "pending" | "confirmed" | "in-transit" | "delivered" | "cancelled";
  items: ProcurementItem[];
  totalValue: number;
  terms: "2/10 net 30" | "net 30" | "net 60" | "cash";
  notes?: string;
}

export interface ProcurementItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications?: string;
}

export interface ProductionPlan {
  id: string;
  productName: string;
  plannedQuantity: number;
  actualQuantity: number;
  startDate: Date;
  endDate: Date;
  status: "planned" | "in-progress" | "completed" | "delayed" | "cancelled";
  requiredMaterials: MaterialRequirement[];
  bottlenecks: Bottleneck[];
  efficiency: number;
  costVariance: number;
  productionLine: string;
  priority: "low" | "medium" | "high";
}

export interface MaterialRequirement {
  materialId: string;
  materialName: string;
  requiredQuantity: number;
  availableQuantity: number;
  shortfall: number;
  criticality: "low" | "medium" | "high";
}

export interface Bottleneck {
  id: string;
  type: "equipment" | "labor" | "materials" | "quality";
  description: string;
  impact: "low" | "medium" | "high";
  estimatedDelay: number; // hours
  mitigationActions: string[];
}

export interface WarehouseOperation {
  id: string;
  warehouseId: string;
  warehouseName: string;
  layout: {
    totalArea: number;
    storageArea: number;
    pickingArea: number;
    shippingArea: number;
    receivingArea: number;
  };
  efficiency: {
    storageUtilization: number;
    pickingAccuracy: number;
    orderFulfillmentTime: number;
    receivingProcessingTime: number;
  };
  equipment: WarehouseEquipment[];
  staffing: {
    totalStaff: number;
    shiftCoverage: number;
    productivityIndex: number;
  };
}

export interface WarehouseEquipment {
  id: string;
  type: "forklift" | "conveyor" | "scanner" | "robot" | "rack";
  status: "operational" | "maintenance" | "broken" | "idle";
  utilization: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
}

export interface LogisticsMetrics {
  id: string;
  carrierId: string;
  carrierName: string;
  deliveryPerformance: {
    onTimeRate: number;
    averageTransitTime: number;
    damageRate: number;
    costPerMile: number;
  };
  routes: DeliveryRoute[];
  fleetUtilization: number;
  fuelEfficiency: number;
  carbonFootprint: number;
}

export interface DeliveryRoute {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: number;
  actualTime: number;
  cost: number;
  optimization: number;
}

export interface MarketVolatility {
  id: string;
  commodity: string;
  currentPrice: number;
  priceChange: number;
  volatilityIndex: number;
  trend: "increasing" | "decreasing" | "stable";
  factors: VolatilityFactor[];
  impact: "low" | "medium" | "high";
  recommendation: string;
}

export interface VolatilityFactor {
  name: string;
  impact: number;
  likelihood: number;
}

export interface RegulatoryCompliance {
  id: string;
  regulation: string;
  category: "environmental" | "safety" | "trade" | "quality" | "labor";
  status: "compliant" | "at-risk" | "non-compliant" | "under-review";
  lastAudit: Date;
  nextAudit: Date;
  requirements: string[];
  gaps: ComplianceGap[];
  certificationRequired: boolean;
}

export interface ComplianceGap {
  requirement: string;
  currentStatus: string;
  requiredAction: string;
  deadline: Date;
  priority: "low" | "medium" | "high";
}

export interface DisruptionRisk {
  id: string;
  type:
    | "natural-disaster"
    | "geopolitical"
    | "pandemic"
    | "cyber"
    | "supplier-failure";
  description: string;
  probability: number;
  impact: number;
  riskScore: number;
  affectedSuppliers: string[];
  affectedRegions: string[];
  mitigationStrategies: MitigationStrategy[];
  contingencyPlans: string[];
}

export interface MitigationStrategy {
  id: string;
  description: string;
  effectiveness: number;
  cost: number;
  timeToImplement: number;
  status: "planned" | "implementing" | "active" | "completed";
}

export interface SustainabilityMetrics {
  id: string;
  supplierId: string;
  supplierName: string;
  carbonFootprint: number;
  energyEfficiency: number;
  wasteReduction: number;
  sustainabilityScore: number;
  certifications: string[];
  greenInitiatives: GreenInitiative[];
  complianceLevel: "bronze" | "silver" | "gold" | "platinum";
}

export interface GreenInitiative {
  name: string;
  description: string;
  impact: number;
  cost: number;
  roi: number;
  status: "planned" | "active" | "completed";
}

// Mock data
export const suppliers: Supplier[] = [
  {
    id: "1",
    name: "TechSupply Co",
    category: "components",
    contactInfo: {
      email: "procurement@techsupply.com",
      phone: "+1-555-0123",
      address: "123 Tech Park, Silicon Valley, CA 94000",
      website: "https://techsupply.com",
    },
    performanceMetrics: {
      onTimeDelivery: 94.5,
      qualityRating: 97.2,
      costCompetitiveness: 85.0,
      responseTime: 92.8,
      overallScore: 92.4,
    },
    contracts: [
      {
        id: "C001",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        value: 2500000,
        terms: "Annual component supply agreement",
        status: "active",
      },
    ],
    riskAssessment: {
      financialStability: "high",
      geopoliticalRisk: "low",
      supplierDependency: "medium",
      overallRisk: "low",
    },
    certifications: ["ISO 9001", "ISO 14001", "RoHS"],
    sustainabilityScore: 88,
  },
  {
    id: "2",
    name: "Global Materials Ltd",
    category: "raw-materials",
    contactInfo: {
      email: "orders@globalmaterials.com",
      phone: "+1-555-0456",
      address: "456 Industrial Way, Detroit, MI 48000",
    },
    performanceMetrics: {
      onTimeDelivery: 87.3,
      qualityRating: 91.5,
      costCompetitiveness: 92.1,
      responseTime: 89.2,
      overallScore: 90.0,
    },
    contracts: [
      {
        id: "C002",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2025-05-31"),
        value: 1800000,
        terms: "Raw materials supply contract",
        status: "active",
      },
    ],
    riskAssessment: {
      financialStability: "medium",
      geopoliticalRisk: "medium",
      supplierDependency: "high",
      overallRisk: "medium",
    },
    certifications: ["ISO 9001", "OHSAS 18001"],
    sustainabilityScore: 72,
  },
];

export const procurementOrders: ProcurementOrder[] = [
  {
    id: "PO-2024-001",
    supplierId: "1",
    supplierName: "TechSupply Co",
    orderDate: new Date("2024-12-08"),
    expectedDelivery: new Date("2024-12-15"),
    status: "in-transit",
    items: [
      {
        id: "1",
        name: "Bluetooth Modules",
        quantity: 500,
        unitPrice: 12.5,
        totalPrice: 6250.0,
        specifications: "BLE 5.0 compatible",
      },
      {
        id: "2",
        name: "Circuit Boards",
        quantity: 200,
        unitPrice: 25.0,
        totalPrice: 5000.0,
        specifications: "PCB with gold plating",
      },
    ],
    totalValue: 11250.0,
    terms: "2/10 net 30",
    notes: "Urgent order for holiday production",
  },
];

export const productionPlans: ProductionPlan[] = [
  {
    id: "PROD-2024-12",
    productName: "Wireless Bluetooth Headphones",
    plannedQuantity: 1000,
    actualQuantity: 850,
    startDate: new Date("2024-12-01"),
    endDate: new Date("2024-12-20"),
    status: "in-progress",
    requiredMaterials: [
      {
        materialId: "MAT-001",
        materialName: "Bluetooth Modules",
        requiredQuantity: 1000,
        availableQuantity: 850,
        shortfall: 150,
        criticality: "high",
      },
      {
        materialId: "MAT-002",
        materialName: "Plastic Housings",
        requiredQuantity: 1000,
        availableQuantity: 1200,
        shortfall: 0,
        criticality: "low",
      },
    ],
    bottlenecks: [
      {
        id: "BN-001",
        type: "materials",
        description: "Bluetooth module shortage affecting assembly line",
        impact: "high",
        estimatedDelay: 48,
        mitigationActions: [
          "Expedite delivery from supplier",
          "Source alternative modules",
        ],
      },
    ],
    efficiency: 85.0,
    costVariance: 8.5,
    productionLine: "Line A",
    priority: "high",
  },
];

export const warehouseOperations: WarehouseOperation[] = [
  {
    id: "WH-001",
    warehouseId: "1",
    warehouseName: "Warehouse A",
    layout: {
      totalArea: 50000,
      storageArea: 35000,
      pickingArea: 8000,
      shippingArea: 4000,
      receivingArea: 3000,
    },
    efficiency: {
      storageUtilization: 78.5,
      pickingAccuracy: 99.2,
      orderFulfillmentTime: 24,
      receivingProcessingTime: 4,
    },
    equipment: [
      {
        id: "EQ-001",
        type: "forklift",
        status: "operational",
        utilization: 85,
        lastMaintenance: new Date("2024-11-15"),
        nextMaintenance: new Date("2025-02-15"),
      },
      {
        id: "EQ-002",
        type: "conveyor",
        status: "maintenance",
        utilization: 0,
        lastMaintenance: new Date("2024-12-10"),
        nextMaintenance: new Date("2025-03-10"),
      },
    ],
    staffing: {
      totalStaff: 45,
      shiftCoverage: 95,
      productivityIndex: 92,
    },
  },
];

export const logisticsMetrics: LogisticsMetrics[] = [
  {
    id: "LOG-001",
    carrierId: "CAR-001",
    carrierName: "FastShip Express",
    deliveryPerformance: {
      onTimeRate: 94.2,
      averageTransitTime: 2.3,
      damageRate: 0.5,
      costPerMile: 1.85,
    },
    routes: [
      {
        id: "R001",
        origin: "Warehouse A",
        destination: "Distribution Center East",
        distance: 450,
        estimatedTime: 6,
        actualTime: 5.5,
        cost: 832.5,
        optimization: 92,
      },
    ],
    fleetUtilization: 87,
    fuelEfficiency: 7.2,
    carbonFootprint: 2.3,
  },
];

export const marketVolatility: MarketVolatility[] = [
  {
    id: "MV-001",
    commodity: "Lithium",
    currentPrice: 24500,
    priceChange: 12.5,
    volatilityIndex: 75,
    trend: "increasing",
    factors: [
      { name: "EV demand surge", impact: 25, likelihood: 90 },
      { name: "Supply chain constraints", impact: 15, likelihood: 75 },
      { name: "Geopolitical tensions", impact: 8, likelihood: 60 },
    ],
    impact: "high",
    recommendation: "Consider forward contracts to lock in prices",
  },
  {
    id: "MV-002",
    commodity: "Steel",
    currentPrice: 850,
    priceChange: -3.2,
    volatilityIndex: 45,
    trend: "decreasing",
    factors: [
      { name: "Reduced construction demand", impact: -10, likelihood: 80 },
      { name: "Increased production capacity", impact: -8, likelihood: 70 },
    ],
    impact: "medium",
    recommendation: "Delay large steel purchases for better prices",
  },
];

export const regulatoryCompliance: RegulatoryCompliance[] = [
  {
    id: "REG-001",
    regulation: "REACH Compliance (EU)",
    category: "environmental",
    status: "compliant",
    lastAudit: new Date("2024-09-15"),
    nextAudit: new Date("2025-09-15"),
    requirements: [
      "Chemical substance registration",
      "Safety data sheets",
      "Downstream user communication",
    ],
    gaps: [],
    certificationRequired: true,
  },
  {
    id: "REG-002",
    regulation: "FDA 21 CFR Part 820",
    category: "quality",
    status: "at-risk",
    lastAudit: new Date("2024-08-20"),
    nextAudit: new Date("2025-02-20"),
    requirements: [
      "Quality management system",
      "Design controls",
      "Document controls",
      "Corrective and preventive actions",
    ],
    gaps: [
      {
        requirement: "Design control documentation",
        currentStatus: "Incomplete",
        requiredAction: "Update design history files",
        deadline: new Date("2025-01-15"),
        priority: "high",
      },
    ],
    certificationRequired: true,
  },
];

export const disruptionRisks: DisruptionRisk[] = [
  {
    id: "RISK-001",
    type: "geopolitical",
    description: "Trade restrictions affecting Asian suppliers",
    probability: 35,
    impact: 80,
    riskScore: 28,
    affectedSuppliers: ["TechSupply Co", "Electronics Direct"],
    affectedRegions: ["Asia-Pacific", "Southeast Asia"],
    mitigationStrategies: [
      {
        id: "MIT-001",
        description: "Diversify supplier base to include European alternatives",
        effectiveness: 75,
        cost: 150000,
        timeToImplement: 6,
        status: "implementing",
      },
    ],
    contingencyPlans: [
      "Maintain 90-day inventory buffer",
      "Establish secondary supplier relationships",
      "Develop local sourcing capabilities",
    ],
  },
  {
    id: "RISK-002",
    type: "natural-disaster",
    description: "Hurricane affecting Gulf Coast shipping",
    probability: 25,
    impact: 60,
    riskScore: 15,
    affectedSuppliers: ["Gulf Materials Inc"],
    affectedRegions: ["Gulf Coast", "Southeast US"],
    mitigationStrategies: [
      {
        id: "MIT-002",
        description: "Alternative transportation routes via Pacific ports",
        effectiveness: 60,
        cost: 75000,
        timeToImplement: 2,
        status: "planned",
      },
    ],
    contingencyPlans: [
      "Pre-position inventory in inland warehouses",
      "Establish alternative shipping routes",
    ],
  },
];

export const sustainabilityMetrics: SustainabilityMetrics[] = [
  {
    id: "SUST-001",
    supplierId: "1",
    supplierName: "TechSupply Co",
    carbonFootprint: 2.3,
    energyEfficiency: 85,
    wasteReduction: 92,
    sustainabilityScore: 88,
    certifications: ["Carbon Neutral", "Green Building", "Renewable Energy"],
    greenInitiatives: [
      {
        name: "Solar Power Installation",
        description: "100% renewable energy for manufacturing",
        impact: 40,
        cost: 500000,
        roi: 8.5,
        status: "active",
      },
      {
        name: "Waste-to-Energy Program",
        description: "Convert manufacturing waste to energy",
        impact: 25,
        cost: 200000,
        roi: 12.0,
        status: "completed",
      },
    ],
    complianceLevel: "gold",
  },
];
