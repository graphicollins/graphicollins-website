
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProjectInquiry() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/project-inquiry", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Submission failed.");
      }

      setMessage("Your project inquiry has been submitted successfully.");
      form.reset();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    "w-full border border-gray-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-[#C58A45]";

  const labelStyle =
    "mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-gray-700";

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#171717]">

      {/* HEADER */}
      <header className="border-b border-gray-200 px-6 py-6 md:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            GRAPHICOLLINS<span className="text-[#C58A45]">.</span>
          </Link>

          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-gray-600 hover:text-[#C58A45]"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* INTRODUCTION */}
      <section className="px-6 pb-12 pt-20 md:px-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#C58A45]">
            Start Something Meaningful
          </p>

          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            Let's create
            <span className="font-serif italic text-[#C58A45]">
              {" "}something iconic.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
            Tell us about your vision, your business and what you want to
            achieve. Complete the project inquiry form below and our
            creative team will get back to you.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="px-6 pb-24 md:px-16">
        <div className="mx-auto max-w-4xl border border-gray-200 bg-white p-6 md:p-12">

          <form onSubmit={handleSubmit} className="space-y-12">

            {/* SECTION 01 */}
            <div>
              <p className="mb-7 text-xs font-bold tracking-[0.2em] text-[#C58A45]">
                01 / CLIENT INFORMATION
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className={labelStyle}>Full Name *</label>
                  <input
                    name="full_name"
                    type="text"
                    placeholder="Your full name"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className={labelStyle}>Business / Company</label>
                  <input
                    name="business_name"
                    type="text"
                    placeholder="Your business name"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className={labelStyle}>WhatsApp Number *</label>
                  <input
                    name="whatsapp"
                    type="tel"
                    placeholder="+255..."
                    className={inputStyle}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelStyle}>Location</label>
                  <input
                    name="location"
                    type="text"
                    placeholder="City, Country"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 02 */}
            <div>
              <p className="mb-7 text-xs font-bold tracking-[0.2em] text-[#C58A45]">
                02 / PROJECT DETAILS
              </p>

              <div className="space-y-6">
                <div>
                  <label className={labelStyle}>Project Name *</label>
                  <input
                    name="projectName"
                    type="text"
                    placeholder="What is your project called?"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className={labelStyle}>What service do you need? *</label>
                  <select
                    name="service"
                    className={inputStyle}
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>Select a service</option>
                    <option>Brand Identity Design</option>
                    <option>Logo Design</option>
                    <option>Packaging Design</option>
                    <option>Print & Advertising Design</option>
                    <option>Social Media Design</option>
                    <option>Website Design & Development</option>
                    <option>UI/UX Design</option>
                    <option>Brand Strategy</option>
                    <option>Complete Branding Package</option>
                    <option>Other / Multiple Services</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Tell us about your project *</label>
                  <textarea
                    name="description"
                    rows={6}
                    placeholder="Describe your business, your vision, your goals and what you expect us to create..."
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className={labelStyle}>Who is your target audience?</label>
                  <input
                    name="audience"
                    type="text"
                    placeholder="e.g. Young professionals, businesses, families..."
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Preferred design style</label>
                  <select
                    name="style"
                    className={inputStyle}
                    defaultValue=""
                  >
                    <option value="" disabled>Select your preferred style</option>
                    <option>Minimalist & Modern</option>
                    <option>Luxury & Premium</option>
                    <option>Bold & Creative</option>
                    <option>Elegant & Sophisticated</option>
                    <option>Corporate & Professional</option>
                    <option>Vintage & Classic</option>
                    <option>Not Sure — Recommend a Style</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Preferred Colours</label>
                  <input
                    name="colors"
                    type="text"
                    placeholder="e.g. Black, gold, white..."
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className={labelStyle}>Reference / Inspiration Link</label>
                  <input
                    name="reference"
                    type="url"
                    placeholder="Paste a Pinterest, Behance or website link"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 03 */}
            <div>
              <p className="mb-7 text-xs font-bold tracking-[0.2em] text-[#C58A45]">
                03 / BUDGET & TIMELINE
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className={labelStyle}>Estimated Budget (TZS) *</label>
                  <select
                    name="budget"
                    className={inputStyle}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>Select your budget</option>
                    <option>Below TZS 100,000</option>
                    <option>TZS 100,000 – 300,000</option>
                    <option>TZS 300,000 – 500,000</option>
                    <option>TZS 500,000 – 1,000,000</option>
                    <option>TZS 1,000,000 – 3,000,000</option>
                    <option>Above TZS 3,000,000</option>
                    <option>Open to quotation</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Expected Completion *</label>
                  <select
                    name="timeline"
                    className={inputStyle}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>Select a timeline</option>
                    <option>As soon as possible</option>
                    <option>Within 1 week</option>
                    <option>Within 2 weeks</option>
                    <option>Within 1 month</option>
                    <option>Within 2–3 months</option>
                    <option>Flexible timeline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 04 */}
            <div>
              <p className="mb-7 text-xs font-bold tracking-[0.2em] text-[#C58A45]">
                04 / ADDITIONAL INFORMATION
              </p>

              <div>
                <label className={labelStyle}>
                  Anything else we should know?
                </label>
                <textarea
                  name="additional"
                  rows={4}
                  placeholder="Additional requirements, special instructions or expectations..."
                  className={inputStyle}
                />
              </div>
            </div>

            {/* CONSENT */}
            <div className="border-t border-gray-200 pt-8">
              <label className="flex items-start gap-3 text-sm leading-6 text-gray-600">
                <input
                  type="checkbox"
                  name="consent"
                  value="yes"
                  required
                  className="mt-1 accent-[#C58A45]"
                />
                I confirm that the information provided is accurate
                and agree to be contacted regarding this project.
              </label>
            </div>

            {/* SUBMIT */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C58A45] px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Submitting Inquiry..." : "Submit Project Inquiry →"}
              </button>

              {message && (
                <p
                  aria-live="polite"
                  className="mt-5 text-center text-sm text-gray-700"
                >
                  {message}
                </p>
              )}

              <p className="mt-6 text-center text-xs leading-6 text-gray-500">
                Thank you for considering GRAPHICOLLINS.
                <br />
                Turning ideas into iconic brands.
              </p>
            </div>

          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 px-6 py-8 text-center">
        <p className="text-xs tracking-widest text-gray-500">
          © 2026 GRAPHICOLLINS. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
