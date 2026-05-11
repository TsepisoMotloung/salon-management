"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import { formatCurrency } from "@/utils/format";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ProfitData {
  monthlyMetrics: any[];
  categoryBreakdown: any[];
  totalIncome: number;
  totalExpenses: number;
  totalProfit: number;
  totalInvestment: number;
  totalWithdrawal: number;
  availableCash: number;
}

export default function ProfitAnalysisPage() {
  const [data, setProfitData] = useState<ProfitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("monthly");

  useEffect(() => {
    fetchProfitData();
  }, [timeRange]);

  const fetchProfitData = async () => {
    try {
      setLoading(true);
      // Fetch all transactions to calculate profit data
      const response = await fetch("/api/transactions");
      const transactions = await response.json();

      // Calculate metrics
      const totalIncome = transactions
        .filter((t: any) => t.type === "money-in")
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter((t: any) => t.type === "money-out")
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      const totalInvestment = transactions
        .filter((t: any) => t.type === "investment")
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      const totalWithdrawal = transactions
        .filter((t: any) => t.type === "withdrawal")
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      let totalCash = totalIncome - totalExpenses - totalInvestment - totalWithdrawal;

      // Generate monthly metrics
      const monthlyData: { [key: string]: any } = {};
      transactions.forEach((t: any) => {
        const date = new Date(t.transactionDate);
        const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey, income: 0, expenses: 0 };
        }

        if (t.type === "money-in") {
          monthlyData[monthKey].income += t.amount;
        } else if (t.type === "money-out") {
          monthlyData[monthKey].expenses += t.amount;
        }
      });

      const monthlyMetrics = Object.values(monthlyData).slice(-12);

      // Generate category breakdown
      const categoryData: { [key: string]: number } = {};
      transactions
        .filter((t: any) => t.type === "money-out")
        .forEach((t: any) => {
          categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
        });

      const categoryBreakdown = Object.entries(categoryData).map(([category, amount]) => ({
        name: category,
        value: amount,
      }));

      setProfitData({
        monthlyMetrics,
        categoryBreakdown,
        totalIncome,
        totalExpenses,
        totalProfit: totalIncome - totalExpenses,
        totalInvestment,
        totalWithdrawal,
        availableCash: totalCash,
      });
    } catch (error) {
      console.error("Failed to fetch profit data:", error);
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

  if (!data) {
    return (
      <ProtectedLayout>
        <div className="p-6">Error loading profit data</div>
      </ProtectedLayout>
    );
  }

  const profitMargin = data.totalIncome > 0 ? (data.totalProfit / data.totalIncome) * 100 : 0;

  const COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Profit Analysis</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Total Income</p>
            <h3 className="text-2xl font-bold text-green-600">
              {formatCurrency(data.totalIncome)}
            </h3>
          </div>

          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Total Expenses</p>
            <h3 className="text-2xl font-bold text-red-600">
              {formatCurrency(data.totalExpenses)}
            </h3>
          </div>

          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm mb-1">Net Profit</p>
                <h3 className={`text-2xl font-bold ${data.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(data.totalProfit)}
                </h3>
                <p className="text-xs text-gray-600 mt-1">{profitMargin.toFixed(1)}% margin</p>
              </div>
              {data.totalProfit >= 0 ? (
                <TrendingUp className="text-green-600" size={24} />
              ) : (
                <TrendingDown className="text-red-600" size={24} />
              )}
            </div>
          </div>

          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Available Cash</p>
            <h3 className="text-2xl font-bold">
              {formatCurrency(data.availableCash)}
            </h3>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Total Invested</p>
            <p className="text-xl font-bold">{formatCurrency(data.totalInvestment)}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Total Withdrawn</p>
            <p className="text-xl font-bold">{formatCurrency(data.totalWithdrawal)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Income vs Expenses */}
          <div className="card overflow-hidden">
            <h3 className="font-bold mb-4">Income vs Expenses Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10b981" />
                <Bar dataKey="expenses" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown */}
          <div className="card overflow-hidden">
            <h3 className="font-bold mb-4">Expense Breakdown</h3>
            {data.categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.categoryBreakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-600">
                No expense data
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card">
          <h3 className="font-bold text-lg mb-4">Recommendations</h3>
          <div className="space-y-3 text-sm">
            {data.totalProfit > 5000 && (
              <div className="flex gap-3 p-3 bg-green-50 rounded">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-semibold">Great Performance!</p>
                  <p className="text-gray-600">Consider reinvesting profits in stock or expanding services.</p>
                </div>
              </div>
            )}
            {data.totalProfit > 0 && data.totalProfit <= 5000 && (
              <div className="flex gap-3 p-3 bg-yellow-50 rounded">
                <span className="text-xl">💡</span>
                <div>
                  <p className="font-semibold">Moderate Profit</p>
                  <p className="text-gray-600">Focus on reducing expenses in key categories.</p>
                </div>
              </div>
            )}
            {data.totalProfit <= 0 && (
              <div className="flex gap-3 p-3 bg-red-50 rounded">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-semibold">Low Profit Alert</p>
                  <p className="text-gray-600">Review expenses and consider increasing service prices or volume.</p>
                </div>
              </div>
            )}
            {data.totalExpenses > data.totalIncome * 0.5 && (
              <div className="flex gap-3 p-3 bg-yellow-50 rounded">
                <span className="text-xl">📊</span>
                <div>
                  <p className="font-semibold">High Expense Ratio</p>
                  <p className="text-gray-600">Expenses are {((data.totalExpenses / data.totalIncome) * 100).toFixed(1)}% of income.</p>
                </div>
              </div>
            )}
            <div className="flex gap-3 p-3 bg-blue-50 rounded">
              <span className="text-xl">💰</span>
              <div>
                <p className="font-semibold">Cash Flow</p>
                <p className="text-gray-600">You have {formatCurrency(data.availableCash)} available after all transactions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
