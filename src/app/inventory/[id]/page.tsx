"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import { InventoryItem } from "@/types/index";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditInventoryPage() {
  const router = useRouter();
  const params = useParams();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItem();
  }, [params.id]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/inventory/${params.id}`);
      const data = await response.json();
      setItem(data);
    } catch (err) {
      setError("Failed to fetch item");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      itemName: formData.get("itemName"),
      category: formData.get("category"),
      quantity: parseInt(formData.get("quantity") as string),
      costPrice: parseFloat(formData.get("costPrice") as string),
    };

    try {
      const response = await fetch(`/api/inventory/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update item");

      router.push("/inventory");
    } catch (err) {
      setError("Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </ProtectedLayout>
    );
  }

  if (!item) {
    return (
      <ProtectedLayout>
        <div className="p-6">Error: Item not found</div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/inventory" className="p-2 hover:bg-gray-200 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Edit Item</h1>
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
                <label className="block text-sm font-medium mb-2">Item Name</label>
                <input
                  type="text"
                  name="itemName"
                  defaultValue={item.itemName}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select name="category" defaultValue={item.category} className="input-field">
                  <option value="Hair">Hair</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Chemicals">Chemicals</option>
                  <option value="Tools">Tools</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    defaultValue={item.quantity}
                    min="0"
                    step="1"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cost Price (R)</label>
                  <input
                    type="number"
                    name="costPrice"
                    defaultValue={item.costPrice}
                    min="0"
                    step="0.01"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
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
