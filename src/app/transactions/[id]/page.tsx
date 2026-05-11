"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import { Transaction } from "@/types/index";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransaction();
  }, [params.id]);

  const fetchTransaction = async () => {
    try {
      const response = await fetch(`/api/transactions/${params.id}`);
      const data = await response.json();
      setTransaction(data);
    } catch (err) {
      setError("Failed to fetch transaction");
    } finally {
      setLoading(false);
    }
  };

  const getCategories = (type: string): string[] => {
    switch (type) {
      case "money-in":
        return ["Customer Payment", "Deposit", "Refund"];
      case "money-out":
        return ["Rent", "Supplies", "Electricity", "Transport", "Other"];
      case "investment":
        return ["Savings", "Stock Investment", "Equipment"];
      case "withdrawal":
        return ["Personal Use", "Owner Withdrawal"];
      default:
        return [];
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      type: formData.get("type"),
      category: formData.get("category"),
      amount: parseFloat(formData.get("amount") as string),
      description: formData.get("description"),
      paymentMethod: formData.get("paymentMethod"),
      transactionDate: formData.get("transactionDate"),
      clientId: formData.get("clientId") || null,
    };

    try {
      const response = await fetch(`/api/transactions/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update transaction");

      router.push("/transactions");
    } catch (err) {
      setError("Failed to update transaction");
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

  if (!transaction) {
    return (
      <ProtectedLayout>
        <div className="p-6">Error: Transaction not found</div>
      </ProtectedLayout>
    );
  }

  const transactionDate = new Date(transaction.transactionDate);
  const localDateTime = transactionDate.toISOString().slice(0, 16);

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/transactions" className="p-2 hover:bg-gray-200 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Edit Transaction</h1>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="card space-y-4">
              <h2 className="font-bold text-lg">Transaction Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select name="type" defaultValue={transaction.type} className="input-field">
                    <option value="money-in">Money In</option>
                    <option value="money-out">Money Out</option>
                    <option value="investment">Investment</option>
                    <option value="withdrawal">Withdrawal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select name="category" defaultValue={transaction.category} className="input-field">
                    <option value="">Select</option>
                    {getCategories(transaction.type).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (R)</label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    defaultValue={transaction.amount}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <select name="paymentMethod" defaultValue={transaction.paymentMethod} className="input-field">
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  name="transactionDate"
                  defaultValue={localDateTime}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={transaction.description || ""}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link href="/transactions" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedLayout>
  );
}
