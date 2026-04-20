"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QRCode from "qrcode";
import { STAMPS_REQUIRED } from "@/lib/constants";

type CustomerData = {
  phone: string;
  stamps: number;
  lastVisit: string;
  redeemed: number;
};

const TOTAL = STAMPS_REQUIRED;

function StampCircle({ filled, index }: { filled: boolean; index: number }) {
  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
        filled ? "stamp-pop" : ""
      }`}
      style={{
        background: filled ? "var(--stamp-filled)" : "var(--stamp-empty)",
        color: filled ? "#fff" : "var(--brown-light)",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {filled ? "☕" : ""}
    </div>
  );
}

function CardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawPhone = searchParams.get("phone") ?? "";

  const [data, setData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrCodeSrc, setQrCodeSrc] = useState("");

  async function loadCard(phone: string) {
    const response = await fetch(`/api/stamps?phone=${encodeURIComponent(phone)}`, {
      cache: "no-store",
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.error ?? "Failed to load card");
    }

    setData(payload);
    setError("");
  }

  useEffect(() => {
    if (!rawPhone) {
      router.replace("/");
      return;
    }

    let cancelled = false;

    const refreshCard = async () => {
      try {
        await loadCard(rawPhone);
        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) {
          setError("Could not load your card. Please try again.");
          setLoading(false);
        }
      }
    };

    void refreshCard();
    const intervalId = window.setInterval(() => { void refreshCard(); }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [rawPhone, router]);

  const [qrInitialized, setQrInitialized] = useState(false);

  useEffect(() => {
    if (!data?.phone || qrInitialized) return;

    const qrTarget = new URL("/admin/customer", window.location.origin);
    qrTarget.searchParams.set("phone", data.phone);

    QRCode.toDataURL(qrTarget.toString(), {
      margin: 1,
      width: 192,
      color: { dark: "#7B5A2A", light: "#FFFFFF" },
    })
      .then((src) => { setQrCodeSrc(src); setQrInitialized(true); })
      .catch(() => setQrCodeSrc(""));
  }, [data?.phone, qrInitialized]);

  const isReady = data ? data.stamps >= TOTAL : false;
  const displayPhone = data
    ? data.phone.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3")
    : rawPhone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

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
        {displayPhone && (
          <p className="text-sm" style={{ color: "rgba(232,217,176,0.55)" }}>
            {displayPhone}
          </p>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1 flex flex-col items-center px-6 py-8">
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <p style={{ color: "var(--brown-light)" }}>Loading your card...</p>
          </div>
        )}

        {!loading && (error || !data) && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-red-600">{error || "No data found."}</p>
            <button
              onClick={() => router.push("/")}
              className="text-sm underline"
              style={{ color: "var(--brown)" }}
            >
              Go back
            </button>
          </div>
        )}

        {!loading && data && (
          <div className="w-full max-w-sm space-y-6">
            {/* Reward Banner */}
            {isReady ? (
              <div
                className="rounded-2xl p-5 text-center space-y-2 celebrate"
                style={{ background: "var(--brown)", color: "#fff" }}
              >
                <div className="text-4xl">🎉</div>
                <p className="text-xl font-semibold">Free drink ready!</p>
                <p className="text-sm opacity-90">Show this to your barista to redeem</p>
              </div>
            ) : (
              <div
                className="rounded-2xl p-4 text-center"
                style={{ background: "var(--cream)" }}
              >
                <p className="text-sm font-medium" style={{ color: "var(--brown-dark)" }}>
                  {TOTAL - data.stamps} more {TOTAL - data.stamps === 1 ? "drink" : "drinks"} until
                  your free drink
                </p>
              </div>
            )}

            {/* Stamp Grid */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: isReady ? "#FFF9F0" : "#fff",
                border: "1.5px solid var(--stamp-empty)",
              }}
            >
              <div className="grid grid-cols-3 gap-3 justify-items-center">
                {Array.from({ length: TOTAL }).map((_, i) => (
                  <StampCircle key={i} filled={i < data.stamps} index={i} />
                ))}
              </div>
              <p className="text-center text-xs mt-4" style={{ color: "var(--brown-light)" }}>
                {data.stamps} / {TOTAL} stamps
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              <div
                className="flex-1 rounded-xl p-3 text-center"
                style={{ background: "var(--cream)" }}
              >
                <p className="text-xl font-semibold" style={{ color: "var(--brown)" }}>
                  {data.stamps}
                </p>
                <p className="text-xs" style={{ color: "var(--brown-light)" }}>
                  current stamps
                </p>
              </div>
              <div
                className="flex-1 rounded-xl p-3 text-center"
                style={{ background: "var(--cream)" }}
              >
                <p className="text-xl font-semibold" style={{ color: "var(--brown)" }}>
                  {data.redeemed}
                </p>
                <p className="text-xs" style={{ color: "var(--brown-light)" }}>
                  free drinks earned
                </p>
              </div>
            </div>

            <p className="text-center text-xs" style={{ color: "var(--stamp-empty)" }}>
              Last visit: {data.lastVisit}
            </p>

            {qrCodeSrc && (
              <div
                className="rounded-2xl p-5 text-center space-y-3"
                style={{ background: "#fff", border: "1.5px solid var(--stamp-empty)" }}
              >
                <img
                  src={qrCodeSrc}
                  alt={`QR code for ${data.phone}`}
                  className="mx-auto rounded-xl"
                  width={192}
                  height={192}
                />
                <p className="text-sm font-medium" style={{ color: "var(--brown-light)" }}>
                  Show this at the counter
                </p>
              </div>
            )}

            <button
              onClick={() => router.push("/")}
              className="w-full text-sm underline"
              style={{ color: "var(--brown-light)" }}
            >
              ← Back
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
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
          </header>
          <div className="flex-1 flex items-center justify-center">
            <p style={{ color: "var(--brown-light)" }}>Loading...</p>
          </div>
        </div>
      }
    >
      <CardContent />
    </Suspense>
  );
}
