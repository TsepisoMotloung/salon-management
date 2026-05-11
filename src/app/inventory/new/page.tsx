"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewInventoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      itemName: formData.get("itemName"),
      category: formData.get("category"),
      quantity: parseInt(formData.get("quantity") as string),
      costPrice: parseFloat(formData.get("costPrice") as string),
    };

    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create item");

      router.push("/inventory");
    } catch (err) {
      setError("Failed to create item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/inventory" className="p-2 hover:bg-gray-200 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Add Inventory Item</h1>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="card space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="itemName"
                  required
                  className="input-field"
                  placeholder="e.g., Brazilian Hair, Gel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select name="category" required className="input-field">
                  <option value="">Select category</option>
                  <option value="Hair">Hair</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Chemicals">Chemicals</option>
                  <option value="Tools">Tools</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="0"
                    step="1"
                    className="input-field"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cost Price (R) *
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    required
                    min="0"
                    step="0.01"
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? "Adding..." : "Add Item"}
              </button>
              <Link href="/inventory" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedLayout>
  );
}
