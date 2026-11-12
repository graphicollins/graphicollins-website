
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

 const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#111111] px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-10 rounded-xl"
      >
        <h1 className="text-3xl font-bold text-black">
          GRAPHICOLLINS
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Admin Dashboard Login
        </p>

        <label className="block text-sm font-medium mb-2">
          Email Address
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-3 rounded mb-5"
          placeholder="Admin email"
        />

        <label className="block text-sm font-medium mb-2">
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-3 rounded mb-5"
          placeholder="Your password"
        />

        {error && (
          <p className="text-red-600 text-sm mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded font-semibold hover:bg-[#C58A45] disabled:opacity-50"
        >
          {loading ? "Signing in..." : "SIGN IN"}
        </button>
      </form>
    </main>
  );
}
