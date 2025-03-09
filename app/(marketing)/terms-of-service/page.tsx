export default async function TermsOfServicePage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground text-lg">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
          })}
        </p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Ad Conversions ("the Service"), you agree to
            be bound by these Terms of Service. If you do not agree to these
            terms, please do not use our Service.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">2. Description of Service</h2>
          <p>
            Ad Conversions provides tools for optimizing Google Ads campaigns,
            including Responsive Search Ads (RSA) generation. We reserve the
            right to modify or discontinue the Service at any time without
            notice.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">3. User Accounts</h2>
          <p>
            To use our Service, you must create an account. You are responsible
            for:
          </p>
          <ul className="list-disc pl-6">
            <li>Providing accurate account information</li>
            <li>Maintaining the security of your account credentials</li>
            <li>All activities that occur under your account</li>
          </ul>
          <p className="mt-2">
            We reserve the right to suspend or terminate accounts that violate
            these terms.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">
            4. Subscription and Payments
          </h2>
          <p>
            Some features of our Service require a paid subscription. By
            subscribing:
          </p>
          <ul className="list-disc pl-6">
            <li>
              You agree to pay all fees associated with your subscription plan
            </li>
            <li>You authorize us to charge your payment method</li>
            <li>
              You understand that subscriptions automatically renew unless
              canceled
            </li>
          </ul>
          <p className="mt-2">
            We reserve the right to change subscription fees with notice to
            users.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">5. Google Ads Integration</h2>
          <p>
            Our Service integrates with Google Ads. You are responsible for:
          </p>
          <ul className="list-disc pl-6">
            <li>Complying with Google's terms of service</li>
            <li>Authorizing our access to your Google Ads account</li>
            <li>
              Reviewing and approving any changes our Service makes to your ads
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
          <p>
            All content and technology provided by our Service are owned by Ad
            Conversions and protected by intellectual property laws. You may
            not:
          </p>
          <ul className="list-disc pl-6">
            <li>Copy, modify, or distribute our content without permission</li>
            <li>Reverse engineer our technology</li>
            <li>Use our trademarks without authorization</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">7. User Content</h2>
          <p>
            You retain ownership of content you upload to our Service. By
            uploading content, you grant us a license to use, store, and display
            that content in connection with providing the Service.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">8. Limitation of Liability</h2>
          <p>
            The Service is provided "as is" without warranties of any kind. Ad
            Conversions shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages resulting from your use
            of the Service.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Ad Conversions and its
            affiliates from any claims, damages, liabilities, costs, or expenses
            arising from your use of the Service or violation of these terms.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">10. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your access to the
            Service at any time for any reason, including violation of these
            terms. Upon termination, your right to use the Service will
            immediately cease.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">11. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with
            the laws of the jurisdiction in which Ad Conversions operates,
            without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">12. Changes to Terms</h2>
          <p>
            We may update these Terms of Service from time to time. We will
            notify you of any changes by posting the new Terms on this page.
            Your continued use of the Service after such changes constitutes
            your acceptance of the new Terms.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">13. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at
            myles@serendipityy.io.
          </p>
        </section>
      </div>
    </div>
  )
}
