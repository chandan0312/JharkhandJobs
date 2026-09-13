import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead.jsx'

export default function DisclaimerPage() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <SEOHead
        title="Disclaimer — Job Alert X"
        description="Disclaimer for Job Alert X. Job Alert X is an independent information portal and is not affiliated with any government recruiting authority. All information is for reference only."
        canonical="https://jobalertx.com/disclaimer"
      />

      <nav className="flex items-center gap-1 text-[12.5px] text-ink-faint flex-wrap">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-ink-muted">Disclaimer</span>
      </nav>

      <div className="card p-6 sm:p-8 space-y-6">
        <header>
          <h1 className="text-2xl font-extrabold text-ink">Disclaimer</h1>
          <p className="mt-1 text-[13px] text-ink-muted">
            Last updated: <time dateTime="2026-09-07">7 September 2026</time>
          </p>
        </header>

        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
          <p className="text-[13.5px] font-semibold text-orange-700 dark:text-orange-300">
            ⚠️ Job Alert X is an independent information portal. We are NOT affiliated with any
            Central or State Government authority, recruiting body, or official examination
            conducting organisation.
          </p>
        </div>

        {[
          {
            heading: 'Information Purpose Only',
            body: 'All content published on Job Alert X — including recruitment notifications, important dates, eligibility criteria, vacancy details, application fees, admit card links, result announcements, answer keys, and syllabus — is published for informational and reference purposes only. It is NOT the official communication from any government department.',
          },
          {
            heading: 'Verify Before Applying',
            body: 'Candidates MUST verify all information — including vacancy count, eligibility, last date, fee, and exam pattern — from the official notification PDF and the official website of the respective recruiting authority before submitting any application or paying any fee. Relying solely on information from Job Alert X without independent verification is done at the candidate\'s own risk.',
          },
          {
            heading: 'No Guarantee of Accuracy',
            body: 'While Job Alert X strives to publish accurate and timely information, we cannot guarantee that all information is complete, error-free, or current at all times. Government authorities may modify, postpone, or cancel recruitments without prior notice. Such changes may not be immediately reflected on this website.',
          },
          {
            heading: 'No Government Affiliation',
            body: 'Job Alert X is not affiliated with, endorsed by, or connected to any of the following or similar organisations: Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Railway Recruitment Board (RRB), Institute of Banking Personnel Selection (IBPS), State Bank of India (SBI), any State Public Service Commission, or any other Central or State Government body. Use of government names, acronyms, and exam names is solely for informational reference.',
          },
          {
            heading: 'External Links',
            body: 'Job Alert X links to official government websites for applications, admit cards, results, and notifications. We are not responsible for the content, availability, or accuracy of external websites. Links to external sites do not constitute an endorsement.',
          },
          {
            heading: 'No Liability',
            body: 'Job Alert X and its operators shall not be held liable for any direct, indirect, or consequential loss or damage — including missed application deadlines, rejected applications, financial loss, or loss of employment opportunity — arising from use of or reliance on information published on this website.',
          },
          {
            heading: 'Reporting Errors',
            body: 'If you find any error, outdated information, or incorrect content on Job Alert X, please report it to jobalerx365@gmail.com. We aim to correct factual errors within 24 hours of being notified.',
          },
        ].map(({ heading, body }) => (
          <section key={heading} className="space-y-2">
            <h2 className="text-[16px] font-bold text-ink">{heading}</h2>
            <p className="text-[14px] leading-relaxed text-ink-soft">{body}</p>
          </section>
        ))}

        <div className="flex gap-4 pt-2 text-[13px] flex-wrap">
          <Link to="/about" className="text-brand-600 hover:underline">About Us</Link>
          <Link to="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="text-brand-600 hover:underline">Terms of Service</Link>
          <Link to="/contact" className="text-brand-600 hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  )
}
