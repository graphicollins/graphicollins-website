
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Inquiry = {
  id: string;
  full_name: string;
  business_name: string | null;
  email: string;
  whatsapp: string | null;
  location: string | null;
  service: string | null;
  project_description: string | null;
  budget: string | null;
  timeline: string | null;
  additional_info: string | null;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [adminEmail, setAdminEmail] = useState("");
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [selectedInquiry, setSelectedInquiry] =
    useState<Inquiry | null>(null);

  // LOAD CUSTOMER INQUIRIES
  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      setAdminEmail(user.email || "");

      const response = await fetch(
        "/api/admin/project-inquiries",
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to load project inquiries."
        );
      }

      setInquiries(result.inquiries || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
  setCurrentYear(new Date().getFullYear());
  loadInquiries();
}, [loadInquiries]);

  // LOG OUT ADMINISTRATOR
  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  // UPDATE INQUIRY STATUS
  async function updateInquiryStatus(
    id: string,
    status: string
  ) {
    try {
      const response = await fetch(
        "/api/admin/project-inquiries",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to update status."
        );
      }

      setInquiries((current) =>
        current.map((inquiry) =>
          inquiry.id === id
            ? { ...inquiry, status }
            : inquiry
        )
      );

      setSelectedInquiry((current) =>
        current && current.id === id
          ? { ...current, status }
          : current
      );

      alert("Inquiry status updated successfully.");
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Unable to update inquiry status."
      );
    }
  }

  // DELETE CUSTOMER INQUIRY
  async function deleteInquiry(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this customer inquiry? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        "/api/admin/project-inquiries",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to delete inquiry."
        );
      }

      setInquiries((current) =>
        current.filter((inquiry) => inquiry.id !== id)
      );

      setSelectedInquiry(null);

      alert("Customer inquiry deleted successfully.");
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting."
      );
    }
  }

  // DASHBOARD STATISTICS
  const newCount = inquiries.filter(
    (inquiry) => inquiry.status === "new"
  ).length;

  const progressCount = inquiries.filter(
    (inquiry) => inquiry.status === "in_progress"
  ).length;

  const completedCount = inquiries.filter(
    (inquiry) => inquiry.status === "completed"
  ).length;

  const cancelledCount = inquiries.filter(
    (inquiry) => inquiry.status === "cancelled"
  ).length;

  // SEARCH AND FILTER
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        inquiry.full_name?.toLowerCase().includes(searchTerm) ||
        inquiry.email?.toLowerCase().includes(searchTerm) ||
        inquiry.business_name?.toLowerCase().includes(searchTerm);

      const matchesFilter =
        filter === "all" || inquiry.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [inquiries, search, filter]);

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#171717] md:flex">

      {/* SIDEBAR */}
      <aside className="w-full bg-[#171717] p-6 text-white md:min-h-screen md:w-64 md:shrink-0">

        <h1 className="text-2xl font-bold tracking-widest">
          GRAPHIC
          <span className="text-[#C58A45]">OLLINS</span>
        </h1>

        <p className="mt-2 text-xs text-gray-400">
          ADMINISTRATION PANEL
        </p>

        <div className="mt-10 space-y-3">

          <button
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="w-full rounded-lg bg-[#C58A45] px-4 py-3 text-left font-medium text-black hover:bg-[#b77b37]"
          >
            Overview
          </button>

          <button
            onClick={() => {
              document
                .getElementById("project-inquiries")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
            className="w-full rounded-lg px-4 py-3 text-left text-gray-300 hover:bg-white/10 hover:text-white"
          >
            Project Inquiries
          </button>

        </div>

        <div className="mt-10 border-t border-gray-700 pt-6">

          <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
            Account
          </p>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-gray-600 px-4 py-3 text-left text-sm hover:bg-white/10"
          >
            Sign Out
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 p-6 md:p-10">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>
            <p className="text-sm font-medium tracking-widest text-[#C58A45]">
              WORKSPACE OVERVIEW
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Admin Dashboard
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Welcome back, {adminEmail}
            </p>
          </div>

          <button
            onClick={loadInquiries}
            disabled={loading}
            className="rounded-lg bg-[#171717] px-5 py-3 text-sm font-medium text-white hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>

        </div>

        {/* STATISTICS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {[
            {
              label: "Total Inquiries",
              value: inquiries.length,
            },
            {
              label: "New Inquiries",
              value: newCount,
            },
            {
              label: "In Progress",
              value: progressCount,
            },
            {
              label: "Completed",
              value: completedCount,
            },
          ].map((stat) => (

            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >

              <p className="text-sm text-gray-500">
                {stat.label}
              </p>

              <p className="mt-3 text-3xl font-bold">
                {stat.value}
              </p>

              <div className="mt-4 h-1 w-12 rounded bg-[#C58A45]" />

            </div>

          ))}

        </div>

        {/* ADDITIONAL STATUS SUMMARY */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              Cancelled Inquiries
            </p>

            <p className="mt-2 text-2xl font-bold">
              {cancelledCount}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              Awaiting Review
            </p>

            <p className="mt-2 text-2xl font-bold">
              {newCount}
            </p>
          </div>

        </div>

        {/* PROJECT INQUIRIES */}
        <section
          id="project-inquiries"
          className="mt-10 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>
              <h3 className="text-xl font-bold">
                Project Inquiries
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Customer requests submitted through your website.
              </p>
            </div>

            <span className="rounded-full bg-[#F5F4F0] px-4 py-2 text-sm">
              {filteredInquiries.length} Records
            </span>

          </div>

          {/* SEARCH AND FILTER */}
          <div className="mt-6 flex flex-col gap-3 md:flex-row">

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email or business..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#C58A45]"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#C58A45]"
            >
              <option value="all">All Inquiries</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

          </div>

          {/* LOADING / ERROR / TABLE */}
          {loading ? (

            <p className="py-12 text-center text-gray-500">
              Loading project inquiries...
            </p>

          ) : error ? (

            <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>

          ) : filteredInquiries.length === 0 ? (

            <p className="py-12 text-center text-gray-500">
              No project inquiries found.
            </p>

          ) : (

            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[750px] text-left text-sm">

                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="px-3 py-4">CLIENT</th>
                    <th className="px-3 py-4">SERVICE</th>
                    <th className="px-3 py-4">EMAIL</th>
                    <th className="px-3 py-4">STATUS</th>
                    <th className="px-3 py-4">DATE</th>
                    <th className="px-3 py-4">ACTION</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredInquiries.map((inquiry) => (

                    <tr
                      key={inquiry.id}
                      className="border-b border-gray-100 hover:bg-[#F5F4F0]"
                    >

                      <td className="px-3 py-4">

                        <p className="font-semibold">
                          {inquiry.full_name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {inquiry.business_name || "Individual client"}
                        </p>

                      </td>

                      <td className="px-3 py-4">
                        {inquiry.service || "Not specified"}
                      </td>

                      <td className="px-3 py-4">
                        {inquiry.email}
                      </td>

                      <td className="px-3 py-4">

                        <span className="rounded-full bg-[#F5F4F0] px-3 py-1 text-xs font-medium">
                          {inquiry.status.replace("_", " ")}
                        </span>

                      </td>

                      <td className="px-3 py-4">
                        {new Date(
                          inquiry.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-3 py-4">

                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="rounded-lg bg-[#171717] px-4 py-2 text-xs font-medium text-white hover:bg-[#C58A45]"
                        >
                          View Details
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* FOOTER */}
        <p className="mt-8 text-center text-xs text-gray-400">
          GRAPHICOLLINS © {currentYear ?? "2026"} — Admin Panel
        </p>

      </main>

      {/* INQUIRY DETAILS MODAL */}
      {selectedInquiry && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedInquiry(null);
            }
          }}
        >

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#171717] p-6 text-white">

              <div>
                <p className="text-xs tracking-widest text-[#C58A45]">
                  GRAPHICOLLINS
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Inquiry Details
                </h2>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="rounded-lg px-3 py-2 text-xl hover:bg-white/10"
                aria-label="Close inquiry details"
              >
                &times;
              </button>

            </div>

            {/* INQUIRY INFORMATION */}
            <div className="grid gap-6 p-6 sm:grid-cols-2">

              <div>
                <p className="text-xs text-gray-500">CLIENT NAME</p>
                <p className="mt-1 font-semibold">
                  {selectedInquiry.full_name || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">BUSINESS NAME</p>
                <p className="mt-1 font-semibold">
                  {selectedInquiry.business_name || "Individual client"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">EMAIL ADDRESS</p>
                <p className="mt-1 break-all font-semibold">
                  {selectedInquiry.email || "Not provided"}
                </p>
              </div>

              {/* WHATSAPP */}
              <div>

                <p className="text-xs text-gray-500">
                  WHATSAPP / PHONE
                </p>

                <p className="mt-1 font-semibold">
                  {selectedInquiry.whatsapp || "Not provided"}
                </p>

                {selectedInquiry.whatsapp && (

                  <a
                    href={`https://wa.me/${selectedInquiry.whatsapp.replace(
                      /\D/g,
                      ""
                    )}?text=${encodeURIComponent(
                      `Hello ${selectedInquiry.full_name}, thank you for contacting GRAPHICOLLINS. We have received your inquiry about ${
                        selectedInquiry.service || "your project"
                      }. We would like to discuss your project further.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1DA851]"
                  >
                    WhatsApp Customer
                  </a>

                )}

              </div>

              <div>
                <p className="text-xs text-gray-500">LOCATION</p>
                <p className="mt-1 font-semibold">
                  {selectedInquiry.location || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">REQUESTED SERVICE</p>
                <p className="mt-1 font-semibold">
                  {selectedInquiry.service || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">PROJECT BUDGET</p>
                <p className="mt-1 font-semibold">
                  {selectedInquiry.budget || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">PROJECT TIMELINE</p>
                <p className="mt-1 font-semibold">
                  {selectedInquiry.timeline || "Not provided"}
                </p>
              </div>

              <div className="sm:col-span-2">

                <p className="text-xs text-gray-500">
                  PROJECT DESCRIPTION
                </p>

                <p className="mt-2 whitespace-pre-wrap rounded-lg bg-[#F5F4F0] p-4 text-sm leading-7">
                  {selectedInquiry.project_description ||
                    "No description provided."}
                </p>

              </div>

              <div className="sm:col-span-2">

                <p className="text-xs text-gray-500">
                  ADDITIONAL INFORMATION
                </p>

                <p className="mt-2 whitespace-pre-wrap rounded-lg bg-[#F5F4F0] p-4 text-sm leading-7">
                  {selectedInquiry.additional_info ||
                    "No additional information."}
                </p>

              </div>

              {/* UPDATE STATUS */}
              <div>

                <p className="text-xs text-gray-500">
                  UPDATE INQUIRY STATUS
                </p>

                <select
                  value={selectedInquiry.status}
                  onChange={(event) =>
                    updateInquiryStatus(
                      selectedInquiry.id,
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#C58A45]"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

              </div>

              {/* SUBMISSION DATE */}
              <div>

                <p className="text-xs text-gray-500">
                  SUBMISSION DATE
                </p>

                <p className="mt-1 font-semibold">
                  {selectedInquiry.created_at
                    ? new Date(
                        selectedInquiry.created_at
                      ).toLocaleString()
                    : "Not available"}
                </p>

              </div>

            </div>

            {/* MODAL ACTIONS */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 p-6">

              <button
                onClick={() => deleteInquiry(selectedInquiry.id)}
                className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete Inquiry
              </button>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="rounded-lg bg-[#C58A45] px-6 py-3 text-sm font-semibold text-black hover:bg-[#b77b37]"
              >
                Close Details
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
