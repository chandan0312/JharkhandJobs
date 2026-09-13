import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead.jsx'

export default function PrivacyPage() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <SEOHead
        title="Privacy Policy — Job Alert X"
        description="Privacy Policy for Job Alert X. Learn how we collect, use, and protect your personal information when you use our government job notification portal."
        canonical="https://jobalertx.com/privacy"
      />

      <nav className="flex items-center gap-1 text-[12.5px] text-ink-faint flex-wrap">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-ink-muted">Privacy Policy</span>
      </nav>

      <div className="card p-6 sm:p-8 space-y-6">
        <header>
          <h1 className="text-2xl font-extrabold text-ink">Privacy Policy</h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            Last updated: <time dateTime="2026-09-07">7 September 2026</time>
          </p>
        </header>

        {[
          {
            heading: '1. Information We Collect',
            body: `Job Alert X collects minimal personal information. When you create an account, we collect your name, email address, and (optionally) a profile picture. We also collect anonymous usage data through Google Analytics (page views, device type, country) to improve the website. We do not collect sensitive personal information such as Aadhaar numbers, bank details, or payment information directly — any application fees are paid directly on official government portals.`,
          },
          {
            heading: '2. How We Use Your Information',
            body: `We use your email address solely to authenticate your account. We use anonymous analytics data to understand which content is most useful to our users so we can improve it. We never sell, rent, or share your personal information with third parties for marketing purposes.`,
          },
          {
            heading: '3. Cookies',
            body: `We use cookies and similar technologies for: (a) session authentication (essential), (b) Google Analytics tracking (analytics), and (c) Google AdSense advertising (marketing). You can control cookie preferences through your browser settings. Disabling analytics/marketing cookies does not affect your ability to use the site.`,
          },
          {
            heading: '4. Third-Party Services',
            body: `Job Alert X uses the following third-party services that may process your data according to their own privacy policies: Google Analytics (analytics), Google AdSense (advertising), Google Fonts (typography). All official application links on this site redirect to government portals governed by their own privacy policies.`,
          },
          {
            heading: '5. Data Retention',
            body: `Account data is retained for as long as your account is active. You may request deletion of your account and associated data by emailing jobalerx365@gmail.com. Anonymous analytics data is retained per Google Analytics' standard retention periods.`,
          },
          {
            heading: '6. Security',
            body: `We use HTTPS encryption for all data transmission. Passwords are hashed using industry-standard algorithms. We do not store any payment information on our servers.`,
          },
          {
            heading: '7. Children\'s Privacy',
            body: `Job Alert X is intended for users aged 18 and above. We do not knowingly collect personal information from children under 18. If you believe a child has provided us with personal information, please contact us and we will delete it.`,
          },
          {
            heading: '8. Changes to This Policy',
            body: `We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the "Last updated" date at the top of this page. Continued use of the site after changes constitutes acceptance of the updated policy.`,
          },
          {
            heading: '9. Contact',
            body: `For any privacy-related questions or requests, please contact us at jobalerx365@gmail.com or through our Contact page.`,
          },
        ].map(({ heading, body }) => (
          <section key={heading} className="space-y-2">
            <h2 className="text-[16px] font-bold text-ink">{heading}</h2>
            <p className="text-[14px] leading-relaxed text-ink-soft">{body}</p>
          </section>
        ))}

        <div className="flex gap-4 pt-2 text-[13px] flex-wrap">
          <Link to="/terms" className="text-brand-600 hover:underline">Terms of Service</Link>
          <Link to="/disclaimer" className="text-brand-600 hover:underline">Disclaimer</Link>
          <Link to="/contact" className="text-brand-600 hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  )
}
