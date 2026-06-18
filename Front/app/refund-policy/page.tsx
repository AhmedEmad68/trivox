import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy — TriVox Travel",
  description: "Our refund and cancellation policy for tours, transfers and experiences booked through TriVox.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" lastUpdated="1 January 2026">
      <section>
        <h2>Standard cancellation tiers</h2>
        <p>The cancellation policy for each trip is displayed on its listing page before you book. There are three standard tiers:</p>
        <ul>
          <li><strong>Free cancellation:</strong> Cancel at any time up to 24 hours before the scheduled start time. A full refund is processed within 5–7 business days.</li>
          <li><strong>Partial refund:</strong> Cancel between 24 hours and 2 hours before the start time. You receive a 50% refund. Cancellations within 2 hours of start are non-refundable.</li>
          <li><strong>Non-refundable:</strong> No refund on cancellation. This applies to certain promotional rates, last-minute bookings, and trips explicitly marked non-refundable.</li>
        </ul>
      </section>

      <section>
        <h2>Operator cancellations</h2>
        <p>If an operator cancels your booking for any reason, you will receive a 100% refund of all amounts paid, processed within 2–3 business days. Additionally, TriVox may offer a 10% discount code for your next booking as a goodwill gesture.</p>
      </section>

      <section>
        <h2>How to request a refund</h2>
        <p>To cancel a booking and request a refund:</p>
        <ul>
          <li>Log in to your account and navigate to My Bookings.</li>
          <li>Find the relevant booking and click &quot;Cancel booking&quot;.</li>
          <li>Confirm the cancellation. If you are within the free cancellation window, the refund is processed automatically.</li>
        </ul>
        <p>Refunds are returned to the original payment method. Processing times depend on your bank or card issuer — typically 5–7 business days for cards, 3–5 days for PayPal.</p>
      </section>

      <section>
        <h2>Disputes</h2>
        <p>If you believe you are owed a refund that has not been processed correctly, contact our support team at <a href="mailto:support@trivox.travel">support@trivox.travel</a> or via WhatsApp. We aim to resolve all disputes within 48 hours.</p>
      </section>

      <section>
        <h2>Exceptions</h2>
        <p>In cases of extraordinary circumstances beyond either party&apos;s control (natural disasters, government restrictions, severe weather), TriVox may facilitate flexible rebooking or refunds at its discretion, regardless of the standard policy tier.</p>
      </section>
    </LegalPage>
  );
}
