import React, { useState } from "react";
import {
  ProcurementOrder,
  Supplier,
  ProductionPlan,
} from "../../lib/supply-chain-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
  Truck,
  Factory,
  BarChart3,
  TrendingUp,
  FileText,
  User,
} from "lucide-react";
import { useCurrencyFormatter } from "@/components/currency-formatter";

interface ProcurementTrackingProps {
  procurementOrders: ProcurementOrder[];
  suppliers: Supplier[];
  productionPlans: ProductionPlan[];
}

export function ProcurementTracking({
  procurementOrders,
  suppliers,
  productionPlans,
}: ProcurementTrackingProps) {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const { format } = useCurrencyFormatter();

  const filteredOrders = procurementOrders.filter((order) => {
    if (selectedStatus !== "all" && order.status !== selectedStatus)
      return false;
    if (selectedSupplier !== "all" && order.supplierId !== selectedSupplier)
      return false;
    return true;
  });

  const formatCurrency = (amount: number) => format(amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "in-transit":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "in-transit":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <Package className="h-4 w-4" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier?.name || `Supplier ${supplierId}`;
  };

  const getDaysUntilDelivery = (deliveryDate: string | Date | undefined) => {
    if (!deliveryDate) return 0;
    const delivery = new Date(deliveryDate);
    if (isNaN(delivery.getTime())) return 0;
    const today = new Date();
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalOrders = filteredOrders.length;
  const pendingOrders = filteredOrders.filter(
    (o) => o.status === "pending",
  ).length;
  const totalValue = filteredOrders.reduce(
    (sum, o) => sum + (o.totalValue || 0),
    0,
  );
  const averageLeadTime = 14;

  const handleNewOrder = () => {
    alert(
      "Create New Order:\n\nThis would open a form to create a new procurement order with:\n- Supplier selection\n- Item specifications\n- Quantities and delivery dates\n- Terms and conditions",
    );
  };

  const handleViewOrder = (orderId: string) => {
    const order = filteredOrders.find((o) => o.id === orderId);
    if (order) {
      alert(
        `Order Details - ${orderId}:\n\nSupplier: ${getSupplierName(order.supplierId)}\nStatus: ${order.status}\nTotal Value: ${formatCurrency(order.totalValue || 0)}\nExpected Delivery: ${order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString() : "N/A"}\nItems: ${order.items?.length || 0} items`,
      );
    }
  };

  const handleTrackOrder = (orderId: string) => {
    alert(
      `Tracking Order ${orderId}:\n\nThis would show real-time shipment tracking including:\n- Current location\n- Transit milestones\n- Estimated delivery time\n- Carrier information\n- Delivery updates`,
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Procurement Tracking
            </h2>
            <p className="text-gray-600">
              Monitor purchase orders and procurement status
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedSupplier}
              onValueChange={setSelectedSupplier}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleNewOrder}>New Order</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new procurement order</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalOrders}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Orders
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingOrders}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Value
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalValue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Lead Time
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {averageLeadTime} days
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Procurement Orders</CardTitle>
            <CardDescription>
              Detailed tracking of all procurement orders and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Supplier
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Items
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">
                      Total Amount
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">
                      Expected Delivery
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const daysUntilDelivery = getDaysUntilDelivery(
                      order.expectedDelivery,
                    );
                    const isOverdue = daysUntilDelivery < 0;

                    return (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="font-medium">{order.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{getSupplierName(order.supplierId)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-medium">
                              {order.items?.length || 0} items
                            </span>
                            <div className="text-sm text-gray-600">
                              {order.items?.slice(0, 2).map((item, index) => (
                                <div key={index}>
                                  {item.quantity}x {item.name}
                                </div>
                              )) || <div>No items</div>}
                              {(order.items?.length || 0) > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{(order.items?.length || 0) - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {formatCurrency(order.totalValue || 0)}
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {getStatusIcon(order.status)}
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.replace("-", " ")}
                            </Badge>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div
                            className={`${
                              isOverdue ? "text-red-600" : "text-gray-900"
                            }`}
                          >
                            <div className="font-medium">
                              {order.expectedDelivery
                                ? new Date(
                                    order.expectedDelivery,
                                  ).toLocaleDateString()
                                : "N/A"}
                            </div>
                            <div className="text-xs">
                              {isOverdue ? (
                                <span className="text-red-600">
                                  {Math.abs(daysUntilDelivery)} days overdue
                                </span>
                              ) : (
                                <span className="text-gray-600">
                                  {daysUntilDelivery} days left
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewOrder(order.id)}
                                >
                                  View
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View order details</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleTrackOrder(order.id)}
                                >
                                  Track
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Track shipment status</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
              <CardDescription>
                Breakdown of orders by current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "pending",
                  "confirmed",
                  "in-transit",
                  "delivered",
                  "cancelled",
                ].map((status) => {
                  const count = filteredOrders.filter(
                    (o) => o.status === status,
                  ).length;
                  const percentage =
                    totalOrders > 0 ? (count / totalOrders) * 100 : 0;

                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status)}
                          <span className="capitalize font-medium">
                            {status.replace("-", " ")}
                          </span>
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deliveries</CardTitle>
              <CardDescription>
                Orders expected in the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredOrders
                  .filter((order) => {
                    const days = getDaysUntilDelivery(order.expectedDelivery);
                    return days >= 0 && days <= 7;
                  })
                  .slice(0, 5)
                  .map((order) => {
                    const days = getDaysUntilDelivery(order.expectedDelivery);
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <span className="font-medium">{order.id}</span>
                          <div className="text-sm text-gray-600">
                            {getSupplierName(order.supplierId)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency(order.totalValue || 0)}
                          </div>
                          <div className="text-sm text-blue-600">
                            {days === 0 ? "Today" : `${days} days`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
