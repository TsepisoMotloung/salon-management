"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import { Client } from "@/types/index";
import { formatDate, formatCurrency } from "@/utils/format";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ClientDetailPage() {
  const params = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClient();
  }, [params.id]);

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/clients/${params.id}`);
      const data = await response.json();
      setClient(data);
    } catch (err) {
      setError("Failed to fetch client");
    } finally {
      setLoading(false);
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

  if (!client) {
    return (
      <ProtectedLayout>
        <div className="p-6">Error: Client not found</div>
      </ProtectedLayout>
    );
  }

  const totalSpent = client.transactions?.reduce((sum, t) => sum + (t.type === "money-in" ? t.amount : 0), 0) || 0;

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/clients" className="p-2 hover:bg-gray-200 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">{client.fullname}</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Phone Number</p>
            <h3 className="font-bold text-xl">{client.phoneNumber}</h3>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Total Spent</p>
            <h3 className="font-bold text-xl">{formatCurrency(totalSpent)}</h3>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Transactions</p>
            <h3 className="font-bold text-xl">{client.transactions?.length || 0}</h3>
          </div>
        </div>

        {/* Transaction History */}
        <div className="card">
          <h2 className="font-bold text-lg mb-4">Transaction History</h2>
          {client.transactions && client.transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-right p-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {client.transactions.map((t: any) => (
                    <tr key={t.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{formatDate(t.transactionDate)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          t.type === "money-in" ? "bg-green-100 text-green-800" :
                          t.type === "money-out" ? "bg-red-100 text-red-800" :
                          "bg-gray-100"
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="p-3">{t.category}</td>
                      <td className="p-3 text-right font-semibold">
                        {t.type === "money-in" ? "+" : "-"}{formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No transactions</p>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
