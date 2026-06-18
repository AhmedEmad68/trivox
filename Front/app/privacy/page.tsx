import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — TriVox Travel",
  description: "How TriVox Travel collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="1 January 2026">
      <section>
        <h2>1. Data we collect</h2>
        <p>When you use TriVox, we collect the following categories of personal data:</p>
        <ul>
          <li><strong>Account data:</strong> Name, email address, password (hashed), phone number, nationality.</li>
          <li><strong>Booking data:</strong> Trip selections, dates, participant counts, add-ons, payment confirmation (not card details — these are processed by Stripe).</li>
          <li><strong>Usage data:</strong> Pages visited, search queries, click patterns, device type, IP address.</li>
          <li><strong>Communications:</strong> Messages sent to our support team, reviews you submit.</li>
        </ul>
      </section>

      <section>
        <h2>2. How we use your data</h2>
        <p>We use your personal data to:</p>
        <ul>
          <li>Process and manage your bookings, and send confirmation vouchers.</li>
          <li>Communicate with you about your trips, changes, or support requests.</li>
          <li>Improve our platform through aggregated analytics.</li>
          <li>Send marketing emails (only with your consent — you can unsubscribe at any time).</li>
          <li>Comply with our legal obligations in Egypt and applicable international law.</li>
        </ul>
      </section>

      <section>
        <h2>3. Data sharing</h2>
        <p>We share your data only as necessary to operate the service:</p>
        <ul>
          <li><strong>Operators:</strong> Your booking details (name, contact, participant count) are shared with the operator you book with.</li>
          <li><strong>Payment processors:</strong> Stripe processes payments. We never see or store your full card number.</li>
          <li><strong>Analytics:</strong> We use anonymised analytics data. No personal identifiers are shared.</li>
          <li>We never sell your personal data to third parties for advertising purposes.</li>
        </ul>
      </section>

      <section>
        <h2>4. Data retention</h2>
        <p>We retain your account data for as long as your account is active. Booking records are retained for 7 years to comply with financial regulations. You may request deletion of your account at any time via your Profile Settings, subject to retention obligations.</p>
      </section>

      <section>
        <h2>5. Your rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Correct inaccurate data.</li>
          <li>Request deletion of your data (subject to legal retention requirements).</li>
          <li>Object to or restrict certain processing activities.</li>
          <li>Receive your data in a portable format.</li>
        </ul>
        <p>To exercise any of these rights, contact <a href="mailto:privacy@trivox.travel">privacy@trivox.travel</a>.</p>
      </section>

      <section>
        <h2>6. Cookies</h2>
        <p>We use essential cookies to maintain your session and preferences. We use analytics cookies (anonymised) to understand how the platform is used. You can disable non-essential cookies in your browser settings at any time.</p>
      </section>

      <section>
        <h2>7. Security</h2>
        <p>All data is transmitted over HTTPS (TLS 1.3). Passwords are hashed using bcrypt. Payment processing is PCI DSS Level 1 compliant via Stripe. We conduct regular security reviews.</p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>Our data protection contact is reachable at <a href="mailto:privacy@trivox.travel">privacy@trivox.travel</a>.</p>
      </section>
    </LegalPage>
  );
}
