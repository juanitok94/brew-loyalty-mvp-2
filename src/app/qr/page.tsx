"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { STAMPS_REQUIRED } from "@/lib/constants";

export default function QRPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const baseUrl = window.location.origin;
    const target = `${baseUrl}/`;
    setUrl(target);
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, target, {
        width: 280,
        margin: 2,
        color: {
          dark: "#4A3526",
          light: "#FFFFFF",
        },
      });
    }
  }, []);

  function handlePrint() {
    window.print();
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 print:py-0">
      <div className="w-full max-w-xs space-y-6 text-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold" style={{ color: "var(--brown-dark)" }}>
            Odds Cafe
          </h1>
          <p className="text-sm" style={{ color: "var(--brown-light)" }}>
            West Asheville, NC
          </p>
        </div>

        <div
          className="rounded-2xl p-6 inline-block mx-auto"
          style={{ background: "#fff", border: "1.5px solid var(--stamp-empty)" }}
        >
          <canvas ref={canvasRef} className="block" />
        </div>

        <div className="space-y-2">
          <p className="text-base font-semibold" style={{ color: "var(--brown-dark)" }}>
            Scan to join our loyalty program
          </p>
          <p className="text-sm" style={{ color: "var(--brown-light)" }}>
            Buy {STAMPS_REQUIRED} coffees, get 1 FREE
          </p>
          <p className="text-xs" style={{ color: "var(--stamp-empty)" }}>
            No app download needed
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="w-full py-3 rounded-xl font-semibold text-white text-base print:hidden"
          style={{ background: "var(--brown)" }}
        >
          Print QR Code
        </button>

        {url && (
          <p className="text-xs break-all print:block" style={{ color: "var(--brown-light)" }}>
            {url}
          </p>
        )}
      </div>
    </main>
  );
}
