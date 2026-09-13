import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Briefcase,
  Ticket,
  Award,
  FileText,
  Layers,
  Sparkles,
  ExternalLink,
  Download,
  Globe,
  Link as LinkIcon,
  UploadCloud,
  FileCheck,
  Paperclip,
  X,
  File,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchJobById, createJob, updateJob, getCategories, uploadPdfDoc } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'
import BlogRichEditor from '../components/BlogRichEditor.jsx'
import RichContentRenderer from '../components/RichContentRenderer.jsx'

// Static kind labels (mirrors server /api/kinds)
const KIND_LABELS = {
  job: 'Latest Jobs',
  'admit-card': 'Admit Cards',
  result: 'Results',
  'answer-key': 'Answer Keys',
  syllabus: 'Syllabus',
}

const KIND_ACTION_CONFIG = {
  job: {
    applyLabel: 'Apply Online Portal URL',
    applyPlaceholder: 'https://example.gov.in/apply-online',
    applyBtnText: 'Apply Online',
    pdfLabel: 'Official Notification (PDF Attachment URL)',
    pdfPlaceholder: 'https://example.gov.in/documents/notification.pdf',
    pdfBtnText: 'Download Notification (PDF)',
  },
  'admit-card': {
    applyLabel: 'Admit Card Download Portal URL',
    applyPlaceholder: 'https://example.gov.in/download-admit-card',
    applyBtnText: 'Download Admit Card',
    pdfLabel: 'Exam Instructions / Notice (PDF Attachment URL)',
    pdfPlaceholder: 'https://example.gov.in/documents/exam-notice.pdf',
    pdfBtnText: 'Download Exam Notice (PDF)',
  },
  result: {
    applyLabel: 'Result / Score Card Portal URL',
    applyPlaceholder: 'https://example.gov.in/check-result',
    applyBtnText: 'Check Result',
    pdfLabel: 'Merit List / Cutoff (PDF Attachment URL)',
    pdfPlaceholder: 'https://example.gov.in/documents/merit-list.pdf',
    pdfBtnText: 'Download Merit List (PDF)',
  },
  'answer-key': {
    applyLabel: 'Answer Key & Objection Portal URL',
    applyPlaceholder: 'https://example.gov.in/answer-key-portal',
    applyBtnText: 'Download Answer Key',
    pdfLabel: 'Answer Key / Notice (PDF Attachment URL)',
    pdfPlaceholder: 'https://example.gov.in/documents/official-answer-key.pdf',
    pdfBtnText: 'Download Answer Key (PDF)',
  },
  syllabus: {
    applyLabel: 'Syllabus & Exam Pattern Portal URL',
    applyPlaceholder: 'https://example.gov.in/exam-scheme',
    applyBtnText: 'View Exam Pattern',
    pdfLabel: 'Official Syllabus (PDF Attachment URL)',
    pdfPlaceholder: 'https://example.gov.in/documents/syllabus.pdf',
    pdfBtnText: 'Download Syllabus (PDF)',
  },
}

const DEFAULT_FORM = {
  title: '',
  org: 'Jharkhand Public Service Commission (JPSC)',
  orgShort: 'JPSC',
  category: 'jpsc',
  kind: 'job',
  tagline: '',
  shortInfo: '',
  detailedDescription: '',
  salary: '',
  applyUrl: '',
  notificationPdfUrl: '',
  officialWebsiteUrl: 'https://jpsc.gov.in',
  eligibility: '',
  vacancies: '',
  postedOn: '',
  featured: false,
  inTicker: false,
  importantDates: [
    { label: 'Application Start', value: 'Today' },
    { label: 'Last Date to Apply', value: '30 Days' },
  ],
  fee: [
    { label: 'General / OBC / EWS', value: '₹100' },
    { label: 'SC / ST / PH', value: '₹0' },
  ],
  ageLimit: { min: 21, max: 35, note: 'Age relaxation applicable for Jharkhand reserved categories.' },
  posts: [{ name: '', total: '', eligibility: '' }],
  links: [{ label: 'Apply Online', href: '#', primary: true }],
}

export default function AdminPostForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { token } = useAuth()

  const [form, setForm] = useState(DEFAULT_FORM)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [previewTab, setPreviewTab] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type.includes('pdf')
    if (!isPdf) {
      alert('Please upload a PDF document (.pdf).')
      return
    }
    setUploadingPdf(true)
    setError('')
    try {
      const res = await uploadPdfDoc(token, file)
      if (res && res.url) {
        setForm((prev) => ({
          ...prev,
          notificationPdfUrl: res.url,
        }))
        setSuccess(`Official PDF "${file.name}" uploaded and attached successfully!`)
        setTimeout(() => setSuccess(''), 4000)
      }
    } catch (err) {
      setError(err.message || 'Failed to upload PDF file.')
    } finally {
      setUploadingPdf(false)
      // reset file input
      if (e.target) e.target.value = ''
    }
  }

  const handleRemovePdf = () => {
    setForm((prev) => ({ ...prev, notificationPdfUrl: '' }))
  }

  // Fetch categories for dropdowns
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    fetchJobById(id)
      .then((data) => {
        if (data) {
          setForm({
            ...DEFAULT_FORM,
            ...data,
            vacancies: data.vacancies ? String(data.vacancies) : '',
            importantDates: Array.isArray(data.importantDates) && data.importantDates.length ? data.importantDates : DEFAULT_FORM.importantDates,
            fee: Array.isArray(data.fee) && data.fee.length ? data.fee : DEFAULT_FORM.fee,
            ageLimit: data.ageLimit || DEFAULT_FORM.ageLimit,
            posts: Array.isArray(data.posts) && data.posts.length ? data.posts : DEFAULT_FORM.posts,
            links: Array.isArray(data.links) && data.links.length ? data.links : DEFAULT_FORM.links,
          })
        } else {
          setError('Post not found in database.')
        }
      })
      .catch(() => {
        setError('Failed to load post data. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const setField = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Dynamic Array Handlers
  const handleArrayChange = (arrayKey, index, field, value) => {
    setForm((prev) => {
      const list = [...prev[arrayKey]]
      list[index] = { ...list[index], [field]: value }
      return { ...prev, [arrayKey]: list }
    })
  }

  const handleArrayAdd = (arrayKey, emptyObj) => {
    setForm((prev) => ({
      ...prev,
      [arrayKey]: [...prev[arrayKey], emptyObj],
    }))
  }

  const handleArrayRemove = (arrayKey, index) => {
    setForm((prev) => ({
      ...prev,
      [arrayKey]: prev[arrayKey].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.org.trim()) {
      setError('Please provide at least a post Title and Organisation.')
      return
    }

    // SEO quality warning: detailedDescription is strongly recommended
    if (!form.detailedDescription || form.detailedDescription.replace(/<[^>]*>/g, '').trim().length < 200) {
      const proceed = window.confirm(
        '⚠️ SEO WARNING: The Detailed Description field is empty or too short (< 200 characters of text).\n\n' +
        'Google is VERY UNLIKELY to index this page without sufficient content.\n\n' +
        'Click OK to publish anyway, or Cancel to go back and fill the description.'
      )
      if (!proceed) return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      ...form,
      vacancies: form.vacancies ? Number(form.vacancies) : null,
    }

    try {
      if (isEdit) {
        await updateJob(token, id, payload)
        setSuccess('Notification updated successfully!')
      } else {
        const created = await createJob(token, payload)
        setSuccess('Notification created and published live!')
        setTimeout(() => navigate(`/admin/posts/${created.id || ''}`), 1200)
      }
    } catch (err) {
      setError(err.message || 'Failed to save post.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SEOHead title={`${isEdit ? 'Edit Post' : 'Create New Post'} | Job Alert X Admin`} />

      {/* Top action bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/posts"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-hairline bg-surface text-ink-muted transition-colors hover:bg-subtle hover:text-ink shadow-xs"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
              {isEdit ? 'Edit Notification' : 'Create Notification'}
            </h1>
            <p className="mt-0.5 text-xs text-ink-muted">
              {isEdit ? `Updating post ID: ${id} on Job Alert X` : 'Fill in the official details to publish live on Job Alert X.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPreviewTab(!previewTab)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-surface px-4 py-2.5 text-xs font-semibold text-ink-soft shadow-xs transition-colors hover:bg-subtle hover:text-ink"
          >
            <Eye size={15} />
            {previewTab ? 'Hide Preview' : 'Live Preview'}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-teal-600 to-navy-800 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-600/30 transition-all hover:brightness-110 disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Live'}
          </button>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3.5 text-xs font-medium text-emerald-600 dark:text-emerald-300 animate-fade-in shadow-xs">
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3.5 text-xs font-medium text-red-600 dark:text-red-300 animate-fade-in shadow-xs">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Main Grid: Form + Optional Live Preview */}
      <div className={`grid grid-cols-1 gap-6 ${previewTab ? 'lg:grid-cols-2' : ''}`}>
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Basic Information */}
          <div className="card p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-ink flex items-center gap-2 border-b border-hairline pb-3">
              <Sparkles size={16} className="text-orange-500" />
              General Details
            </h2>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Notification Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={setField('title')}
                placeholder="e.g. SSC CGL 2026 Recruitment Online Form"
                className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Organisation / Board *</label>
                <input
                  type="text"
                  required
                  value={form.org}
                  onChange={setField('org')}
                  placeholder="e.g. Staff Selection Commission"
                  className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Short Name</label>
                <input
                  type="text"
                  value={form.orgShort || ''}
                  onChange={setField('orgShort')}
                  placeholder="e.g. SSC"
                  className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Category</label>
                <select
                  value={form.category}
                  onChange={setField('category')}
                  className="w-full rounded-xl border border-hairline bg-surface py-2.5 px-3.5 text-xs font-medium text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} — {c.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Classification Type</label>
                <select
                  value={form.kind}
                  onChange={setField('kind')}
                  className="w-full rounded-xl border border-hairline bg-surface py-2.5 px-3.5 text-xs font-medium text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  {Object.entries(KIND_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Total Vacancies</label>
                <input
                  type="number"
                  value={form.vacancies}
                  onChange={setField('vacancies')}
                  placeholder="e.g. 17727"
                  className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Posted On String</label>
                <input
                  type="text"
                  value={form.postedOn || ''}
                  onChange={setField('postedOn')}
                  placeholder="e.g. 24 Aug 2026"
                  className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Tagline / Highlight</label>
              <input
                type="text"
                value={form.tagline || ''}
                onChange={setField('tagline')}
                placeholder="e.g. 17,727 Posts Available — Apply Online Now"
                className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Short Overview / Summary</label>
              <textarea
                rows={3}
                value={form.shortInfo || ''}
                onChange={setField('shortInfo')}
                placeholder="Brief summary of eligibility, vacancies, and key dates shown on the post page and cards..."
                className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <Sparkles size={14} className="text-brand-500" />
                    Detailed Blog &amp; Notification Description
                  </label>
                  <p className="text-[11px] text-ink-faint mt-0.5">
                    Add full blogs with headings, bold/italic, custom tables, images, notices, and lists.
                  </p>
                </div>
              </div>
              <BlogRichEditor
                value={form.detailedDescription || ''}
                onChange={(html) => setForm((prev) => ({ ...prev, detailedDescription: html }))}
                token={token}
              />
            </div>

            {/* Visibility / Display Options */}
            <div className="space-y-3 pt-3 border-t border-hairline">
              <p className="text-xs font-bold text-ink uppercase tracking-wider">Promotion &amp; Highlights</p>
              
              <div className="flex items-start gap-3 rounded-xl border border-hairline bg-subtle/40 p-3">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={form.featured || false}
                  onChange={setField('featured')}
                  className="mt-0.5 h-4 w-4 rounded border-hairline text-orange-500 focus:ring-orange-400"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-semibold text-ink cursor-pointer">
                  <span>🔥 Feature in Homepage Carousel ("Trending This Week")</span>
                  <span className="block font-normal text-[11px] text-ink-muted mt-0.5">
                    Displays this notification prominently on the main top sliding carousel.
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-hairline bg-subtle/40 p-3">
                <input
                  type="checkbox"
                  id="inticker-checkbox"
                  checked={form.inTicker || false}
                  onChange={setField('inTicker')}
                  className="mt-0.5 h-4 w-4 rounded border-hairline text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="inticker-checkbox" className="text-xs font-semibold text-ink cursor-pointer">
                  <span>⚡ Display in Header Moving Ticker ("Live Updates Bar")</span>
                  <span className="block font-normal text-[11px] text-ink-muted mt-0.5">
                    Animates continuously across the top header bar with a direct link.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Direct Action Links & Official Attachments */}
          <div className="card p-5 sm:p-6 space-y-4">
            <div className="border-b border-hairline pb-3">
              <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                <Download size={16} className="text-orange-500" />
                Direct Action Links &amp; Official Downloads
              </h2>
              <p className="mt-0.5 text-[11.5px] text-ink-muted">
                Provide live portal URLs and downloadable official PDF attachments for this {KIND_LABELS[form.kind] || 'notification'}.
              </p>
            </div>

            {/* Primary Action Link (e.g. Apply Online / Check Result / Download Admit Card) */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
                  <ExternalLink size={13} className="text-brand-600" />
                  {KIND_ACTION_CONFIG[form.kind]?.applyLabel || 'Apply Online Portal URL'}
                </label>
                {form.applyUrl && (
                  <a
                    href={form.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:underline"
                  >
                    Test Link <ExternalLink size={10} />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={form.applyUrl || ''}
                onChange={setField('applyUrl')}
                placeholder={KIND_ACTION_CONFIG[form.kind]?.applyPlaceholder || 'https://example.gov.in/apply'}
                className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <p className="mt-1 text-[11px] text-ink-faint">
                Users will see a prominent "{KIND_ACTION_CONFIG[form.kind]?.applyBtnText || 'Apply Online'}" button taking them directly to this link.
              </p>
            </div>

            {/* Official Notification PDF Attachment */}
            <div className="rounded-xl border border-hairline bg-subtle/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-bold text-ink">
                  <Download size={14} className="text-red-500" />
                  {KIND_ACTION_CONFIG[form.kind]?.pdfLabel || 'Official Notification PDF Attachment'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
                >
                  <LinkIcon size={11} />
                  {showUrlInput ? 'Attach via File Upload' : 'Enter direct URL instead'}
                </button>
              </div>

              {/* Uploaded / Attached PDF Status Card */}
              {form.notificationPdfUrl ? (
                <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                      <FileCheck size={16} />
                    </div>
                    <div className="truncate">
                      <p className="font-bold truncate text-xs">
                        {form.notificationPdfUrl.startsWith('/uploads') ? 'Attached Local PDF Document' : 'Attached Online PDF Document'}
                      </p>
                      <p className="text-[10px] text-ink-muted truncate max-w-xs sm:max-w-md font-mono">
                        {form.notificationPdfUrl}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={form.notificationPdfUrl.startsWith('http') ? form.notificationPdfUrl : `http://localhost:4000${form.notificationPdfUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-hairline text-ink text-[11px] font-bold shadow-2xs hover:bg-subtle transition-colors"
                    >
                      <Eye size={12} className="text-blue-500" /> View / Test
                    </a>
                    <button
                      type="button"
                      onClick={handleRemovePdf}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors"
                      title="Remove PDF attachment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Upload Dropzone / Button */}
              {!showUrlInput ? (
                <div>
                  <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-hairline rounded-xl p-4 cursor-pointer hover:border-brand-500 hover:bg-brand-500/5 transition-all group">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileUpload}
                      disabled={uploadingPdf}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform mb-2">
                        {uploadingPdf ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                        ) : (
                          <UploadCloud size={20} />
                        )}
                      </div>
                      <span className="text-xs font-bold text-ink group-hover:text-brand-600 transition-colors">
                        {uploadingPdf ? 'Uploading Document…' : 'Click to Upload PDF or Drag & Drop'}
                      </span>
                      <span className="text-[11px] text-ink-muted mt-0.5">
                        Supports official notification, exam notice or syllabus PDF (Max 35 MB)
                      </span>
                    </div>
                  </label>
                </div>
              ) : (
                /* Or direct URL input */
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft">
                    <Paperclip size={12} /> Direct PDF Web Link
                  </div>
                  <input
                    type="url"
                    value={form.notificationPdfUrl || ''}
                    onChange={setField('notificationPdfUrl')}
                    placeholder={KIND_ACTION_CONFIG[form.kind]?.pdfPlaceholder || 'https://example.gov.in/documents/notification.pdf'}
                    className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono"
                  />
                </div>
              )}

              <p className="text-[11px] text-ink-faint">
                Users will see a dedicated "{KIND_ACTION_CONFIG[form.kind]?.pdfBtnText || 'Download Official PDF'}" button on the notification page.
              </p>
            </div>

            {/* Official Website URL */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
                  <Globe size={13} className="text-blue-500" />
                  Official Authority Website URL
                </label>
                {form.officialWebsiteUrl && (
                  <a
                    href={form.officialWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Visit Website <ExternalLink size={10} />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={form.officialWebsiteUrl || ''}
                onChange={setField('officialWebsiteUrl')}
                placeholder="e.g. https://ssc.gov.in or https://upsc.gov.in"
                className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Card 2: Important Dates */}
          <div className="card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h2 className="text-sm font-bold text-ink">Important Dates</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('importantDates', { label: '', value: '' })}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                <Plus size={14} /> Add Date
              </button>
            </div>

            {form.importantDates.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleArrayChange('importantDates', idx, 'label', e.target.value)}
                  placeholder="Date Label (e.g. Admit Card Available)"
                  className="flex-1 rounded-xl border border-hairline bg-page px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
                />
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => handleArrayChange('importantDates', idx, 'value', e.target.value)}
                  placeholder="Value (e.g. 15 Sep 2026)"
                  className="flex-1 rounded-xl border border-hairline bg-page px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('importantDates', idx)}
                  className="rounded-lg p-2 text-ink-faint hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-300 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Card 3: Application Fee */}
          <div className="card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h2 className="text-sm font-bold text-ink">Application Fee</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('fee', { label: '', value: '' })}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                <Plus size={14} /> Add Category Fee
              </button>
            </div>

            {form.fee.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleArrayChange('fee', idx, 'label', e.target.value)}
                  placeholder="Fee Category (e.g. SC / ST / PH)"
                  className="flex-1 rounded-xl border border-hairline bg-page px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
                />
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => handleArrayChange('fee', idx, 'value', e.target.value)}
                  placeholder="Amount (e.g. ₹0 / Exempted)"
                  className="flex-1 rounded-xl border border-hairline bg-page px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('fee', idx)}
                  className="rounded-lg p-2 text-ink-faint hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-300 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Card 4: Official Important Links */}
          <div className="card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h2 className="text-sm font-bold text-ink">Official Links</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('links', { label: '', href: '#', primary: false })}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                <Plus size={14} /> Add Link
              </button>
            </div>

            {form.links.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleArrayChange('links', idx, 'label', e.target.value)}
                  placeholder="Link Title (e.g. Apply Online)"
                  className="flex-1 rounded-xl border border-hairline bg-page px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
                />
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => handleArrayChange('links', idx, 'href', e.target.value)}
                  placeholder="URL Destination"
                  className="flex-1 rounded-xl border border-hairline bg-page px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('links', idx)}
                  className="rounded-lg p-2 text-ink-faint hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-300 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Bottom Save Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/admin/posts"
              className="rounded-xl border border-hairline bg-surface px-5 py-2.5 text-xs font-semibold text-ink-soft hover:bg-subtle hover:text-ink shadow-xs"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:brightness-110 disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? 'Saving…' : isEdit ? 'Update Notification' : 'Publish Notification'}
            </button>
          </div>
        </form>

        {/* Live Card Preview Column */}
        {previewTab && (
          <div className="space-y-4">
            <div className="sticky top-24 card p-5 sm:p-6">
              <h2 className="text-sm font-bold text-ink flex items-center justify-between border-b border-hairline pb-3 mb-4">
                <span>Live Card Preview</span>
                <span className="text-[11px] text-orange-500 font-semibold">Real-time render</span>
              </h2>

              <div className="card p-5 border border-hairline bg-subtle/30 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block rounded-md border border-hairline bg-surface px-2 py-0.5 text-[10.5px] font-bold text-ink-soft uppercase shadow-xs">
                      {form.category} • {KIND_LABELS[form.kind] || form.kind}
                    </span>
                    <h3 className="mt-2 text-base font-extrabold text-ink">{form.title || 'Untitled Notification'}</h3>
                    <p className="mt-0.5 text-xs text-ink-muted">{form.org || 'Organisation Name'}</p>
                  </div>
                  {form.vacancies && (
                    <div className="text-right">
                      <span className="text-[11px] text-ink-faint block">Vacancies</span>
                      <span className="text-base font-extrabold text-orange-500 tabular-nums">
                        {Number(form.vacancies).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                {form.shortInfo && (
                  <div className="mt-3 border-t border-hairline pt-3">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink-faint">Overview</span>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft line-clamp-2">
                      {form.shortInfo}
                    </p>
                  </div>
                )}

                {form.detailedDescription && (
                  <div className="mt-2.5 rounded-lg border border-hairline bg-surface/60 p-2.5 max-h-56 overflow-y-auto">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
                      Detailed Blog Content
                    </span>
                    <RichContentRenderer content={form.detailedDescription} className="text-xs line-clamp-6" />
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-3">
                  <span className="text-[11px] text-ink-muted">Posted: {form.postedOn || 'Just now'}</span>
                  <div className="flex items-center gap-1.5">
                    {form.notificationPdfUrl && (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-600 dark:text-red-300">
                        <Download size={12} />
                        PDF Notice
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-xs">
                      {KIND_ACTION_CONFIG[form.kind]?.applyBtnText || 'Apply Online'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
