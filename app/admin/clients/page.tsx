
"use client";

import { useEffect, useState } from "react";

type Client = {
  id: string;
  full_name: string;
  business_name: string | null;
  email: string | null;
  whatsapp: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
};

const emptyForm = {
  full_name: "",
  business_name: "",
  email: "",
  whatsapp: "",
  location: "",
  notes: "",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadClients() {
    setLoading(true);

    try {
      const response = await fetch("/api/clients");
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Unable to load clients.");
        return;
      }

      setClients(result.clients || []);
    } catch {
      setMessage("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  function openAddForm() {
    setEditingClient(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(client: Client) {
    setEditingClient(client);
    setForm({
      full_name: client.full_name || "",
      business_name: client.business_name || "",
      email: client.email || "",
      whatsapp: client.whatsapp || "",
      location: client.location || "",
      notes: client.notes || "",
    });
    setShowForm(true);
    setMessage("");
  }

  async function saveClient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.full_name.trim()) {
      setMessage("Please enter the client's name.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/clients", {
        method: editingClient ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingClient
            ? { id: editingClient.id, ...form }
            : form
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Unable to save client.");
        return;
      }

      setShowForm(false);
      setEditingClient(null);
      setForm(emptyForm);
      setMessage(
        editingClient
          ? "Client updated successfully."
          : "Client added successfully."
      );

      await loadClients();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteClient(client: Client) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${client.full_name}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: client.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Unable to delete client.");
        return;
      }

      setMessage("Client deleted successfully.");
      await loadClients();
    } catch {
      setMessage("Could not delete client. Please try again.");
    }
  }

  const filteredClients = clients.filter((client) =>
    [
      client.full_name,
      client.business_name,
      client.email,
      client.whatsapp,
      client.location,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F5F4F0] text-[#171717]">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <a
              href="/admin/dashboard"
              className="mb-4 inline-block text-sm text-gray-500 hover:text-[#C58A45]"
            >
              ← Back to Dashboard
            </a>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C58A45]">
              GRAPHICOLLINS ADMIN
            </p>

            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              Client Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your clients and business relationships.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-md bg-[#171717] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#C58A45]"
          >
            + Add New Client
          </button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Total Clients</p>
            <h2 className="mt-2 text-3xl font-semibold">
              {clients.length}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Registered Clients</p>
            <h2 className="mt-2 text-3xl font-semibold">
              {clients.length}
            </h2>
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
            {message}
          </div>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-7">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">All Clients</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your registered client records.
              </p>
            </div>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#C58A45] md:max-w-xs"
            />
          </div>

          {loading ? (
            <p className="py-12 text-center text-sm text-gray-500">
              Loading clients...
            </p>
          ) : filteredClients.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl">👥</div>
              <h3 className="mt-4 font-semibold">
                {search ? "No matching clients" : "No clients yet"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? "Try another search term."
                  : "Add your first client to get started."}
              </p>
              {!search && (
                <button
                  onClick={openAddForm}
                  className="mt-5 rounded-md bg-[#C58A45] px-5 py-3 text-sm font-medium text-white hover:bg-[#171717]"
                >
                  Add First Client
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-3 py-4">Client</th>
                    <th className="px-3 py-4">Business</th>
                    <th className="px-3 py-4">Contact</th>
                    <th className="px-3 py-4">Location</th>
                    <th className="px-3 py-4">Date Added</th>
                    <th className="px-3 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b border-gray-100 hover:bg-[#F5F4F0]/60"
                    >
                      <td className="px-3 py-4 font-medium">
                        {client.full_name}
                      </td>

                      <td className="px-3 py-4 text-gray-600">
                        {client.business_name || "—"}
                      </td>

                      <td className="px-3 py-4">
                        <div>{client.email || "—"}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {client.whatsapp || ""}
                        </div>
                      </td>

                      <td className="px-3 py-4 text-gray-600">
                        {client.location || "—"}
                      </td>

                      <td className="px-3 py-4 text-gray-600">
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEditForm(client)}
                            className="font-medium text-[#A36E2F] hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteClient(client)}
                            className="font-medium text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>

                        {client.whatsapp && (
                          <a
                            href={`https://wa.me/${client.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block text-xs text-green-700 hover:underline"
                          >
                            WhatsApp
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div className="my-8 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C58A45]">
                    GRAPHICOLLINS
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {editingClient ? "Edit Client" : "Add New Client"}
                  </h2>
                </div>

                <button
                  onClick={() => setShowForm(false)}
                  className="text-2xl text-gray-400 hover:text-black"
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>

              <form onSubmit={saveClient} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Full Name *
                    </label>
                    <input
                      required
                      value={form.full_name}
                      onChange={(e) =>
                        setForm({ ...form, full_name: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#C58A45]"
                      placeholder="Client full name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Business Name
                    </label>
                    <input
                      value={form.business_name}
                      onChange={(e) =>
                        setForm({ ...form, business_name: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#C58A45]"
                      placeholder="Company or brand"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#C58A45]"
                      placeholder="client@example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      WhatsApp Number
                    </label>
                    <input
                      value={form.whatsapp}
                      onChange={(e) =>
                        setForm({ ...form, whatsapp: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#C58A45]"
                      placeholder="+255..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                      Location
                    </label>
                    <input
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#C58A45]"
                      placeholder="City or region"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                      Notes
                    </label>
                    <textarea
                      rows={4}
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#C58A45]"
                      placeholder="Additional client information..."
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-md border border-gray-300 px-5 py-3 text-sm hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-md bg-[#171717] px-6 py-3 text-sm font-medium text-white hover:bg-[#C58A45] disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingClient
                        ? "Update Client"
                        : "Save Client"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
