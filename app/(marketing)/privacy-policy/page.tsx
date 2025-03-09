export default async function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>

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
          <h2 className="text-2xl font-semibold">Introduction</h2>
          <p>
            Ad Conversions ("we," "our," or "us") respects your privacy and is
            committed to protecting your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our platform.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Personal Information:</strong> Name, email address, and
              other contact details you provide when creating an account.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you interact
              with our platform, including features used and time spent.
            </li>
            <li>
              <strong>Google Ads Data:</strong> When you connect your Google Ads
              account, we access data needed to provide our services.
            </li>
            <li>
              <strong>Device Information:</strong> Information about your
              device, IP address, browser type, and operating system.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">
            How We Use Your Information
          </h2>
          <p>We use your information for various purposes, including:</p>
          <ul className="list-disc pl-6">
            <li>Providing and improving our services</li>
            <li>Processing transactions</li>
            <li>Communicating with you about our services</li>
            <li>Analyzing usage patterns to enhance user experience</li>
            <li>Protecting our rights and preventing fraud</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">
            Data Sharing and Disclosure
          </h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Service Providers:</strong> Third-party vendors who assist
              us in providing our services.
            </li>
            <li>
              <strong>Business Partners:</strong> Companies we partner with to
              offer integrated services.
            </li>
            <li>
              <strong>Legal Entities:</strong> When required by law or to
              protect our rights.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal
            information. However, no method of transmission over the Internet or
            electronic storage is 100% secure, and we cannot guarantee absolute
            security.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6">
            <li>Access the personal information we have about you</li>
            <li>Correct inaccurate information</li>
            <li>Delete your personal information</li>
            <li>Object to our processing of your information</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">
            Cookies and Tracking Technologies
          </h2>
          <p>
            We use cookies and similar tracking technologies to collect
            information about your browsing activities. You can manage your
            cookie preferences through your browser settings.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 18.
            We do not knowingly collect personal information from children.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">
            Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at myles@serendipityy.io.
          </p>
        </section>
      </div>
    </div>
  )
}
