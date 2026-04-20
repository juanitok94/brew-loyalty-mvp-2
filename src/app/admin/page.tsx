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
      // 404 = valid password, customer not found — that's fine
      sessionStorage.setItem("adminPw", password);
      router.push(`/admin/customer${window.location.search}`);
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {/* Black header */}
      <header
        style={{
          background: "#000000",
          padding: "28px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <img
          src="/rowan-logo.png"
          alt="Rowan Coffee"
          style={{ width: 72, height: 72, objectFit: "contain" }}
        />
        <h1 className="font-display text-2xl" style={{ color: "#E8D9B0" }}>
          Rowan Coffee
        </h1>
        <p className="text-sm" style={{ color: "rgba(232,217,176,0.55)" }}>
          Staff access only
        </p>
      </header>

      {/* Login form */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
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
              {loading ? "Checking..." : "Enter dashboard"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
