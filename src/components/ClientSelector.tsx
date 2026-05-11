"use client";

import { useState, useEffect } from "react";
import { Client } from "@/types/index";
import { Search, Plus, X } from "lucide-react";

interface ClientSelectorProps {
  onSelect: (client: Client | { fullname: string; phoneNumber: string }) => void;
  onClientChange?: (client: any) => void;
  placeholder?: string;
}

export default function ClientSelector({
  onSelect,
  onClientChange,
  placeholder = "Search or create client...",
}: ClientSelectorProps) {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newClient, setNewClient] = useState({ fullname: "", phoneNumber: "" });

  useEffect(() => {
    if (search.length > 0) {
      fetchClients();
    }
  }, [search]);

  const fetchClients = async () => {
    try {
      const response = await fetch(`/api/clients?search=${search}`);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };

  const handleSelectClient = (client: Client) => {
    onSelect(client);
    onClientChange?.(client);
    setSearch("");
    setIsOpen(false);
  };

  const handleCreateClient = () => {
    if (!newClient.fullname || !newClient.phoneNumber) {
      alert("Please fill in all fields");
      return;
    }
    onSelect(newClient);
    onClientChange?.(newClient);
    setNewClient({ fullname: "", phoneNumber: "" });
    setIsCreating(false);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="input-field pl-10"
          />
        </div>
        {isCreating && (
          <button
            onClick={() => setIsCreating(false)}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
          >
            <X size={20} />
          </button>
        )}
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
            title="Create new client"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      {isOpen && search.length > 0 && !isCreating && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg border border-gray-200 shadow-lg p-2">
          {clients.length > 0 ? (
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleSelectClient(client)}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded border-b last:border-b-0"
                >
                  <div className="font-semibold">{client.fullname}</div>
                  <div className="text-sm text-gray-600">{client.phoneNumber}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 text-sm text-gray-600 text-center">
              No clients found. Click + to create new.
            </div>
          )}
        </div>
      )}

      {isCreating && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg border border-gray-200 shadow-lg p-4 space-y-3">
          <h3 className="font-semibold text-sm">Create New Client</h3>
          <input
            type="text"
            placeholder="Full Name"
            value={newClient.fullname}
            onChange={(e) =>
              setNewClient({ ...newClient, fullname: e.target.value })
            }
            className="input-field text-sm"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={newClient.phoneNumber}
            onChange={(e) =>
              setNewClient({ ...newClient, phoneNumber: e.target.value })
            }
            className="input-field text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateClient}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded font-semibold text-sm hover:bg-blue-700"
            >
              Create
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="flex-1 bg-gray-200 text-gray-800 px-3 py-2 rounded font-semibold text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
