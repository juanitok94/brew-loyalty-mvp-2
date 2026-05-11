import Link from "next/link";
import { shopConfig } from "@/config/shop";

export const metadata = {
  title: `Terms & Conditions — ${shopConfig.name} Loyalty Program`,
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      <header
        style={{
          background: shopConfig.colors.headerBg,
          padding: "28px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <img
          src={shopConfig.logoPath}
          alt={shopConfig.name}
          style={{ width: 72, height: 72, objectFit: "contain" }}
        />
        <h1 className="font-display text-2xl" style={{ color: shopConfig.colors.headerText }}>
          {shopConfig.name}
        </h1>
        <p
          className="text-sm tracking-[0.2em] uppercase"
          style={{ color: shopConfig.colors.headerTextMuted }}
        >
          {shopConfig.tagline}
        </p>
      </header>

      <main className="flex-1 px-6 py-10 max-w-2xl mx-auto w-full">
        <Link
          href="/"
          className="inline-block text-sm font-medium mb-8"
          style={{ color: "var(--brown)" }}
        >
          ← Back
        </Link>

        <h2 className="font-display text-2xl mb-1" style={{ color: "var(--foreground)" }}>
          Terms &amp; Conditions
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--brown-light)" }}>
          {shopConfig.name} Loyalty Program
        </p>

        <div
          className="rounded-2xl p-6 space-y-6 text-sm leading-relaxed"
          style={{ background: "var(--cream)", color: "var(--foreground)" }}
        >
          <p style={{ color: "var(--brown-light)" }}>
            Effective Date: May 2026 &nbsp;·&nbsp; Operator: Peachy Kean DevOps LLC
            &nbsp;·&nbsp; Program: {shopConfig.name} Loyalty Pass, powered by Brew Loyalty
            &nbsp;·&nbsp; Venue: {shopConfig.name}, {shopConfig.location}
          </p>

          <Section title="1. What We Collect">
            When you sign up, we collect your 10-digit US phone number and a name or nickname of at
            least 3 characters. We use the last 4 digits of your phone number combined with your
            nickname to identify your loyalty account.
          </Section>

          <Section title="2. How We Use Your Information">
            Your phone number and nickname are used only to create and track your stamp card,
            identify your account in store, and issue your free drink reward. We do not use your
            information for advertising or marketing.
          </Section>

          <Section title="3. Who Sees Your Information">
            Venue staff see last 4 digits + nickname to look up cards and add stamps. Peachy Kean
            DevOps LLC operates and maintains the platform. We do not sell, rent, or share your data
            with third parties.
          </Section>

          <Section title="4. Data Storage">
            Stored securely in our database. No payment information is stored. Your loyalty account
            is not linked to any other accounts or services.
          </Section>

          <Section title="5. SMS &amp; Communications">
            Signing up does not opt you into SMS marketing. We will not send promotional texts. If
            this changes, we will ask for explicit consent.
          </Section>

          <Section title="6. How to Remove Your Account">
            Email{" "}
            <a
              href="mailto:john@peachykeandev.com?subject=Delete%20My%20Loyalty%20Account"
              style={{ color: "var(--brown)", textDecoration: "underline" }}
            >
              john@peachykeandev.com
            </a>{" "}
            with subject &ldquo;Delete My Loyalty Account&rdquo;. We will remove your record within
            5 business days.
          </Section>

          <Section title="7. Children's Privacy">
            This program is intended for customers 13 and older.
          </Section>

          <Section title="8. Changes to These Terms">
            Current version always available at this page. Continued use after an update constitutes
            acceptance.
          </Section>

          <Section title="9. Contact">
            Peachy Kean DevOps LLC, Asheville NC —{" "}
            <a
              href="mailto:john@peachykeandev.com"
              style={{ color: "var(--brown)", textDecoration: "underline" }}
            >
              john@peachykeandev.com
            </a>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <h3 className="font-semibold" style={{ color: "var(--brown)" }}>
        {title}
      </h3>
      <p>{children}</p>
    </div>
  );
}
