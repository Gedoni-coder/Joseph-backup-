import React, { useState } from "react";
import { Supplier, ProcurementOrder } from "../../lib/supply-chain-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
  Users,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
} from "lucide-react";
import { useCurrencyFormatter } from "@/components/currency-formatter";

interface SupplierManagementProps {
  suppliers: Supplier[];
  procurementOrders: ProcurementOrder[];
}

export function SupplierManagement({
  suppliers,
  procurementOrders,
}: SupplierManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { format } = useCurrencyFormatter();

  const handleAddSupplier = () => {
    alert(
      "Add Supplier functionality will open a modal to add new supplier details including contact information, certifications, and performance metrics.",
    );
  };

  const handleViewDetails = (supplier: Supplier) => {
    alert(
      `Viewing detailed information for ${supplier.name}:\n\n- Performance Score: ${getSupplierPerformanceScore(supplier).toFixed(1)}%\n- Category: ${supplier.category}\n- Contact: ${supplier.contactInfo.email}\n- Sustainability Score: ${supplier.sustainabilityScore}`,
    );
  };

  const handleContactSupplier = (supplier: Supplier) => {
    alert(
      `Contacting ${supplier.name}:\n\nEmail: ${supplier.contactInfo.email}\nPhone: ${supplier.contactInfo.phone}\n\nThis would normally open your email client or internal messaging system.`,
    );
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    if (selectedCategory !== "all" && supplier.category !== selectedCategory)
      return false;
    if (selectedStatus !== "all" && supplier.status !== selectedStatus)
      return false;
    if (
      searchTerm &&
      !supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  const formatCurrency = (amount: number) => format(amount, 0);

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getSupplierPerformanceScore = (supplier: Supplier) => {
    return supplier.performanceMetrics?.overallScore || 0;
  };

  const getSupplierRating = (supplier: Supplier) => {
    return Math.round(supplier.sustainabilityScore / 20) || 4;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getSupplierOrders = (supplierId: string) => {
    return procurementOrders.filter((order) => order.supplierId === supplierId);
  };

  const activeSuppliers = suppliers.filter((s) => s.status === "active").length;
  const avgPerformance =
    suppliers.reduce(
      (sum, s) => sum + (s.performanceMetrics?.overallScore || 0),
      0,
    ) / suppliers.length;
  const totalSpend = suppliers.reduce(
    (sum, s) => sum + (s.contracts?.[0]?.value || 0),
    0,
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Supplier Management
            </h2>
            <p className="text-gray-600">
              Monitor supplier performance and manage relationships
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="raw-materials">Raw Materials</SelectItem>
                <SelectItem value="components">Components</SelectItem>
                <SelectItem value="finished-goods">Finished Goods</SelectItem>
                <SelectItem value="services">Services</SelectItem>
              </SelectContent>
            </Select>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleAddSupplier}>Add Supplier</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new supplier to your network</p>
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
                    Active Suppliers
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {activeSuppliers}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Performance
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {avgPerformance.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Spend
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(totalSpend)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Suppliers
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {filteredSuppliers.length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => {
            const supplierOrders = getSupplierOrders(supplier.id);
            const onTimeDelivery =
              supplier.performanceMetrics?.onTimeDelivery || 0;

            return (
              <Card
                key={supplier.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4" />
                        {supplier.contactInfo?.address ||
                          "Location not specified"}
                      </CardDescription>
                    </div>
                    <Badge
                      className={getStatusColor(
                        supplier.contracts?.[0]?.status || "pending",
                      )}
                    >
                      {supplier.contracts?.[0]?.status || "pending"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      {supplier.contactInfo.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {supplier.contactInfo.phone}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rating:</span>
                    <div className="flex">
                      {getRatingStars(getSupplierRating(supplier))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({getSupplierRating(supplier)}/5)
                    </span>
                  </div>

                  {/* Performance Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Performance</span>
                      <Badge
                        className={getPerformanceColor(
                          getSupplierPerformanceScore(supplier),
                        )}
                      >
                        {getSupplierPerformanceScore(supplier).toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress
                      value={getSupplierPerformanceScore(supplier)}
                      className="h-2"
                    />
                  </div>

                  {/* On-Time Delivery */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        On-Time Delivery
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {onTimeDelivery.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={onTimeDelivery} className="h-2" />
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {supplierOrders.length}
                      </div>
                      <div className="text-xs text-gray-600">Active Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(supplier.contracts?.[0]?.value || 0)}
                      </div>
                      <div className="text-xs text-gray-600">
                        Contract Value
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="pt-2">
                    <Badge variant="outline" className="capitalize">
                      {supplier.category?.replace(/-/g, " ") || "Unknown"}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewDetails(supplier)}
                        >
                          View Details
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View detailed supplier information and metrics</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleContactSupplier(supplier)}
                        >
                          Contact
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Send message or schedule call with supplier</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Performance Insights</CardTitle>
            <CardDescription>
              Key insights and recommendations for supplier management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Top Performers</h4>
                {suppliers
                  .filter((s) => getSupplierPerformanceScore(s) >= 90)
                  .slice(0, 3)
                  .map((supplier) => (
                    <div
                      key={supplier.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{supplier.name}</span>
                        <div className="text-sm text-gray-600">
                          {supplier.category?.replace(/-/g, " ") || "Unknown"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-bold">
                          {getSupplierPerformanceScore(supplier).toFixed(1)}%
                        </div>
                        <div className="flex">
                          {getRatingStars(getSupplierRating(supplier))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Needs Attention</h4>
                {suppliers
                  .filter((s) => getSupplierPerformanceScore(s) < 80)
                  .slice(0, 3)
                  .map((supplier) => (
                    <div
                      key={supplier.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{supplier.name}</span>
                        <div className="text-sm text-gray-600">
                          {supplier.category?.replace(/-/g, " ") || "Unknown"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-red-600 font-bold">
                          {getSupplierPerformanceScore(supplier).toFixed(1)}%
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-xs text-red-600">Review</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
