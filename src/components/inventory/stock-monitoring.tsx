import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { type InventoryItem } from "@/lib/inventory-data";

interface StockMonitoringProps {
  inventoryItems: InventoryItem[];
  onUpdateStock: (itemId: string, newStock: number) => void;
  onRefresh: () => void;
}

export function StockMonitoring({
  inventoryItems,
  onUpdateStock,
  onRefresh,
}: StockMonitoringProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      case "overstock":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "low-stock":
      case "out-of-stock":
        return <AlertTriangle className="w-4 h-4" />;
      case "overstock":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStockLevel = (item: InventoryItem) => {
    if (item.maximumStock === 0) return 0;
    return (item.currentStock / item.maximumStock) * 100;
  };

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(
    new Set(inventoryItems.map((item) => item.category)),
  );

  const stockSummary = {
    total: inventoryItems.length,
    inStock: inventoryItems.filter((item) => item.status === "in-stock").length,
    lowStock: inventoryItems.filter((item) => item.status === "low-stock")
      .length,
    outOfStock: inventoryItems.filter((item) => item.status === "out-of-stock")
      .length,
    overstock: inventoryItems.filter((item) => item.status === "overstock")
      .length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Stock Level Monitoring
          </h2>
          <p className="text-gray-600">
            Real-time tracking of inventory quantities across all locations
          </p>
        </div>
        <Button onClick={onRefresh} className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {stockSummary.total}
            </div>
            <div className="text-sm text-gray-600">Total Items</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stockSummary.inStock}
            </div>
            <div className="text-sm text-green-700">In Stock</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stockSummary.lowStock}
            </div>
            <div className="text-sm text-yellow-700">Low Stock</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stockSummary.outOfStock}
            </div>
            <div className="text-sm text-red-700">Out of Stock</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stockSummary.overstock}
            </div>
            <div className="text-sm text-blue-700">Overstock</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-blue-600" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="overstock">Overstock</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Actions
              </label>
              <Button variant="outline" className="w-full">
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">
                        {item.status.replace("-", " ")}
                      </span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">SKU</div>
                      <div className="font-medium">{item.sku}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Category</div>
                      <div className="font-medium">{item.category}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Location</div>
                      <div className="font-medium">{item.location}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Supplier</div>
                      <div className="font-medium">{item.supplier}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Current Stock</div>
                      <div className="text-xl font-bold text-blue-600">
                        {item.currentStock.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Minimum Stock</div>
                      <div className="font-medium">
                        {item.minimumStock.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Reorder Point</div>
                      <div className="font-medium">
                        {item.reorderPoint.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Unit Value</div>
                      <div className="font-medium">
                        {formatCurrency(item.unitCost)}
                      </div>
                    </div>
                  </div>

                  {/* Stock Level Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Stock Level</span>
                      <span className="font-medium">
                        {getStockLevel(item).toFixed(1)}% of capacity
                      </span>
                    </div>
                    <Progress
                      value={getStockLevel(item)}
                      className="h-3"
                      // Add color based on status
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Min: {item.minimumStock}</span>
                      <span>Reorder: {item.reorderPoint}</span>
                      <span>Max: {item.maximumStock}</span>
                    </div>
                  </div>

                  {/* Batch/Serial Information */}
                  {(item.batchNumbers || item.serialNumbers) && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {item.batchNumbers && (
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              Batch Numbers
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.batchNumbers.join(", ")}
                            </div>
                          </div>
                        )}
                        {item.serialNumbers && (
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              Serial Numbers (Sample)
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.serialNumbers.slice(0, 3).join(", ")}
                              {item.serialNumbers.length > 3 && "..."}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      const newStock = prompt(
                        "Enter new stock level:",
                        item.currentStock.toString(),
                      );
                      if (newStock && !isNaN(parseInt(newStock))) {
                        onUpdateStock(item.id, parseInt(newStock));
                      }
                    }}
                  >
                    Update Stock
                  </Button>
                </div>
              </div>

              {/* Last Update Info */}
              <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                Last updated:{" "}
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(item.lastStockUpdate)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
