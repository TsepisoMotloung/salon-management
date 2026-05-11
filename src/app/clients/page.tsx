"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import { Client } from "@/types/index";
import Link from "next/link";
import { Plus, Trash2, Eye, Search } from "lucide-react";
import { formatCurrency } from "@/utils/format";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/clients");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/clients/${id}`, { method: "DELETE" });
      fetchClients();
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  const filteredClients = clients.filter((c) =>
    c.fullname.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber.includes(search)
  );

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Clients</h1>
          <Link href="/clients/new" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            New Client
          </Link>
        </div>

        {/* Search */}
        <div className="card mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Clients List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClients.length === 0 ? (
              <div className="card text-center py-8 text-gray-600">
                No clients found
              </div>
            ) : (
              filteredClients.map((client) => {
                const totalSpent = (client.transactions as any)?.reduce((sum: number, t: any) => sum + (t.type === "money-in" ? t.amount : 0), 0) || 0;
                return (
                  <div key={client.id} className="card flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold">{client.fullname}</h3>
                      <p className="text-sm text-gray-600">{client.phoneNumber}</p>
                        <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-gray-600">
                          Total Spent: {formatCurrency(totalSpent)}
                        </span>
                        <span className="text-gray-600">
                          Transactions: {(client.transactions as any)?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/clients/${client.id}`} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                        <Eye size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
