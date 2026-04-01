"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setError("Password required.");
      return;
    }
    setLoading(true);
    // Verify password by trying a lookup with a known test
    try {
      const res = await fetch("/api/admin/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "0000000000", password }),
      });
      if (res.status === 401) {
        setError("Wrong password.");
        setLoading(false);
        return;
      }
      // 404 means password was valid but customer not found — that's fine
      sessionStorage.setItem("adminPw", password);
      router.push("/admin/customer");
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl mb-3"
            style={{ background: "var(--brown)", color: "#fff" }}
          >
            🔑
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--brown-dark)" }}>
            Odds Cafe Admin
          </h1>
          <p className="text-sm" style={{ color: "var(--brown-light)" }}>
            Staff access only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full px-4 py-3 rounded-xl border text-base outline-none"
              style={{
                borderColor: error ? "#dc2626" : "var(--stamp-empty)",
                background: "#fff",
                color: "var(--foreground)",
              }}
              autoFocus
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white text-base disabled:opacity-60"
            style={{ background: "var(--brown)" }}
          >
            {loading ? "Checking..." : "Enter Dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}
