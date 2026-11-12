
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Lead = {
  id: string;
  full_name: string;
  business_name: string | null;
  email: string | null;
  whatsapp: string | null;
  website: string | null;
  location: string | null;
  industry: string | null;
  service_interest: string | null;
  lead_source: string | null;
  status: string;
  sales_notes: string | null;
  outreach_approved: boolean;
  next_follow_up_at: string | null;
  created_at: string;
};

type LeadForm = {
  full_name: string;
  business_name: string;
  email: string;
  whatsapp: string;
  website: string;
  location: string;
  industry: string;
  service_interest: string;
  lead_source: string;
  sales_notes: string;
};

const statuses = [
  "new",
  "researching",
  "awaiting_approval",
  "contacted",
  "interested",
  "negotiating",
  "converted",
  "not_interested",
  "unresponsive",
];

const emptyForm: LeadForm = {
  full_name: "",
  business_name: "",
  email: "",
  whatsapp: "",
  website: "",
  location: "",
  industry: "",
  service_interest: "",
  lead_source: "manual",
  sales_notes: "",
};

function formatStatus(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (letter) =>
    letter.toUpperCase()
  );
}

export default function SalesPage() {
    console.log("SALES PAGE COMPONENT RENDERED");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [form, setForm] = useState<LeadForm>(emptyForm);
  const [message, setMessage] = useState("");

  const [outreachLead, setOutreachLead] = useState<Lead | null>(null);
  const [outreachSubject, setOutreachSubject] = useState("");
  const [outreachMessage, setOutreachMessage] = useState("");
  const [sendingOutreach, setSendingOutreach] = useState(false);

  async function loadLeads() {
    setLoading(true);

    try {
      const response = await fetch("/api/sales-leads");
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Unable to load sales leads.");
        return;
      }

      setLeads(result.leads || []);
    } catch {
      setMessage("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  function prepareOutreach(lead: Lead) {
    if (!lead.email) {
      setMessage("This prospect has no email address.");
      return;
    }

    setOutreachLead(lead);

    setOutreachSubject(
      "Let's grow your brand with GRAPHICOLLINS"
    );

    setOutreachMessage(
      `Hello ${lead.full_name},

I hope you are doing well.

My name is Collins from GRAPHICOLLINS, a creative design and digital solutions studio based in Dar es Salaam, Tanzania.

We would like to explore how we can help ${
        lead.business_name || "your business"
      } build a stronger brand presence.

Our services include graphic design, branding, website development and other creative solutions.

Would you be available for a brief discussion about your project?

We look forward to hearing from you.

Best regards,
Collins
GRAPHICOLLINS
Turning ideas into iconic brands.`
    );

    setMessage("");
  }

  function openAddForm() {
    setEditingLead(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(lead: Lead) {
    setEditingLead(lead);

    setForm({
      full_name: lead.full_name || "",
      business_name: lead.business_name || "",
      email: lead.email || "",
      whatsapp: lead.whatsapp || "",
      website: lead.website || "",
      location: lead.location || "",
      industry: lead.industry || "",
      service_interest: lead.service_interest || "",
      lead_source: lead.lead_source || "manual",
      sales_notes: lead.sales_notes || "",
    });

    setShowForm(true);
    setMessage("");
  }

  async function saveLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.full_name.trim()) {
      setMessage("Prospect name is required.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/sales-leads", {
        method: editingLead ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingLead
            ? { id: editingLead.id, ...form }
            : form
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save lead.");
      }

      const wasEditing = Boolean(editingLead);

      setShowForm(false);
      setEditingLead(null);
      setForm(emptyForm);

      await loadLeads();

      setMessage(
        wasEditing
          ? "Sales lead updated successfully."
          : "New sales lead added successfully."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateLead(
    id: string,
    updates: Record<string, string | boolean | null>
  ) {
    try {
      const response = await fetch("/api/sales-leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...updates }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update lead.");
      }

      setLeads((current) =>
        current.map((lead) =>
          lead.id === id ? result.lead : lead
        )
      );

      setMessage("Sales lead updated successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update lead."
      );
    }
  }

  async function deleteLead(lead: Lead) {
    const confirmed = window.confirm(
      `Permanently delete the sales lead for ${lead.full_name}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/sales-leads", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: lead.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete lead.");
      }

      setLeads((current) =>
        current.filter((item) => item.id !== lead.id)
      );

      setMessage("Sales lead deleted successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete lead."
      );
    }
  }

  async function copyText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`${label} copied successfully.`);
    } catch {
      setMessage("Unable to copy. Please select and copy the text manually.");
    }
  }

  async function openEmailDraft() {
  if (!outreachLead?.email) {
    setMessage("This prospect has no email address.");
    return;
  }

  setSendingOutreach(true);
  setMessage("");

  try {
    // Save the draft in Supabase
    const response = await fetch("/api/sales-emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lead_id: outreachLead.id,
        recipient_email: outreachLead.email,
        subject: outreachSubject,
        email_body: outreachMessage,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to save email draft.");
    }

    setMessage("Email draft saved successfully.");

    // Attempt to open the computer's default email application
    const mailto =
      `mailto:${encodeURIComponent(outreachLead.email)}` +
      `?subject=${encodeURIComponent(outreachSubject)}` +
      `&body=${encodeURIComponent(outreachMessage)}`;

    window.location.href = mailto;

  } catch (error) {
    setMessage(
      error instanceof Error
        ? error.message
        : "Unable to prepare email draft."
    );
  } finally {
    setSendingOutreach(false);
  }
}{
    if (!outreachLead?.email) return;

    const mailto = `mailto:${outreachLead.email}?subject=${encodeURIComponent(
      outreachSubject
    )}&body=${encodeURIComponent(outreachMessage)}`;

    window.location.href = mailto;
  }

  const filteredLeads = leads.filter((lead) => {
    const term = search.toLowerCase();

    const matchesSearch = [
      lead.full_name,
      lead.business_name,
      lead.email,
      lead.industry,
      lead.location,
    ]
      .join(" ")
      .toLowerCase()
      .includes(term);

    const matchesFilter =
      filter === "all" || lead.status === filter;

    return matchesSearch && matchesFilter;
  });

  const count = (status: string) =>
    leads.filter((lead) => lead.status === status).length;

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
              GRAPHICOLLINS SALES DEPARTMENT
            </p>

            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              Sales & Leads
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Discover prospects, manage opportunities and grow your client base.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="rounded-md bg-[#171717] px-6 py-3 text-sm font-medium text-white hover:bg-[#C58A45]"
          >
            + Add New Lead
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
            {message}
          </div>
        )}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Leads", value: leads.length },
            { label: "New Leads", value: count("new") },
            { label: "Interested", value: count("interested") },
            { label: "Converted", value: count("converted") },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <h2 className="mt-2 text-3xl font-semibold">
                {item.value}
              </h2>
            </div>
          ))}
        </section>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 md:p-7">
          <h2 className="mb-5 text-xl font-semibold">
            Sales Pipeline
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "researching",
              "awaiting_approval",
              "contacted",
              "negotiating",
            ].map((status) => (
              <div
                key={status}
                className="rounded-lg bg-[#F5F4F0] p-4"
              >
                <p className="text-xs text-gray-500">
                  {formatStatus(status)}
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {count(status)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-7">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">Prospect Database</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage potential GRAPHICOLLINS customers.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search prospects..."
                className="rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#C58A45]"
              />

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#C58A45]"
              >
                <option value="all">All Leads</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <p className="py-12 text-center text-sm text-gray-500">
              Loading sales leads...
            </p>
          ) : filteredLeads.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl">📊</div>
              <h3 className="mt-4 font-semibold">
                {search || filter !== "all"
                  ? "No matching leads"
                  : "No sales leads yet"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Add your first prospect to start building your sales pipeline.
              </p>

              {!search && filter === "all" && (
                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-5 rounded-md bg-[#C58A45] px-5 py-3 text-sm font-medium text-white hover:bg-[#171717]"
                >
                  Add First Lead
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-3 py-4">Prospect</th>
                    <th className="px-3 py-4">Business</th>
                    <th className="px-3 py-4">Contact</th>
                    <th className="px-3 py-4">Service Interest</th>
                    <th className="px-3 py-4">Sales Status</th>
                    <th className="px-3 py-4">Follow-up</th>
                    <th className="px-3 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-gray-100 hover:bg-[#F5F4F0]/60"
                    >
                      <td className="px-3 py-4 font-medium">
                        {lead.full_name}
                        <p className="mt-1 text-xs text-gray-500">
                          {lead.location || "Location not provided"}
                        </p>
                      </td>

                      <td className="px-3 py-4">
                        {lead.business_name || "—"}
                        <p className="mt-1 text-xs text-gray-500">
                          {lead.industry || ""}
                        </p>
                      </td>

                      <td className="px-3 py-4">
                        {lead.email || "—"}
                        <p className="mt-1 text-xs text-gray-500">
                          {lead.whatsapp || ""}
                        </p>
                      </td>

                      <td className="px-3 py-4">
                        {lead.service_interest || "—"}
                      </td>

                      <td className="px-3 py-4">
                        <select
                          value={lead.status}
                          onChange={(event) =>
                            updateLead(lead.id, {
                              status: event.target.value,
                            })
                          }
                          className="rounded-md border border-gray-200 bg-white px-2 py-2 text-xs"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {formatStatus(status)}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-3 py-4 text-xs text-gray-600">
                        {lead.next_follow_up_at
                          ? new Date(lead.next_follow_up_at).toLocaleString()
                          : "Not scheduled"}
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => openEditForm(lead)}
                            className="font-medium text-[#A36E2F] hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteLead(lead)}
                            className="font-medium text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>

                        {lead.email && (
                          <button
                            type="button"
                            onClick={() => prepareOutreach(lead)}
                            className="mt-2 block text-xs text-blue-700 underline"
                          >
                            Prepare Outreach
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-8 text-center text-xs text-gray-400">
          GRAPHICOLLINS © {new Date().getFullYear()} — Sales Department
        </p>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C58A45]">
                  GRAPHICOLLINS SALES
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {editingLead ? "Edit Sales Lead" : "Add New Lead"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-2xl text-gray-400 hover:text-black"
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveLead} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    label: "Full Name *",
                    field: "full_name",
                    placeholder: "Prospect's full name",
                    required: true,
                  },
                  {
                    label: "Business Name",
                    field: "business_name",
                    placeholder: "Company or brand",
                  },
                  {
                    label: "Email Address",
                    field: "email",
                    placeholder: "prospect@example.com",
                    type: "email",
                  },
                  {
                    label: "WhatsApp Number",
                    field: "whatsapp",
                    placeholder: "+255...",
                  },
                  {
                    label: "Website",
                    field: "website",
                    placeholder: "https://example.com",
                  },
                  {
                    label: "Location",
                    field: "location",
                    placeholder: "City or region",
                  },
                  {
                    label: "Industry",
                    field: "industry",
                    placeholder: "e.g. Hospitality",
                  },
                  {
                    label: "Service Interest",
                    field: "service_interest",
                    placeholder: "e.g. Branding and website",
                  },
                ].map((item) => (
                  <div key={item.field}>
                    <label className="mb-2 block text-sm font-medium">
                      {item.label}
                    </label>

                    <input
                      type={item.type || "text"}
                      required={item.required}
                      value={form[item.field as keyof LeadForm]}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          [item.field]: event.target.value,
                        })
                      }
                      placeholder={item.placeholder}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#C58A45]"
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Lead Source
                  </label>

                  <select
                    value={form.lead_source}
                    onChange={(event) =>
                      setForm({ ...form, lead_source: event.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm"
                  >
                    <option value="manual">Manually Added</option>
                    <option value="website">Website</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="referral">Referral</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Sales Notes
                  </label>

                  <textarea
                    rows={4}
                    value={form.sales_notes}
                    onChange={(event) =>
                      setForm({ ...form, sales_notes: event.target.value })
                    }
                    placeholder="Record prospect information, needs and potential opportunities..."
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#C58A45]"
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
                    : editingLead
                      ? "Update Lead"
                      : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {outreachLead && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C58A45]">
                  GRAPHICOLLINS SALES
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Prepare Outreach Email
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Prepare a professional email for {outreachLead.full_name}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOutreachLead(null)}
                className="text-2xl text-gray-400 hover:text-black"
                aria-label="Close outreach window"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Recipient
                </label>
                <input
                  value={outreachLead.email || ""}
                  readOnly
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Subject
                </label>
                <input
                  value={outreachSubject}
                  onChange={(event) =>
                    setOutreachSubject(event.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#C58A45]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Message
                </label>
                <textarea
                  rows={13}
                  value={outreachMessage}
                  onChange={(event) =>
                    setOutreachMessage(event.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm leading-6 outline-none focus:border-[#C58A45]"
                />
              </div>

              <div className="flex flex-wrap justify-between gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setOutreachLead(null)}
                  className="rounded-md border border-gray-300 px-5 py-3 text-sm hover:bg-gray-100"
                >
                  Close
                </button>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      copyText(outreachSubject, "Email subject")
                    }
                    className="rounded-md border border-gray-300 px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Copy Subject
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      copyText(outreachMessage, "Email message")
                    }
                    className="rounded-md border border-gray-300 px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    Copy Message
                  </button>

                  <button
                    type="button"
                    onClick={openEmailDraft}
                    className="rounded-md bg-[#171717] px-5 py-3 text-sm font-medium text-white hover:bg-[#C58A45]"
                  >
                    Open Email Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
