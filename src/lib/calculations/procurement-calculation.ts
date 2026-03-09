/**
 * Procurement Calculation Utilities
 * Contains all business logic for procurement calculations
 */

import { ProcurementOrder } from "@/lib/supply-chain-data";

export type OrderStatus = "pending" | "confirmed" | "in-transit" | "delivered" | "cancelled";

export interface ProcurementMetrics {
  orderId: string;
  supplierName: string;
  orderDate: Date;
  expectedDelivery: Date;
  actualDelivery?: Date;
  status: OrderStatus;
  totalValue: number;
  daysToDeliver: number;
  isLate: boolean;
  fulfillmentRate: number;
}

export interface ProcurementSummary {
  totalOrders: number;
  totalValue: number;
  pendingOrders: number;
  inTransitOrders: number;
  deliveredOrders: number;
  lateOrders: number;
  averageLeadTime: number;
  onTimeRate: number;
  statusBreakdown: Record<OrderStatus, number>;
  supplierBreakdown: { supplier: string; orderCount: number; totalValue: number }[];
}

/**
 * Calculate days to deliver
 * @param orderDate - Order date
 * @param deliveryDate - Delivery date
 * @returns Days to deliver
 */
export function calculateDaysToDeliver(orderDate: Date, deliveryDate: Date): number {
  const diffTime = Math.abs(deliveryDate.getTime() - orderDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determine if order is late
 * @param expectedDelivery - Expected delivery date
 * @param actualDelivery - Actual delivery date (if delivered)
 * @returns True if late
 */
export function isOrderLate(expectedDelivery: Date, actualDelivery?: Date): boolean {
  if (!actualDelivery) {
    // If not delivered yet, check if past expected date
    return new Date() > expectedDelivery;
  }
  return actualDelivery > expectedDelivery;
}

/**
 * Calculate fulfillment rate for an order
 * @param expectedQuantity - Expected total quantity
 * @param deliveredQuantity - Actually delivered quantity
 * @returns Fulfillment rate (0-100)
 */
export function calculateFulfillmentRate(expectedQuantity: number, deliveredQuantity: number): number {
  if (expectedQuantity <= 0) return 0;
  return Math.round((deliveredQuantity / expectedQuantity) * 100 * 10) / 10;
}

/**
 * Calculate lead time in days
 * @param orderDate - Order date
 * @param deliveryDate - Delivery date
 * @returns Lead time in days
 */
export function calculateLeadTime(orderDate: Date, deliveryDate: Date): number {
  return calculateDaysToDeliver(orderDate, deliveryDate);
}

/**
 * Get order status from procurement order
 * @param order - Procurement order
 * @returns Order status
 */
export function getOrderStatus(order: ProcurementOrder): OrderStatus {
  return order.status;
}

/**
 * Calculate metrics for a single order
 * @param order - Procurement order
 * @returns Procurement metrics
 */
export function calculateOrderMetrics(order: ProcurementOrder): ProcurementMetrics {
  const daysToDeliver = calculateDaysToDeliver(order.orderDate, order.expectedDelivery);
  const isLate = isOrderLate(order.expectedDelivery, order.actualDelivery);
  
  // Calculate expected vs delivered quantity
  const expectedQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const deliveredQty = order.status === "delivered" ? expectedQty : 0; // Simplified
  const fulfillmentRate = calculateFulfillmentRate(expectedQty, deliveredQty);
  
  return {
    orderId: order.id,
    supplierName: order.supplierName,
    orderDate: order.orderDate,
    expectedDelivery: order.expectedDelivery,
    actualDelivery: order.actualDelivery,
    status: order.status,
    totalValue: order.totalValue,
    daysToDeliver,
    isLate,
    fulfillmentRate
  };
}

/**
 * Calculate metrics for all orders
 * @param orders - Array of procurement orders
 * @returns Array of metrics
 */
export function calculateAllOrderMetrics(orders: ProcurementOrder[]): ProcurementMetrics[] {
  return orders.map(calculateOrderMetrics);
}

/**
 * Calculate procurement summary
 * @param orders - Array of procurement orders
 * @returns Summary metrics
 */
export function calculateProcurementSummary(orders: ProcurementOrder[]): ProcurementSummary {
  if (orders.length === 0) {
    return {
      totalOrders: 0,
      totalValue: 0,
      pendingOrders: 0,
      inTransitOrders: 0,
      deliveredOrders: 0,
      lateOrders: 0,
      averageLeadTime: 0,
      onTimeRate: 0,
      statusBreakdown: {
        pending: 0,
        confirmed: 0,
        "in-transit": 0,
        delivered: 0,
        cancelled: 0
      },
      supplierBreakdown: []
    };
  }
  
  const totalValue = orders.reduce((sum, o) => sum + o.totalValue, 0);
  
  const statusBreakdown: Record<OrderStatus, number> = {
    pending: orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    "in-transit": orders.filter(o => o.status === "in-transit").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length
  };
  
  const pendingOrders = statusBreakdown.pending;
  const inTransitOrders = statusBreakdown["in-transit"];
  const deliveredOrders = statusBreakdown.delivered;
  
  // Calculate late orders
  const lateOrders = orders.filter(o => 
    isOrderLate(o.expectedDelivery, o.actualDelivery)
  ).length;
  
  // Calculate average lead time for delivered orders
  const delivered = orders.filter(o => o.actualDelivery);
  const averageLeadTime = delivered.length > 0
    ? Math.round(
        delivered.reduce((sum, o) => 
          sum + calculateLeadTime(o.orderDate, o.actualDelivery!), 0
        ) / delivered.length
      )
    : 0;
  
  // On-time rate
  const onTimeRate = delivered.length > 0
    ? Math.round(
        ((delivered.length - lateOrders) / delivered.length) * 100
      )
    : 100;
  
  // Supplier breakdown
  const supplierMap = new Map<string, { count: number; value: number }>();
  orders.forEach(o => {
    const existing = supplierMap.get(o.supplierName) || { count: 0, value: 0 };
    supplierMap.set(o.supplierName, {
      count: existing.count + 1,
      value: existing.value + o.totalValue
    });
  });
  
  const supplierBreakdown = Array.from(supplierMap.entries())
    .map(([supplier, data]) => ({
      supplier,
      orderCount: data.count,
      totalValue: Math.round(data.value * 100) / 100
    }))
    .sort((a, b) => b.totalValue - a.totalValue);
  
  return {
    totalOrders: orders.length,
    totalValue: Math.round(totalValue * 100) / 100,
    pendingOrders,
    inTransitOrders,
    deliveredOrders,
    lateOrders,
    averageLeadTime,
    onTimeRate,
    statusBreakdown,
    supplierBreakdown
  };
}

/**
 * Get orders by status
 * @param orders - Array of orders
 * @param status - Status to filter
 * @returns Filtered orders
 */
export function getOrdersByStatus(orders: ProcurementOrder[], status: OrderStatus): ProcurementOrder[] {
  return orders.filter(o => o.status === status);
}

/**
 * Get pending orders
 * @param orders - Array of orders
 * @returns Pending orders
 */
export function getPendingOrders(orders: ProcurementOrder[]): ProcurementOrder[] {
  return getOrdersByStatus(orders, "pending");
}

/**
 * Get late orders
 * @param orders - Array of orders
 * @returns Late orders
 */
export function getLateOrders(orders: ProcurementOrder[]): ProcurementOrder[] {
  return orders.filter(o => isOrderLate(o.expectedDelivery, o.actualDelivery));
}

/**
 * Format currency for display
 * @param value - Value to format
 * @returns Formatted string
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Get status color
 * @param status - Order status
 * @returns Color hex code
 */
export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case "pending": return "#f59e0b";
    case "confirmed": return "#3b82f6";
    case "in-transit": return "#8b5cf6";
    case "delivered": return "#22c55e";
    case "cancelled": return "#ef4444";
    default: return "#6b7280";
  }
}

