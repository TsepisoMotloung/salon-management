"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullname: formData.get("fullname"),
      phoneNumber: formData.get("phoneNumber"),
    };

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create client");

      router.push("/clients");
    } catch (err) {
      setError("Failed to create client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/clients" className="p-2 hover:bg-gray-200 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">New Client</h1>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="card space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullname"
                  required
                  className="input-field"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  className="input-field"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
                {loading ? "Creating..." : "Create Client"}
              </button>
              <Link href="/clients" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedLayout>
  );
}
