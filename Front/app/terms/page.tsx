import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — TriVox Travel",
  description: "Terms and conditions for using TriVox Travel's platform and booking services.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="1 January 2026">
      <section>
        <h2>1. Introduction</h2>
        <p>Welcome to TriVox Travel (&quot;TriVox&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using our platform at trivox.travel, you agree to be bound by these Terms of Service. Please read them carefully before making a booking.</p>
        <p>TriVox is a marketplace that connects travellers with local tour operators, guides, and experience hosts in Egypt. We are not ourselves the provider of tours, transfers or experiences — we facilitate the connection and booking process.</p>
      </section>

      <section>
        <h2>2. Eligibility</h2>
        <p>You must be at least 18 years old to create an account or make a booking. By using TriVox, you represent that you are of legal age and have the authority to enter into these Terms.</p>
      </section>

      <section>
        <h2>3. Bookings and payments</h2>
        <p>When you complete a booking through TriVox, you enter into a contract with the operator listed on the relevant trip page. TriVox acts as an agent on behalf of operators.</p>
        <ul>
          <li>All prices shown include taxes and fees unless otherwise stated.</li>
          <li>Payment is taken immediately at checkout via Stripe (card) or PayPal.</li>
          <li>A booking confirmation is sent to your email address immediately upon successful payment.</li>
          <li>Your booking is with the operator, not with TriVox. TriVox does not guarantee operator performance.</li>
        </ul>
      </section>

      <section>
        <h2>4. Cancellations and refunds</h2>
        <p>Each trip listing displays its own cancellation policy. The general rules are:</p>
        <ul>
          <li><strong>Free cancellation:</strong> Cancel up to 24 hours before the trip start time for a full refund.</li>
          <li><strong>Partial refund:</strong> Cancel within 24 hours of the trip start time to receive a 50% refund.</li>
          <li><strong>Non-refundable:</strong> No refund on cancellation. This applies to certain last-minute bookings.</li>
        </ul>
        <p>If an operator cancels your booking, you will receive a full refund within 5–7 business days. TriVox may, at its discretion, offer additional compensation in the form of discount codes.</p>
      </section>

      <section>
        <h2>5. User conduct</h2>
        <p>You agree not to use the TriVox platform to:</p>
        <ul>
          <li>Post false, misleading, or fraudulent reviews or information.</li>
          <li>Circumvent TriVox's booking system to pay operators directly.</li>
          <li>Harass, abuse, or threaten other users or operators.</li>
          <li>Violate any applicable laws or regulations.</li>
        </ul>
        <p>TriVox reserves the right to suspend or terminate accounts that violate these terms.</p>
      </section>

      <section>
        <h2>6. Limitation of liability</h2>
        <p>TriVox is a marketplace platform. We are not liable for the actions, errors, omissions, or negligence of operators. Our total liability to you for any claim arising from your use of the platform is limited to the amount you paid for the relevant booking.</p>
        <p>We strongly recommend that all travellers obtain comprehensive travel insurance before departure.</p>
      </section>

      <section>
        <h2>7. Governing law</h2>
        <p>These Terms are governed by the laws of the Arab Republic of Egypt. Any disputes shall be subject to the exclusive jurisdiction of the courts of Cairo, Egypt.</p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>For questions about these Terms, please contact us at <a href="mailto:legal@trivox.travel">legal@trivox.travel</a> or write to: TriVox Travel, 5 Tahrir Square, Garden City, Cairo, Egypt 11511.</p>
      </section>
    </LegalPage>
  );
}
