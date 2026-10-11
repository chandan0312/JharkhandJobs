import { Link } from 'react-router-dom'
import {
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Send,
  Youtube,
  Twitter,
  Linkedin,
  MessageCircle,
  ExternalLink,
} from 'lucide-react'
import SarkariEmblem from './SarkariEmblem.jsx'

const CATEGORY_LINKS = [
  { label: 'JPSC',              to: '/category/jpsc' },
  { label: 'JSSC',              to: '/category/jssc' },
  { label: 'Other Jharkhand',   to: '/category/other-jharkhand' },
  { label: 'Rojgar Mela',       to: '/category/rojgar-mela' },
  { label: 'Private Jobs',      to: '/category/private-job' },
  { label: 'Central Jobs',      to: '/category/central-job' },
]

const QUICK_LINKS = [
  { label: 'Latest Jobs',            to: '/latest/job',        badge: 'Hot' },
  { label: 'Career Guides',          to: '/articles',          badge: 'New' },
  { label: 'Admit Cards',            to: '/latest/admit-card' },
  { label: 'Exam Results',           to: '/latest/result' },
  { label: 'Answer Keys',            to: '/latest/answer-key' },
  { label: 'Syllabus & Pattern',     to: '/latest/syllabus' },
  { label: 'Rojgar Bharti Mela',    to: '/rojgar-mela' },
]

const COMPANY_LINKS = [
  { label: 'About Us',               to: '/about' },
  { label: 'Contact Us',             to: '/contact' },
  { label: 'Feedback',               to: '/feedback' },
  { label: 'Privacy Policy',         to: '/privacy' },
  { label: 'Terms of Service',       to: '/terms' },
  { label: 'Disclaimer',             to: '/disclaimer' },
]

const SOCIALS = [
  { href: 'https://t.me/jobalertx',                    label: 'Telegram',  icon: <Send     size={13} /> },
  { href: 'https://youtube.com/@jobalertx',            label: 'YouTube',   icon: <Youtube  size={14} /> },
  { href: 'https://whatsapp.com/channel/jobalertx',    label: 'WhatsApp',  icon: <MessageCircle size={13} /> },
  { href: 'https://twitter.com/jobalertx',             label: 'Twitter/X', icon: <Twitter  size={13} /> },
  { href: 'https://linkedin.com/company/jobalertx',    label: 'LinkedIn',  icon: <Linkedin size={13} /> },
]

function FooterLink({ to, children, isExternal }) {
  const cls = `
    inline-flex items-center gap-1 text-[12px] transition-colors duration-150
    hover:translate-x-0.5
  `
  if (isExternal) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noreferrer"
        className={cls}
        style={{ color: 'var(--text-2)' }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)' }}
      >
        {children}
        <ExternalLink size={10} aria-hidden="true" className="opacity-50" />
      </a>
    )
  }
  return (
    <Link
      to={to}
      className={cls}
      style={{ color: 'var(--text-2)' }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-2)' }}
    >
      {children}
    </Link>
  )
}

function FooterSection({ title, dotColor, children }) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider"
          style={{ color: 'var(--text)' }}>
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: dotColor || 'var(--accent)' }}
          aria-hidden="true"
        />
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full" aria-label="Site footer">
      {/* ── Main footer body ────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {/* Geometric line pattern (~6% opacity) per design prompt */}
        <div className="footer-geo-pattern" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

            {/* ── Brand + Contact (5 cols) ─────────────────────────── */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {/* Logo */}
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 transition-transform hover:scale-[1.01]"
                aria-label="Jharkhand JobAlert X home"
              >
                <SarkariEmblem size={32} />
                <div className="flex flex-col leading-none">
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-[16px] font-black tracking-tight"
                      style={{ color: 'var(--text)' }}
                    >
                      JobAlert
                    </span>
                    <span
                      className="text-[18px] font-black"
                      style={{ color: '#FFFB08', textShadow: '0 0 8px rgba(255,251,8,.5)' }}
                    >
                      X
                    </span>
                  </div>
                  <span
                    className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Jharkhand Govt &amp; Private Jobs
                  </span>
                </div>
              </Link>

              {/* Bio */}
              <p className="max-w-sm text-[13px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
                Jharkhand's premier job alert portal. 100% verified notifications for JPSC, JSSC,
                District Rojgar Mela, Admit Cards, Results, and Private Sector jobs.
              </p>

              {/* Contact pills */}
              <div className="flex flex-wrap gap-2">
                <a
                  href="mailto:jobalerx365@gmail.com"
                  className="inline-flex items-center gap-1.5 rounded-row px-3 py-1.5 text-[12px] font-medium transition-colors"
                  style={{
                    background: 'var(--surface-2)',
                    color: 'var(--text-2)',
                    border: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
                >
                  <Mail size={12} aria-hidden="true" />
                  jobalerx365@gmail.com
                </a>
                <a
                  href="tel:8789862771"
                  className="inline-flex items-center gap-1.5 rounded-row px-3 py-1.5 text-[12px] font-medium transition-colors"
                  style={{
                    background: 'var(--surface-2)',
                    color: 'var(--text-2)',
                    border: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
                >
                  <Phone size={12} aria-hidden="true" />
                  +91 8789862771
                </a>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-1.5">
                {SOCIALS.map(({ href, label, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex h-8 w-8 items-center justify-center rounded-btn transition-all duration-150"
                    style={{
                      background: 'var(--surface-2)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--accent-soft)'
                      e.currentTarget.style.color = 'var(--accent)'
                      e.currentTarget.style.borderColor = 'var(--accent-strong)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'var(--surface-2)'
                      e.currentTarget.style.color = 'var(--text-muted)'
                      e.currentTarget.style.borderColor = 'var(--border)'
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Navigation columns (7 cols) ──────────────────────── */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-6 sm:grid-cols-3">
              <FooterSection title="Categories" dotColor="var(--accent)">
                <ul className="space-y-2">
                  {CATEGORY_LINKS.map(item => (
                    <li key={item.label}>
                      <FooterLink to={item.to}>{item.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </FooterSection>

              <FooterSection title="Quick Links" dotColor="#FFFB08">
                <ul className="space-y-2">
                  {QUICK_LINKS.map(item => (
                    <li key={item.label} className="flex items-center gap-1.5">
                      <FooterLink to={item.to}>{item.label}</FooterLink>
                      {item.badge && (
                        <span
                          className="rounded-badge px-1.5 py-0.5 text-[9px] font-bold uppercase"
                          style={{
                            background: 'var(--accent-soft)',
                            color: 'var(--accent)',
                            border: '1px solid var(--accent-strong)',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </FooterSection>

              <FooterSection title="Company" dotColor="var(--success)" className="col-span-2 sm:col-span-1">
                <ul className="space-y-2">
                  {COMPANY_LINKS.map(item => (
                    <li key={item.label}>
                      <FooterLink to={item.to} isExternal={item.isExternal}>
                        {item.label}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </FooterSection>
            </div>
          </div>
        </div>
      </div>

      {/* ── Thin bottom bar ─────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'var(--header-bg)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {/* Same faint geo pattern */}
        <div className="footer-geo-pattern" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 py-3 text-[12px] md:flex-row sm:px-6 lg:px-8">
          {/* Left: org logo + copyright */}
          <div className="flex items-center gap-2">
            <SarkariEmblem size={20} />
            <span style={{ color: 'var(--text-muted)' }}>
              © {year}{' '}
              <span className="font-semibold" style={{ color: 'var(--text)' }}>
                Jharkhand JobAlert X
              </span>
              . All rights reserved.
            </span>
          </div>

          {/* Center: legal links */}
          <div className="flex flex-wrap items-center justify-center gap-3" style={{ color: 'var(--text-muted)' }}>
            {[
              { to: '/privacy',     label: 'Privacy'    },
              { to: '/terms',       label: 'Terms'      },
              { to: '/disclaimer',  label: 'Disclaimer' },
              { to: '/about',       label: 'About'      },
              { to: '/contact',     label: 'Contact'    },
            ].map((item, idx, arr) => (
              <span key={item.to} className="flex items-center gap-3">
                <Link
                  to={item.to}
                  className="transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  {item.label}
                </Link>
                {idx < arr.length - 1 && (
                  <span style={{ color: 'var(--border-strong)' }} aria-hidden="true">•</span>
                )}
              </span>
            ))}
          </div>

          {/* Right: trust badges */}
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-[11px] font-semibold"
              style={{
                background: 'var(--success-bg)',
                color: 'var(--success)',
                border: '1px solid color-mix(in srgb, var(--success) 20%, transparent)',
              }}
            >
              <ShieldCheck size={11} aria-hidden="true" />
              100% Free
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-[11px] font-semibold"
              style={{
                background: 'rgba(255,251,8,0.08)',
                color: '#c7c200',
                border: '1px solid rgba(255,251,8,0.2)',
              }}
            >
              <CheckCircle2 size={11} aria-hidden="true" />
              Verified
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
