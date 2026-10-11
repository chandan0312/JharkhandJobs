import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import SEOHead from '../components/SEOHead.jsx'
import { submitFeedback } from '../services/api.js'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setStatus('sending')
    try {
      await submitFeedback({ name: form.name, email: form.email, message: `[Subject: ${form.subject}] ${form.message}` })
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jharkhand.jobalertx.com/' },
      { '@type': 'ListItem', position: 2, name: 'Contact Us', item: 'https://jharkhand.jobalertx.com/contact' },
    ],
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <SEOHead
        title="Contact Us — Jharkhand JobAlert X | Support & Queries"
        description="Contact the Jharkhand JobAlert X team for Jharkhand job notifications, JPSC/JSSC queries, Rojgar Mela coverage, or feedback."
        canonical="https://jharkhand.jobalertx.com/contact"
        jsonLd={[breadcrumbSchema]}
      />

      <nav className="flex items-center gap-1 text-[12.5px] text-ink-faint flex-wrap">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-ink-muted">Contact Us</span>
      </nav>

      <header className="card p-6">
        <h1 className="text-2xl font-extrabold text-ink">Contact Us</h1>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
          Found an error? Have a suggestion? Want to report a notification? We respond within 24 hours.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="mailto:jobalerx365@gmail.com"
            className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2 text-[13px] font-medium text-ink-soft hover:text-ink transition-colors">
            <Mail size={15} className="text-brand-600" />
            jobalerx365@gmail.com
          </a>
          <a href="tel:+918789862771"
            className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2 text-[13px] font-medium text-ink-soft hover:text-ink transition-colors">
            <Phone size={15} className="text-purple-500" />
            +91 8789862771
          </a>
        </div>
      </header>

      <div className="card p-6">
        <h2 className="text-[17px] font-bold text-ink mb-4">Send a Message</h2>

        {status === 'success' && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-[13.5px] font-medium text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 size={16} /> Thank you! We received your message and will respond within 24 hours.
          </div>
        )}
        {status === 'error' && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-[13.5px] font-medium text-red-700 dark:text-red-300">
            <AlertCircle size={16} /> Something went wrong. Please email us directly at jobalerx365@gmail.com.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="block text-[12.5px] font-semibold text-ink-soft mb-1.5">
                Your Name *
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-hairline bg-surface px-3.5 py-2.5 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-[12.5px] font-semibold text-ink-soft mb-1.5">
                Email Address *
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full rounded-xl border border-hairline bg-surface px-3.5 py-2.5 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-subject" className="block text-[12.5px] font-semibold text-ink-soft mb-1.5">
              Subject
            </label>
            <input
              id="contact-subject"
              type="text"
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              placeholder="e.g. Inquiry regarding JPSC Civil Services 2026 or Rojgar Mela"
              className="w-full rounded-xl border border-hairline bg-surface px-3.5 py-2.5 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-[12.5px] font-semibold text-ink-soft mb-1.5">
              Message *
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              placeholder="Describe your query or report an error..."
              className="w-full rounded-xl border border-hairline bg-surface px-3.5 py-2.5 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:brightness-110 transition-all disabled:opacity-60"
          >
            <Send size={15} />
            {status === 'sending' ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>

      <p className="text-center text-[12px] text-ink-faint">
        Response time: within 24 hours (Mon–Sat, 9 AM – 8 PM IST)
      </p>
    </div>
  )
}
