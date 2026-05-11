"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import { Transaction } from "@/types/index";
import { formatDate, formatCurrency, getDateRange } from "@/utils/format";
import Link from "next/link";
import { Plus, Trash2, Edit, Search } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [dateRange, setDateRange] = useState("month");

  useEffect(() => {
    fetchTransactions();
  }, [type, dateRange]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const range = getDateRange(dateRange as "day" | "week" | "month" | "year");
      const query = new URLSearchParams();
      if (type) query.append("type", type);
      query.append("dateFrom", range.start.toISOString());
      query.append("dateTo", range.end.toISOString());

      const response = await fetch(`/api/transactions?${query.toString()}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      fetchTransactions();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const filteredTransactions = transactions.filter((t) =>
    t.description?.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalIn: filteredTransactions
      .filter((t) => t.type === "money-in")
      .reduce((sum, t) => sum + t.amount, 0),
    totalOut: filteredTransactions
      .filter((t) => t.type === "money-out")
      .reduce((sum, t) => sum + t.amount, 0),
    totalInvest: filteredTransactions
      .filter((t) => t.type === "investment")
      .reduce((sum, t) => sum + t.amount, 0),
    totalWithdraw: filteredTransactions
      .filter((t) => t.type === "withdrawal")
      .reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Transactions</h1>
          <Link href="/transactions/new" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            New Transaction
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="card">
            <p className="text-gray-600 text-xs mb-1">Money In</p>
            <p className="font-bold text-green-600">{formatCurrency(stats.totalIn)}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-xs mb-1">Money Out</p>
            <p className="font-bold text-red-600">{formatCurrency(stats.totalOut)}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-xs mb-1">Invested</p>
            <p className="font-bold">{formatCurrency(stats.totalInvest)}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-xs mb-1">Withdrawn</p>
            <p className="font-bold">{formatCurrency(stats.totalWithdraw)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input-field"
          >
            <option value="">All Types</option>
            <option value="money-in">Money In</option>
            <option value="money-out">Money Out</option>
            <option value="investment">Investment</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="card text-center py-8 text-gray-600">
                No transactions found
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="card flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.type === "money-in" ? "bg-green-600" :
                        transaction.type === "money-out" ? "bg-red-600" :
                        "bg-gray-600"
                      }`} />
                      <div>
                        <p className="font-semibold">{transaction.category}</p>
                        {transaction.description && (
                          <p className="text-sm text-gray-600">{transaction.description}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatDate(transaction.transactionDate)} • {transaction.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        transaction.type === "money-in" ? "text-green-600" :
                        transaction.type === "money-out" ? "text-red-600" :
                        "text-gray-600"
                      }`}>
                        {transaction.type === "money-in" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        transaction.type === "money-in" ? "bg-green-100 text-green-800" :
                        transaction.type === "money-out" ? "bg-red-100 text-red-800" :
                        "bg-gray-100"
                      }`}>
                        {transaction.type}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/transactions/${transaction.id}`} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
