"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import { InventoryItem } from "@/types/index";
import { formatCurrency, formatDate } from "@/utils/format";
import Link from "next/link";
import { Plus, Trash2, Edit, AlertTriangle, Search } from "lucide-react";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, [lowStockOnly]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (lowStockOnly) query.append("lowStock", "true");

      const response = await fetch(`/api/inventory?${query.toString()}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      fetchInventory();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = items.filter((item) => item.quantity <= 5);
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.costPrice, 0);

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Inventory</h1>
          <Link href="/inventory/new" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Add Item
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <p className="text-gray-600 text-xs mb-1">Total Items</p>
            <p className="font-bold text-lg">{items.length}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-xs mb-1">Low Stock</p>
            <p className={`font-bold text-lg ${lowStockItems.length > 0 ? "text-yellow-600" : ""}`}>
              {lowStockItems.length}
            </p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-xs mb-1">Total Value</p>
            <p className="font-bold text-lg">{formatCurrency(totalValue)}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-xs mb-1">Categories</p>
            <p className="font-bold text-lg">{new Set(items.map((i) => i.category)).size}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <label className="flex items-center gap-2 px-4 py-2 cursor-pointer">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Low Stock Only</span>
          </label>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="card text-center py-8 text-gray-600">
                No items found
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`card flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    item.quantity <= 5 ? "border-l-4 border-yellow-400" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {item.quantity <= 5 && (
                        <AlertTriangle size={18} className="text-yellow-600" />
                      )}
                      <h3 className="font-bold">{item.itemName}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{item.category}</p>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span>
                        Qty: <span className={item.quantity <= 5 ? "text-yellow-600 font-bold" : ""}>{item.quantity}</span>
                      </span>
                      <span>Unit: {formatCurrency(item.costPrice)}</span>
                      <span>
                        Total: {formatCurrency(item.quantity * item.costPrice)}
                      </span>
                      <span className="text-gray-500">Added: {formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/inventory/${item.id}`} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
