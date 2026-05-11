"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import ClientSelector from "@/components/ClientSelector";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Client } from "@/types/index";

export default function NewBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [useExistingClient, setUseExistingClient] = useState(false);

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setUseExistingClient(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Use selected client data or form data
    const fullname = useExistingClient 
      ? selectedClient.fullname 
      : formData.get("fullname");
    const phoneNumber = useExistingClient 
      ? selectedClient.phoneNumber 
      : formData.get("phoneNumber");

    const data: any = {
      fullname,
      phoneNumber,
      styleRequested: formData.get("styleRequested"),
      mediumReached: formData.get("mediumReached"),
      bookingDate: formData.get("bookingDate"),
      estimatedAmount: formData.get("estimatedAmount")
        ? parseFloat(formData.get("estimatedAmount") as string)
        : null,
      notes: formData.get("notes"),
      status: "Pending",
      clientId: selectedClient?.id || null,
    };

    // If creating new client with booking
    if (!useExistingClient && selectedClient) {
      data.createNewClient = selectedClient;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create booking");

      router.push("/bookings");
    } catch (err) {
      setError("Failed to create booking. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/bookings" className="p-2 hover:bg-gray-200 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">New Booking</h1>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Client Selection */}
            <div className="card space-y-4">
              <h2 className="font-bold text-lg">Select or Create Client</h2>
              
              <ClientSelector 
                onSelect={handleClientSelect}
                placeholder="Search existing client or click + to create new..."
              />

              {selectedClient && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-blue-900">{selectedClient.fullname}</p>
                      <p className="text-sm text-blue-800">{selectedClient.phoneNumber}</p>
                      {selectedClient.id && (
                        <p className="text-xs text-blue-700 mt-1">✓ Existing client</p>
                      )}
                      {!selectedClient.id && (
                        <p className="text-xs text-blue-700 mt-1">⊕ New client (will be created)</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClient(null);
                        setUseExistingClient(false);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              {!selectedClient && (
                <div className="p-3 text-sm text-gray-600 bg-yellow-50 rounded border border-yellow-200">
                  👆 Select an existing client or create a new one to continue
                </div>
              )}
            </div>

            {selectedClient && (
              <>
                <div className="card space-y-4">
                  <h2 className="font-bold text-lg">Booking Details</h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Style Requested *
                    </label>
                    <input
                      type="text"
                      name="styleRequested"
                      required
                      className="input-field"
                      placeholder="e.g., Braids, Hair cut, Perms"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Booking Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="bookingDate"
                        required
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        How did they reach us? *
                      </label>
                      <select name="mediumReached" required className="input-field">
                        <option value="">Select...</option>
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
                      <label className="block text-sm font-medium mb-2">
                        Estimated Amount (R)
                      </label>
                      <input
                        type="number"
                        name="estimatedAmount"
                        step="0.01"
                        min="0"
                        className="input-field"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      rows={4}
                      className="input-field"
                      placeholder="Add any special notes..."
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                    {loading ? "Creating..." : "Create Booking"}
                  </button>
                  <Link href="/bookings" className="btn-secondary">
                    Cancel
                  </Link>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </ProtectedLayout>
  );
}
