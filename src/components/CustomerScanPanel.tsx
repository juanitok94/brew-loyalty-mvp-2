"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

type Props = {
  onScan: (value: string) => void;
};

export default function CustomerScanPanel({ onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;
    let rafId: number;
    let scanned = false;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;

        if ("BarcodeDetector" in window) {
          const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });

          const scanNative = async () => {
            if (scanned || !videoRef.current) return;
            const video = videoRef.current;
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
              const barcodes = await detector.detect(video);
              if (barcodes.length > 0 && barcodes[0].rawValue) {
                scanned = true;
                onScan(barcodes[0].rawValue);
                return;
              }
            }
            rafId = requestAnimationFrame(scanNative);
          };

          rafId = requestAnimationFrame(scanNative);
        } else {
          // jsQR canvas fallback for Firefox / older Safari / older Android
          const scanCanvas = () => {
            if (scanned || !videoRef.current || !canvasRef.current) return;
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext("2d");
              if (!ctx) return;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(imageData.data, imageData.width, imageData.height);
              if (code?.data) {
                scanned = true;
                onScan(code.data);
                return;
              }
            }
            rafId = requestAnimationFrame(scanCanvas);
          };

          rafId = requestAnimationFrame(scanCanvas);
        }
      } catch {
        setError("Camera access denied");
      }
    }

    startCamera();

    return () => {
      cancelAnimationFrame(rafId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [onScan]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Scan Customer</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: 400 }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <p style={{ marginTop: 10 }}>Point camera at customer QR code</p>
    </div>
  );
}
