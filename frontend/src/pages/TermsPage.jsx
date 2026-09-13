import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead.jsx'

export default function TermsPage() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <SEOHead
        title="Terms of Service — Job Alert X"
        description="Terms of Service for Job Alert X. Read the terms and conditions governing your use of our free Indian government job notification portal."
        canonical="https://jobalertx.com/terms"
      />

      <nav className="flex items-center gap-1 text-[12.5px] text-ink-faint flex-wrap">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-ink-muted">Terms of Service</span>
      </nav>

      <div className="card p-6 sm:p-8 space-y-6">
        <header>
          <h1 className="text-2xl font-extrabold text-ink">Terms of Service</h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            Last updated: <time dateTime="2026-09-07">7 September 2026</time>
          </p>
          <p className="mt-2 text-[13.5px] text-ink-soft leading-relaxed">
            By accessing or using Job Alert X ("the Site"), you agree to be bound by these Terms of
            Service. Please read them carefully.
          </p>
        </header>

        {[
          {
            heading: '1. Acceptance of Terms',
            body: 'By using Job Alert X, you confirm that you are at least 18 years of age, that you have read and understood these Terms, and that you agree to be bound by them. If you do not agree, please do not use the Site.',
          },
          {
            heading: '2. Nature of the Service',
            body: 'Job Alert X is an informational aggregator and notification portal for Indian government job vacancies, admit cards, results, answer keys, and syllabi. We are NOT a government body, recruiting authority, or authorized agent of any government organization. All information published is for informational purposes only.',
          },
          {
            heading: '3. Accuracy of Information',
            body: 'While we make every effort to provide accurate and up-to-date information, Job Alert X does not guarantee the completeness, accuracy, or timeliness of any information published. Always verify recruitment details — including eligibility, dates, fees, and vacancy counts — from the official recruiting authority\'s website and official notification PDF before applying.',
          },
          {
            heading: '4. No Application Processing',
            body: 'Job Alert X does not process job applications, collect application fees, or represent any government recruiting authority. All application links direct you to official government portals. We are not responsible for any issues arising from applications submitted on third-party websites.',
          },
          {
            heading: '5. User Accounts',
            body: 'You are responsible for maintaining the confidentiality of your account credentials. You must not share your account with others or use another person\'s account without permission. You are responsible for all activity that occurs under your account.',
          },
          {
            heading: '6. Prohibited Conduct',
            body: 'You agree not to: (a) use the Site for any unlawful purpose; (b) scrape, harvest, or systematically extract data from the Site without written permission; (c) attempt to gain unauthorized access to any part of the Site; (d) post false, misleading, or defamatory content; (e) impersonate any person or entity.',
          },
          {
            heading: '7. Intellectual Property',
            body: 'The design, layout, original text, and code of Job Alert X are the intellectual property of Job Alert X. Government notifications and official documents reproduced on the Site are in the public domain. You may share links to our pages but may not reproduce our original content without permission.',
          },
          {
            heading: '8. Limitation of Liability',
            body: 'Job Alert X and its operators shall not be liable for any loss or damage — including loss of employment opportunity, application rejection, or financial loss — arising from your reliance on information published on the Site. Use of this Site is at your own risk.',
          },
          {
            heading: '9. Modifications',
            body: 'We reserve the right to modify these Terms at any time. Continued use of the Site after changes constitutes acceptance of the updated Terms. The "Last updated" date at the top reflects the most recent revision.',
          },
          {
            heading: '10. Governing Law',
            body: 'These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of the Site shall be subject to the jurisdiction of courts in India.',
          },
        ].map(({ heading, body }) => (
          <section key={heading} className="space-y-2">
            <h2 className="text-[16px] font-bold text-ink">{heading}</h2>
            <p className="text-[14px] leading-relaxed text-ink-soft">{body}</p>
          </section>
        ))}

        <div className="flex gap-4 pt-2 text-[13px] flex-wrap">
          <Link to="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
          <Link to="/disclaimer" className="text-brand-600 hover:underline">Disclaimer</Link>
          <Link to="/contact" className="text-brand-600 hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  )
}
