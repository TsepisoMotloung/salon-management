"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import { Booking, Client } from "@/types/index";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [params.id]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${params.id}`);
      const data = await response.json();
      setBooking(data);
      
      // If booking has a clientId, fetch the client data
      if (data.clientId) {
        try {
          const clientResponse = await fetch(`/api/clients/${data.clientId}`);
          const clientData = await clientResponse.json();
          setSelectedClient(clientData);
          setClientSearch(clientData.fullname);
        } catch (err) {
          console.log("Note: Client lookup not critical");
        }
      }
    } catch (err) {
      setError("Failed to fetch booking");
    } finally {
      setLoading(false);
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
      styleRequested: formData.get("styleRequested"),
      mediumReached: formData.get("mediumReached"),
      bookingDate: formData.get("bookingDate"),
      estimatedAmount: formData.get("estimatedAmount")
        ? parseFloat(formData.get("estimatedAmount") as string)
        : null,
      notes: formData.get("notes"),
      status: formData.get("status"),
      clientId: selectedClient?.id || null,
    };

    try {
      const response = await fetch(`/api/bookings/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update booking");

      router.push("/bookings");
    } catch (err) {
      setError("Failed to update booking");
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

  if (!booking) {
    return (
      <ProtectedLayout>
        <div className="p-6">Error: Booking not found</div>
      </ProtectedLayout>
    );
  }

  const bookingDate = new Date(booking.bookingDate);
  const localDateTime = bookingDate.toISOString().slice(0, 16);

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/bookings" className="p-2 hover:bg-gray-200 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Edit Booking</h1>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="card space-y-4">
              <h2 className="font-bold text-lg">Linked Client</h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Select or Link Client
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
            </div>

            <div className="card space-y-4">
              <h2 className="font-bold text-lg">Booking Details</h2>

              <div>
                <label className="block text-sm font-medium mb-2">Style Requested</label>
                <input
                  type="text"
                  name="styleRequested"
                  defaultValue={booking.styleRequested}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Booking Date & Time</label>
                  <input
                    type="datetime-local"
                    name="bookingDate"
                    defaultValue={localDateTime}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Medium Reached</label>
                  <select name="mediumReached" defaultValue={booking.mediumReached} className="input-field">
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Facebook">Facebook</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Amount (R)</label>
                  <input
                    type="number"
                    name="estimatedAmount"
                    step="0.01"
                    defaultValue={booking.estimatedAmount || ""}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select name="status" defaultValue={booking.status} className="input-field">
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  name="notes"
                  rows={4}
                  defaultValue={booking.notes || ""}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link href="/bookings" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedLayout>
  );
}
