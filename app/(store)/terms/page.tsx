import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-16">
      <p className="text-[10px] text-brand-500 tracking-[0.25em] uppercase mb-2">
        Legal
      </p>
      <h1 className="font-serif text-3xl lg:text-4xl text-brand-900 mb-8">
        Terms & Conditions
      </h1>
      <p className="text-xs text-brand-400 tracking-wide mb-8 italic">
        Last updated: June 2026
      </p>

      <div className="flex flex-col gap-8 text-sm text-brand-600 leading-relaxed tracking-wide">
        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using Queens Dress Collection website, you agree to
            be bound by these Terms and Conditions. If you do not agree, please
            do not use our website.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            2. Products & Pricing
          </h2>
          <ul className="flex flex-col gap-2 pl-4">
            <li>• All prices are shown in Bangladeshi Taka (৳)</li>
            <li>• Prices are subject to change without prior notice</li>
            <li>
              • Product images are for illustration — actual colors may vary
              slightly
            </li>
            <li>
              • We reserve the right to cancel orders if pricing errors occur
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            3. Orders & Payment
          </h2>
          <ul className="flex flex-col gap-2 pl-4">
            <li>• Orders are confirmed only after successful placement</li>
            <li>
              • Cash on Delivery (COD) orders must be paid in full upon delivery
            </li>
            <li>
              • We reserve the right to cancel any order at our discretion
            </li>
            <li>• Order cancellation requests must be made before dispatch</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            4. Delivery
          </h2>
          <ul className="flex flex-col gap-2 pl-4">
            <li>• Delivery charges are calculated based on your district</li>
            <li>• Standard delivery takes 2-5 business days</li>
            <li>
              • We are not responsible for delays caused by courier services
            </li>
            <li>
              • Please ensure your delivery address is accurate — we are not
              responsible for failed deliveries due to incorrect information
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            5. Returns & Refunds
          </h2>
          <ul className="flex flex-col gap-2 pl-4">
            <li>• Returns are accepted within 30 days of delivery</li>
            <li>
              • Items must be unused, unwashed, and in original condition with
              tags attached
            </li>
            <li>• Sale items are not eligible for returns</li>
            <li>
              • Refunds are processed within 7 business days of receiving the
              returned item
            </li>
            <li>• Delivery charges are non-refundable</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            6. Intellectual Property
          </h2>
          <p>
            All content on this website including images, text, logos, and
            designs are the property of Queens Dress Collection. Unauthorized
            use, reproduction, or distribution is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            7. Limitation of Liability
          </h2>
          <p>
            Queens Dress Collection shall not be liable for any indirect,
            incidental, or consequential damages arising from the use of our
            website or products beyond the purchase price of the item.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">
            8. Governing Law
          </h2>
          <p>
            These terms are governed by the laws of Bangladesh. Any disputes
            shall be resolved in the courts of Dhaka, Bangladesh.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-900 mb-3">9. Contact</h2>
          <p>For any questions regarding these terms, contact us at:</p>
          <p className="mt-2 font-medium text-brand-800">
            support@queensdress.com
          </p>
        </section>
      </div>
    </div>
  );
}
