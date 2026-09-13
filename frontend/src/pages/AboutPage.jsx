import { Link } from 'react-router-dom'
import { ShieldCheck, Users, Clock, Globe, Mail, Phone, CheckCircle2, MapPin } from 'lucide-react'
import SEOHead from '../components/SEOHead.jsx'
import SarkariEmblem from '../components/SarkariEmblem.jsx'

const STATS = [
  { icon: MapPin, label: 'Jharkhand Districts', value: '24' },
  { icon: Users, label: 'Daily Aspirants', value: '15K+' },
  { icon: CheckCircle2, label: 'Verified Alerts', value: '1,000+' },
  { icon: Clock, label: 'Updates Frequency', value: 'Daily' },
]

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Jharkhand JobAlert X',
  url: 'https://jharkhand.jobalertx.com/',
  logo: 'https://jharkhand.jobalertx.com/favicon.svg',
  description:
    'Jharkhand JobAlert X is Jharkhand\'s premier government and private recruitment portal covering JPSC, JSSC, Jharkhand Rojgar Mela, Teacher Vacancies, Police Recruitment, and Corporate openings.',
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
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jharkhand.jobalertx.com/' },
    { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://jharkhand.jobalertx.com/about' },
  ],
}

export default function AboutPage() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
      <SEOHead
        title="About Us — Jharkhand JobAlert X | Jharkhand's #1 Job Alert Portal"
        description="Learn about Jharkhand JobAlert X — the leading employment notification portal dedicated to Jharkhand aspirants. Get verified JPSC, JSSC, Rojgar Mela, and private job updates."
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
          Jharkhand's dedicated government &amp; private job notification portal — delivering verified,
          speedy, and comprehensive recruitment alerts to job seekers across all 24 districts of Jharkhand.
        </p>
      </header>

      {/* Stats row */}
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
          Jharkhand — from Ranchi, Dhanbad, and Jamshedpur to rural and tribal areas. We bridge the
          gap between job seekers and recruitment opportunities by aggregating JPSC, JSSC, District
          Rojgar Mela camps, and leading industrial private vacancies into one fast, easy-to-use platform.
        </p>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          Every alert is authenticated against official state gazettes, government notices, or corporate
          press releases. We always provide direct links to official notification PDFs and application forms.
        </p>
      </section>

      {/* What we cover */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Recruitment Sectors We Cover</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'JPSC Combined Civil Services (Prelims & Mains)',
            'JPSC CDPO, Medical Officer & Engineers',
            'JSSC CGL (JGGLCCE) & Secretariat Posts',
            'JSSC Excise Constable & Police Bharti',
            'Jharkhand Teacher (PRT, TGT, PGT)',
            'Jharkhand District Rojgar Mela & Placement Fairs',
            'Jharkhand Private Jobs (Tata Steel, Jindal, Mining)',
            'Central Government & Railway (RRB Ranchi)',
            'Admit Cards, Results, Answer Keys & Syllabus',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-[13.5px] text-ink-soft">
              <CheckCircle2 size={14} className="text-teal-600 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Editorial policy */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Editorial &amp; Verification Policy</h2>
        <div className="space-y-3 text-[14px] leading-relaxed text-ink-soft">
          <p>
            <strong className="text-ink">Direct Source Verification:</strong> Every notification is cross-referenced
            with official portals (jpsc.gov.in, jssc.nic.in, rojgar.jharkhand.gov.in) before listing.
          </p>
          <p>
            <strong className="text-ink">Complete Transparency:</strong> Clear details on eligibility, reservation
            rules for Jharkhand domiciles, age limits, application fees, and deadlines are summarized in plain language.
          </p>
          <p>
            <strong className="text-ink">100% Free Access:</strong> Jharkhand JobAlert X does not charge applicants
            any fees for viewing notifications or accessing study resources.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Contact the Jharkhand Team</h2>
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
            Send a Message
          </Link>
        </div>
      </section>

      {/* Trust */}
      <div className="flex items-center justify-center gap-6 text-[12px] text-ink-faint flex-wrap py-2">
        <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-500" /> 100% Free Service</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-[#FFFB08]" /> Verified Sources</span>
        <span className="flex items-center gap-1.5"><MapPin size={13} className="text-teal-500" /> 24 Jharkhand Districts</span>
      </div>
    </div>
  )
}
