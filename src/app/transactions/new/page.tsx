"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import { Client } from "@/types/index";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactionType, setTransactionType] = useState("money-in");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

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
    setLoading(true);

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
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create transaction");

      router.push("/transactions");
    } catch (err) {
      setError("Failed to create transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/transactions" className="p-2 hover:bg-gray-200 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">New Transaction</h1>
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
                  <label className="block text-sm font-medium mb-2">
                    Type *
                  </label>
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
                    required
                    className="input-field"
                  >
                    <option value="money-in">Money In</option>
                    <option value="money-out">Money Out</option>
                    <option value="investment">Investment</option>
                    <option value="withdrawal">Withdrawal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <select name="category" required className="input-field">
                    <option value="">Select category</option>
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
                  <label className="block text-sm font-medium mb-2">
                    Amount (R) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    required
                    step="0.01"
                    min="0"
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Payment Method *
                  </label>
                  <select name="paymentMethod" required className="input-field">
                    <option value="">Select</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="transactionDate"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="input-field"
                  placeholder="Add notes about this transaction..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? "Creating..." : "Create Transaction"}
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
