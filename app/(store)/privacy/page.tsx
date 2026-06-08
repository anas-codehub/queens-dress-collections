import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-16">
      <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
        Legal
      </p>
      <h1 className="font-serif text-3xl lg:text-4xl text-brand-900 mb-8">
        Privacy Policy
      </h1>
      <p className="text-xs text-brand-400 tracking-wide mb-8 italic">
        Last updated: June 2026
      </p>

      <div className="flex flex-col gap-8 text-sm text-brand-600 leading-relaxed tracking-wide">
        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            1. Information We Collect
          </h2>
          <p>
            When you use Queens Dress Collection, we collect the following
            information:
          </p>
          <ul className="mt-3 flex flex-col gap-2 pl-4">
            <li>• Name, email address, and phone number when you register</li>
            <li>• Delivery address when you place an order</li>
            <li>• Order history and purchase details</li>
            <li>• Device and browser information for security purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            2. How We Use Your Information
          </h2>
          <p>We use your information to:</p>
          <ul className="mt-3 flex flex-col gap-2 pl-4">
            <li>• Process and deliver your orders</li>
            <li>• Send order confirmation and status update emails</li>
            <li>
              • Send promotional offers if you have subscribed to our newsletter
            </li>
            <li>• Improve our website and customer experience</li>
            <li>• Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            3. Information Sharing
          </h2>
          <p>
            We do not sell your personal information to third parties. We share
            your information only with:
          </p>
          <ul className="mt-3 flex flex-col gap-2 pl-4">
            <li>
              • Steadfast Courier — for order delivery (name, phone, address
              only)
            </li>
            <li>• Payment processors — for secure payment handling</li>
            <li>• Service providers who help operate our website</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            4. Data Security
          </h2>
          <p>We take security seriously. Your data is protected by:</p>
          <ul className="mt-3 flex flex-col gap-2 pl-4">
            <li>• SSL encryption on all pages</li>
            <li>• Encrypted password storage using industry-standard bcrypt</li>
            <li>• Secure database with restricted access</li>
            <li>• Regular security updates</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">5. Cookies</h2>
          <p>
            We use cookies to maintain your login session and remember your cart
            items. We do not use tracking cookies for advertising purposes
            beyond Meta Pixel for our own marketing.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            6. Your Rights
          </h2>
          <p>You have the right to:</p>
          <ul className="mt-3 flex flex-col gap-2 pl-4">
            <li>• Access the personal data we hold about you</li>
            <li>• Request correction of inaccurate data</li>
            <li>• Request deletion of your account and data</li>
            <li>• Unsubscribe from marketing emails at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            7. Contact Us
          </h2>
          <p>
            If you have any questions about this privacy policy or your personal
            data, please contact us at:
          </p>
          <p className="mt-2 font-medium text-brand-800">
            privacy@queensdress.com
          </p>
        </section>
      </div>
    </div>
  );
}
