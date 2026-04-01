import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Odds Cafe — Loyalty Card",
  description: "Your digital loyalty stamp card for Odds Cafe, West Asheville NC",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Odds Cafe",
  },
};

export const viewport: Viewport = {
  themeColor: "#6B4F36",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen" style={{ background: "var(--background)" }}>
        {children}
      </body>
    </html>
  );
}
