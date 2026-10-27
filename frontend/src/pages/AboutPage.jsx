import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Users,
  Clock,
  Globe,
  Mail,
  Phone,
  CheckCircle2,
  MapPin,
  BookOpen,
  Search,
  Send,
  Youtube,
  Twitter,
  MessageCircle,
  AlertTriangle,
  FileText,
  Eye,
} from 'lucide-react'
import SEOHead from '../components/SEOHead.jsx'
import SarkariEmblem from '../components/SarkariEmblem.jsx'

// ── Authentic stats (verifiable, not inflated) ───────────────────────────────
const STATS = [
  { icon: MapPin,        label: 'Jharkhand Districts Covered', value: '24' },
  { icon: CheckCircle2, label: 'Verified Alerts Published',    value: '1,000+' },
  { icon: Clock,        label: 'Update Frequency',             value: 'Daily' },
  { icon: Globe,        label: 'Official Sources Monitored',   value: '15+' },
]

// ── Structured Data ──────────────────────────────────────────────────────────
const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Jharkhand JobAlert X',
  url: 'https://jharkhand.jobalertx.com/',
  logo: 'https://jharkhand.jobalertx.com/favicon.svg',
  description:
    "Jharkhand JobAlert X is Jharkhand's independent, free government and private recruitment portal covering JPSC, JSSC, Jharkhand Rojgar Mela, Teacher Vacancies, Police Recruitment, and Jharkhand High Court jobs.",
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'jobalerx365@gmail.com',
    telephone: '+91-8789862771',
    contactType: 'customer support',
    areaServed: 'IN-JH',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://t.me/jobalertx',
    'https://youtube.com/@jobalertx',
    'https://twitter.com/jobalertx',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://jharkhand.jobalertx.com/' },
    { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://jharkhand.jobalertx.com/about' },
  ],
}

// ── Community channels ───────────────────────────────────────────────────────
const CHANNELS = [
  {
    icon: <Send size={16} />,
    label: 'Telegram Channel',
    desc: 'Join for instant job alerts',
    href: 'https://t.me/jobalertx',
    color: '#2CA5E0',
  },
  {
    icon: <Youtube size={16} />,
    label: 'YouTube Channel',
    desc: 'Exam prep videos & guides',
    href: 'https://youtube.com/@jobalertx',
    color: '#FF0000',
  },
  {
    icon: <Twitter size={16} />,
    label: 'Twitter / X',
    desc: 'Breaking vacancy updates',
    href: 'https://twitter.com/jobalertx',
    color: '#1DA1F2',
  },
  {
    icon: <MessageCircle size={16} />,
    label: 'WhatsApp Channel',
    desc: 'Notifications on WhatsApp',
    href: 'https://whatsapp.com/channel/jobalertx',
    color: '#25D366',
  },
]

// ── Editorial workflow steps ─────────────────────────────────────────────────
const WORKFLOW = [
  {
    step: '01',
    icon: <Search size={18} />,
    title: 'Source Monitoring',
    desc: 'Our team monitors official government portals daily — jpsc.gov.in, jssc.nic.in, jhpolice.gov.in, rojgar.jharkhand.gov.in, jharkhand.gov.in — as well as the Jharkhand State Gazette and official press releases.',
  },
  {
    step: '02',
    icon: <Eye size={18} />,
    title: 'Cross-Verification',
    desc: 'Every notification is cross-checked against at least two official government sources before it is published. We verify vacancy count, eligibility criteria, age limit, application fee, and important dates against the official PDF notification.',
  },
  {
    step: '03',
    icon: <FileText size={18} />,
    title: 'Content Drafting',
    desc: 'A summary in plain English (and Hindi where applicable) is written, covering: eligible qualifications, category-wise vacancy breakdown, step-by-step application instructions, and selection procedure. Direct links to official PDFs are always included.',
  },
  {
    step: '04',
    icon: <CheckCircle2 size={18} />,
    title: 'Editorial Review & Publishing',
    desc: 'The draft is reviewed for factual accuracy, date correctness, and clarity before being published. Post-publication, notifications are monitored for corrigenda, date extensions, and court-ordered changes, which are reflected with an updated "Last Reviewed" timestamp.',
  },
  {
    step: '05',
    icon: <Clock size={18} />,
    title: 'Ongoing Updates & Corrections',
    desc: 'Admit card releases, exam schedules, result announcements, and answer key publications are tracked as follow-up alerts for the same exam. Corrections and errata from official sources are applied immediately and disclosed transparently.',
  },
]

export default function AboutPage() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
      <SEOHead
        title="About Us — Jharkhand JobAlert X | Jharkhand's #1 Verified Job Alert Portal"
        description="Learn about Jharkhand JobAlert X — an independent, 100% free employment notification portal for Jharkhand aspirants. Verified JPSC, JSSC, Rojgar Mela, Police, and private job updates with full editorial transparency."
        canonical="https://jharkhand.jobalertx.com/about"
        jsonLd={[aboutSchema, breadcrumbSchema]}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[12.5px] text-ink-faint flex-wrap">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-ink-muted">About Us</span>
      </nav>

      {/* Hero */}
      <header className="card p-8 text-center space-y-4">
        <div className="flex justify-center">
          <SarkariEmblem size={64} />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-ink">About Jharkhand JobAlert X</h1>
        <p className="text-[15px] leading-relaxed text-ink-soft max-w-xl mx-auto">
          Jharkhand's dedicated, independent government &amp; private job notification portal —
          delivering verified, accurate, and timely recruitment alerts to job seekers across all
          24 districts of Jharkhand since our founding.
        </p>
        {/* Independence disclaimer */}
        <div className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[12px] font-medium text-amber-700 dark:text-amber-400">
          <AlertTriangle size={13} />
          Independent portal — not affiliated with any government agency. 100% free for all candidates.
        </div>
      </header>

      {/* Stats — authentic, verifiable figures only */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-4 text-center space-y-1">
            <Icon size={22} className="mx-auto text-brand-600" />
            <p className="text-xl font-extrabold text-ink">{value}</p>
            <p className="text-[12px] text-ink-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Our Mission for Jharkhand</h2>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          Jharkhand JobAlert X was established with the specific objective of empowering youth across
          Jharkhand — from Ranchi, Dhanbad, and Jamshedpur to rural and tribal areas of Palamau,
          Sahebganj, and Khunti. We bridge the gap between job seekers and recruitment opportunities
          by aggregating JPSC, JSSC, District Rojgar Mela camps, Jharkhand Police Bharti, teacher
          vacancy notifications, and leading industrial private vacancies into one fast, easy-to-use,
          100% free platform.
        </p>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          Every alert is authenticated against official state gazettes, government notices, and corporate
          press releases. We always provide direct links to official notification PDFs and application
          forms — we never copy content without attribution or proper source citation.
        </p>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          <strong className="text-ink">Editorial Independence:</strong> Jharkhand JobAlert X is an
          entirely independent digital media portal. We are not affiliated with, endorsed by, or
          operated by any Jharkhand government agency, JPSC, JSSC, or any other public authority.
          All content is published independently for informational purposes only.
        </p>
      </section>

      {/* Editorial Workflow */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">How We Verify &amp; Publish Notifications</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Our five-step editorial process ensures every notification is accurate, timely, and trustworthy.
          </p>
        </div>
        <ol className="space-y-5" aria-label="Editorial workflow steps">
          {WORKFLOW.map(({ step, icon, title, desc }) => (
            <li key={step} className="flex gap-4">
              <div className="shrink-0 flex flex-col items-center gap-1">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  {icon}
                </span>
                <span className="text-[10px] font-bold text-ink-faint">{step}</span>
              </div>
              <div className="min-w-0 pt-1">
                <h3 className="text-[14px] font-bold text-ink">{title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* What we cover */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Recruitment Sectors We Cover</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'JPSC Combined Civil Services (Prelims & Mains)',
            'JPSC CDPO, Medical Officer & Engineering Services',
            'JSSC CGL (JGGLCCE) & Secretariat Assistant Posts',
            'JSSC Excise Constable (JECCE) & SI Bharti',
            'Jharkhand Police Constable & Sub-Inspector',
            'Jharkhand Teacher (PRT, TGT, PGT) Vacancies',
            'Jharkhand High Court Recruitment',
            'District Rojgar Mela & Placement Camps (JSLPS)',
            'Jharkhand Private Jobs (Tata, Jindal, Mining)',
            'Central Government & Railway (RRB Ranchi zone)',
            'Admit Cards, Results, Answer Keys & Syllabus',
            'Jharkhand Board (JAC) Exam Notifications',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-[13.5px] text-ink-soft">
              <CheckCircle2 size={14} className="text-teal-600 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Sources we monitor */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Official Sources We Monitor</h2>
        <p className="text-[13.5px] text-ink-soft">
          We directly monitor the following official Jharkhand government portals for new notifications,
          corrigenda, exam schedule updates, and admit card / result releases:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: 'JPSC Official Portal',            href: 'https://www.jpsc.gov.in' },
            { label: 'JSSC Official Portal',            href: 'https://jssc.nic.in' },
            { label: 'Jharkhand Police (jhpolice.gov.in)', href: 'https://www.jhpolice.gov.in' },
            { label: 'Jharkhand Rojgar Portal',         href: 'https://rojgar.jharkhand.gov.in' },
            { label: 'Jharkhand Govt (jharkhand.gov.in)', href: 'https://www.jharkhand.gov.in' },
            { label: 'JAC Board (jac.jharkhand.gov.in)', href: 'https://jac.jharkhand.gov.in' },
            { label: 'Jharkhand High Court',            href: 'https://jharkhandhighcourt.nic.in' },
            { label: 'JSLPS (Rural Livelihood)',        href: 'https://www.jslps.in' },
          ].map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[13px] text-brand-600 hover:underline dark:text-brand-400"
              >
                <Globe size={12} className="shrink-0" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Community channels */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Our Community Channels</h2>
        <p className="text-[13.5px] text-ink-soft">
          Stay connected for instant job alerts, exam date reminders, and preparation resources:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CHANNELS.map(({ icon, label, desc, href, color }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-hairline bg-surface px-4 py-3 text-sm transition-all hover:border-brand-500/30 hover:bg-subtle"
            >
              <span style={{ color }} className="shrink-0">{icon}</span>
              <div>
                <p className="text-[13px] font-bold text-ink">{label}</p>
                <p className="text-[11.5px] text-ink-muted">{desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Editorial policy summary */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Editorial &amp; Correction Policy</h2>
        <div className="space-y-3 text-[14px] leading-relaxed text-ink-soft">
          <p>
            <strong className="text-ink">Transparency First:</strong> If a notification contains an
            error, a correction notice is published immediately with a clear explanation of what
            changed and when. We do not silently update posts without disclosure.
          </p>
          <p>
            <strong className="text-ink">No Paid Listings:</strong> Jharkhand JobAlert X does not
            accept payment to publish or prioritize any recruitment notification. All job alerts are
            published based solely on their relevance to Jharkhand job seekers.
          </p>
          <p>
            <strong className="text-ink">100% Free for Candidates:</strong> Jharkhand JobAlert X
            does not charge applicants any fees for viewing notifications, downloading syllabi, or
            accessing study resources. Our service will always remain free for candidates.
          </p>
          <p>
            <strong className="text-ink">Direct Source Links Always Provided:</strong> Every post
            includes a direct link to the official notification PDF and/or the official application
            portal. We never ask candidates to apply through us.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Contact the Jharkhand JobAlert X Team</h2>
        <p className="text-[13.5px] text-ink-soft">
          Have a question, found an error in a notification, or want to report a missing vacancy?
          Reach out directly:
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:jobalerx365@gmail.com"
            className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2.5 text-sm font-medium text-ink-soft hover:text-ink hover:border-brand-500/40 transition-colors"
          >
            <Mail size={16} className="text-brand-600" />
            jobalerx365@gmail.com
          </a>
          <a
            href="tel:+918789862771"
            className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2.5 text-sm font-medium text-ink-soft hover:text-ink hover:border-brand-500/40 transition-colors"
          >
            <Phone size={16} className="text-teal-600" />
            +91 8789862771
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:brightness-110 transition-all"
          >
            Send a Message →
          </Link>
        </div>
      </section>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 text-[12px] text-ink-faint flex-wrap py-2">
        <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-500" /> 100% Free Service</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-yellow-400" /> Verified Sources Only</span>
        <span className="flex items-center gap-1.5"><MapPin size={13} className="text-teal-500" /> All 24 Jharkhand Districts</span>
        <span className="flex items-center gap-1.5"><BookOpen size={13} className="text-brand-500" /> Independent Editorial</span>
      </div>
    </div>
  )
}
