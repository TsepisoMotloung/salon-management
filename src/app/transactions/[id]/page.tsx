"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import { Transaction, Client } from "@/types/index";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  useEffect(() => {
    fetchTransaction();
  }, [params.id]);

  const fetchTransaction = async () => {
    try {
      const response = await fetch(`/api/transactions/${params.id}`);
      const data = await response.json();
      setTransaction(data);
      setTransactionType(data.type);
      if (data.client) {
        setSelectedClient(data.client);
        setClientSearch(data.client.fullname);
      }
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

  const searchClients = async (query: string) => {
    if (query.length === 0) {
      setClients([]);
      return;
    }
    try {
      const response = await fetch(`/api/clients?search=${query}`);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };

  const handleClientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientSearch(e.target.value);
    searchClients(e.target.value);
    setShowClientDropdown(true);
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setClientSearch(client.fullname);
    setShowClientDropdown(false);
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
      clientId: transactionType === "money-in" ? selectedClient?.id : null,
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
                  <select
                    name="type"
                    value={transactionType}
                    onChange={(e) => {
                      setTransactionType(e.target.value);
                      if (e.target.value !== "money-in") {
                        setSelectedClient(null);
                        setClientSearch("");
                      }
                    }}
                    className="input-field"
                  >
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
                    {getCategories(transactionType).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client Selection for Money-In */}
              {transactionType === "money-in" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Client (optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search and select a client..."
                      value={clientSearch}
                      onChange={handleClientSearch}
                      onFocus={() => setShowClientDropdown(true)}
                      className="input-field"
                    />
                    {showClientDropdown && clients.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg max-h-64 overflow-y-auto">
                        {clients.map((client) => (
                          <button
                            key={client.id}
                            type="button"
                            onClick={() => handleSelectClient(client)}
                            className="w-full text-left p-3 hover:bg-gray-100 border-b last:border-b-0"
                          >
                            <div className="font-semibold">{client.fullname}</div>
                            <div className="text-sm text-gray-600">
                              {client.phoneNumber}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedClient && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-sm">{selectedClient.fullname}</p>
                        <p className="text-xs text-gray-600">
                          {selectedClient.phoneNumber}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedClient(null);
                          setClientSearch("");
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}

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
