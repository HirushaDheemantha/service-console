"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

export interface Service {
  nextRenewal: any;
  id: string;
  type: "hosting" | "domain";
  name: string;
  purchasePrice: number;
  renewalPrice: number;
  purchaseDate: string;
  renewalDate: string;
  status: "running" | "inactive";
}

export interface Client {
  driveLink?: string;
  repoLink?: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
}

interface DataContextType {
  services: Service[];
  clients: Client[];
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:4000/services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Failed to load services:", err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch("http://localhost:4000/clients");
      let data = await res.json();
      if (Array.isArray(data)) {
        data = data.map((c, i) => ({
          id: c.id ? String(c.id) : `temp-${i}-${Date.now()}`,
          name: c.name || "",
          email: c.email || "",
          phone: c.phone || "",
          company: c.company || "", // fallback for UI, not sent to backend
          repoLink: c.repoLink || "",
          driveLink: c.driveLink || "",
        }));
      }
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load clients:", err);
      setClients([]);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchClients();
  }, []);

  // ---- Utility to clean payload ----
  const cleanPayload = (data: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(data).filter(
        ([_, v]) => v !== undefined && v !== null && v !== ""
      )
    );
  };

  // ---- SERVICES CRUD ----
  const addService = async (service: Omit<Service, "id">) => {
    try {
      const payload = {
        ...service,
        status: service.status === "running" ? "active" : service.status,
      };
      const res = await fetch("http://localhost:4000/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const newService = await res.json();
      setServices((prev) => [...prev, newService]);
    } catch (err) {
      console.error("Add service failed:", err);
    }
  };

  const updateService = async (
    id: string,
    updatedService: Partial<Service>
  ) => {
    try {
      const payload = {
        ...updatedService,
        status:
          updatedService.status === "running"
            ? "active"
            : updatedService.status,
      };
      const res = await fetch(`http://localhost:4000/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      console.error("Update service failed:", err);
    }
  };

  const deleteService = async (id: string) => {
    try {
      await fetch(`http://localhost:4000/services/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete service failed:", err);
    }
  };

  // ---- CLIENT CRUD ----
  const addClient = async (client: Omit<Client, "id">) => {
    try {
      // Only send fields that exist in backend
      const payload = cleanPayload({
        name: client.name,
        email: client.email,
        phone: client.phone,
        repoLink: client.repoLink || "",
        driveLink: client.driveLink || "",
      });
      const res = await fetch("http://localhost:4000/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let newClient = await res.json();
      // Normalize for frontend
      newClient = {
        id: newClient.id ? String(newClient.id) : `temp-${Date.now()}`,
        name: newClient.name || "",
        email: newClient.email || "",
        phone: newClient.phone || "",
        company: newClient.company || "",
        repoLink: newClient.repoLink || "",
        driveLink: newClient.driveLink || "",
      };
      setClients((prev) => [...prev, newClient]);
    } catch (err) {
      console.error("Add client failed:", err);
    }
  };

  const updateClient = async (id: string, updatedClient: Partial<Client>) => {
    try {
      // Only send fields that exist in backend
      const payload = cleanPayload({
        name: updatedClient.name,
        email: updatedClient.email,
        phone: updatedClient.phone,
        repoLink: updatedClient.repoLink || "",
        driveLink: updatedClient.driveLink || "",
      });
      const res = await fetch(`http://localhost:4000/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let updated = await res.json();
      // Normalize for frontend
      updated = {
        id: updated.id ? String(updated.id) : id,
        name: updated.name || "",
        email: updated.email || "",
        phone: updated.phone || "",
        company: updated.company || "",
        repoLink: updated.repoLink || "",
        driveLink: updated.driveLink || "",
      };
      setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error("Update client failed:", err);
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await fetch(`http://localhost:4000/clients/${id}`, { method: "DELETE" });
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete client failed:", err);
    }
  };

  return (
    <DataContext.Provider
      value={{
        services,
        clients,
        addService,
        updateService,
        deleteService,
        addClient,
        updateClient,
        deleteClient,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
