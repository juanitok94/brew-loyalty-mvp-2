"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function formatDisplay(digits: string) {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(formatDisplay(raw));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit US phone number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stamps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: digits }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push(`/card?phone=${encodeURIComponent(digits)}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo / Header */}
        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl mb-4"
            style={{ background: "var(--brown)", color: "#fff" }}
          >
            ☕
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--brown-dark)" }}>
            Odds Cafe
          </h1>
          <p className="text-base" style={{ color: "var(--brown-light)" }}>
            West Asheville&apos;s favorite cup
          </p>
        </div>

        {/* Card Teaser */}
        <div
          className="rounded-2xl p-6 text-center space-y-1"
          style={{ background: "var(--cream)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--brown-light)" }}>
            Buy 8 coffees
          </p>
          <p className="text-2xl font-bold" style={{ color: "var(--brown-dark)" }}>
            Get 1 FREE
          </p>
          <p className="text-xs" style={{ color: "var(--brown-light)" }}>
            No app download needed
          </p>
        </div>

        {/* Phone Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Enter your phone number to see your card
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="(828) 555-0123"
              value={phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border text-base outline-none transition-all"
              style={{
                borderColor: error ? "#dc2626" : "var(--stamp-empty)",
                background: "#fff",
                color: "var(--foreground)",
              }}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white text-base transition-opacity disabled:opacity-60"
            style={{ background: "var(--brown)" }}
          >
            {loading ? "Loading..." : "See My Card"}
          </button>
        </form>
      </div>
    </main>
  );
}
