"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import { Booking } from "@/types/index";
import { formatDate, formatCurrency } from "@/utils/format";
import Link from "next/link";
import { Plus, Trash2, Edit, Search } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [status]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (status) query.append("status", status);

      const response = await fetch(`/api/bookings?${query.toString()}`);
      
      if (!response.ok) {
        console.error("API error:", response.status, response.statusText);
        setBookings([]);
        return;
      }
      
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      fetchBookings();
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const searchTerm = search.toLowerCase();
    const fullnameMatch = b.fullname.toLowerCase().includes(searchTerm);
    const phoneMatch = b.phoneNumber.includes(search);
    const clientMatch = b.client?.fullname.toLowerCase().includes(searchTerm);
    return fullnameMatch || phoneMatch || clientMatch;
  });

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Bookings</h1>
          <Link href="/bookings/new" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            New Booking
          </Link>
        </div>

        {/* Filters */}
        <div className="card mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.length === 0 ? (
              <div className="card text-center py-8 text-gray-600">
                No bookings found
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div key={booking.id} className="card flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold">{booking.fullname}</h3>
                    <p className="text-sm text-gray-600">{booking.phoneNumber}</p>
                    {booking.client && (
                      <Link
                        href={`/clients/${booking.client.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 inline-block mt-1"
                      >
                        → Linked to {booking.client.fullname}
                      </Link>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span className="bg-gray-200 px-2 py-1 rounded">{booking.styleRequested}</span>
                      <span className="bg-gray-200 px-2 py-1 rounded">{formatDate(booking.bookingDate)}</span>
                      <span className={`px-2 py-1 rounded ${
                        booking.status === "Completed" ? "bg-green-100 text-green-800" :
                        booking.status === "Cancelled" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    {booking.estimatedAmount && (
                      <p className="text-sm text-gray-600 mt-2">
                        Est: {formatCurrency(booking.estimatedAmount)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/bookings/${booking.id}`} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
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
