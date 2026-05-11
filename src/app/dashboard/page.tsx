"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import { DashboardStats } from "@/types/index";
import { formatCurrency, formatDate } from "@/utils/format";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Calendar,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        const data = await response.json();
        setStats(data);

        // Generate mock chart data
        const mockData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          mockData.push({
            date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            income: Math.random() * 5000 + 1000,
            expenses: Math.random() * 2000 + 500,
          });
        }
        setChartData(mockData);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Bookings */}
          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm mb-1">Today's Bookings</p>
                <h3 className="text-3xl font-bold">{stats?.todayBookings || 0}</h3>
              </div>
              <Calendar className="text-black" size={24} />
            </div>
          </div>

          {/* Income */}
          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm mb-1">Today's Income</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats?.todayIncome || 0)}
                </h3>
              </div>
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>

          {/* Expenses */}
          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm mb-1">Today's Expenses</p>
                <h3 className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats?.todayExpenses || 0)}
                </h3>
              </div>
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>

          {/* Available Cash */}
          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm mb-1">Available Cash</p>
                <h3 className="text-2xl font-bold">
                  {formatCurrency(stats?.availableCash || 0)}
                </h3>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Income vs Expenses */}
          <div className="card overflow-hidden">
            <h3 className="font-bold mb-4">Income vs Expenses (7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10b981" />
                <Bar dataKey="expenses" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Trend */}
          <div className="card overflow-hidden">
            <h3 className="font-bold mb-4">Profit Trend (7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.map(d => ({
                ...d,
                profit: d.income - d.expenses
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="profit" stroke="#000" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={20} className="text-yellow-600" />
              <h3 className="font-bold">Low Stock Items</h3>
            </div>
            {stats?.lowStockItems && stats.lowStockItems.length > 0 ? (
              <div className="space-y-2">
                {stats.lowStockItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm">{item.itemName}</span>
                    <span className="text-sm font-bold text-yellow-600">
                      {item.quantity} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No low stock items</p>
            )}
          </div>

          {/* Upcoming Bookings */}
          <div className="card">
            <h3 className="font-bold mb-4">Upcoming Bookings</h3>
            {stats?.upcomingBookings && stats.upcomingBookings.length > 0 ? (
              <div className="space-y-2">
                {stats.upcomingBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="p-2 bg-blue-50 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold">{booking.fullname}</p>
                        <p className="text-xs text-gray-600">{booking.styleRequested}</p>
                      </div>
                      <span className="text-xs text-gray-600">
                        {formatDate(booking.bookingDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No upcoming bookings</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-3 flex-wrap">
          <Link href="/bookings/new" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            New Booking
          </Link>
          <Link href="/transactions/new" className="btn-secondary flex items-center gap-2">
            <Plus size={20} />
            New Transaction
          </Link>
          <Link href="/inventory" className="btn-secondary flex items-center gap-2">
            <Plus size={20} />
            Add Stock
          </Link>
        </div>
      </div>
    </ProtectedLayout>
  );
}
