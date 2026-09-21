// ---------------------------------------------------------------------------
// AdminArticleForm — Full visual & rich editor for writing career articles
// ---------------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Save,
  ArrowLeft,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  UploadCloud,
  X,
  Link as LinkIcon,
  Tag,
  Clock,
  User,
  Image as ImageIcon,
  Check,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import {
  getArticleBySlug,
  createArticle,
  updateArticle,
  fetchAdminArticles,
} from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'
import BlogRichEditor from '../components/BlogRichEditor.jsx'
import RichContentRenderer from '../components/RichContentRenderer.jsx'
import { CATEGORY_BADGES } from '../data/articleCategories.js'

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const DEFAULT_ARTICLE_FORM = {
  title: '',
  slug: '',
  category: 'how-to-apply',
  excerpt: '',
  content: '',
  coverImage: '',
  author: 'Job Alert X Editorial Team',
  authorRole: 'Govt Career & Exam Specialist',
  readTime: '5 min read',
  tags: ['Career Guide', 'Govt Jobs'],
  status: 'published',
  featured: false,
  metaTitle: '',
  metaDescription: '',
}

export default function AdminArticleForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { token } = useAuth()

  const [form, setForm] = useState(DEFAULT_ARTICLE_FORM)
  const [tagInput, setTagInput] = useState('Career Guide, Govt Jobs')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [previewTab, setPreviewTab] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Load existing article for edit
  useEffect(() => {
    if (!isEdit) return
    setLoading(true)

    // Can fetch by ID or slug
    getArticleBySlug(id)
      .then((res) => {
        const article = res?.article || res
        if (article && article.title) {
          setForm({
            ...DEFAULT_ARTICLE_FORM,
            ...article,
            tags: Array.isArray(article.tags) ? article.tags : [],
          })
          setTagInput(Array.isArray(article.tags) ? article.tags.join(', ') : '')
          setSlugManuallyEdited(true)
        } else {
          setError('Article not found.')
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load article.')
      })
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const setField = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'title' && !slugManuallyEdited && !isEdit) {
        next.slug = slugify(value)
      }
      return next
    })
  }

  const handleSlugChange = (e) => {
    setSlugManuallyEdited(true)
    setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))
  }

  const handleTagsChange = (e) => {
    const raw = e.target.value
    setTagInput(raw)
    const parsed = raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    setForm((prev) => ({ ...prev, tags: parsed }))
  }

  // Cover image upload via API
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP).')
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const res = await fetch(`${API_BASE}/api/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to upload cover image')

      const imgUrl = data.url.startsWith('http') ? data.url : `${API_BASE}${data.url}`
      setForm((prev) => ({ ...prev, coverImage: imgUrl }))
      setSuccess('Cover image uploaded successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to upload cover image.')
    } finally {
      setUploadingImage(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Please provide an article title.')
      return
    }

    if (!form.content || form.content.replace(/<[^>]*>/g, '').trim().length < 50) {
      setError('Please add body content for the article.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      ...form,
      title: form.title.trim(),
      slug: form.slug ? slugify(form.slug) : slugify(form.title),
      metaTitle: form.metaTitle || form.title.trim(),
      metaDescription: form.metaDescription || form.excerpt || '',
    }

    try {
      if (isEdit) {
        await updateArticle(token, id, payload)
        setSuccess('Article updated successfully!')
      } else {
        const created = await createArticle(token, payload)
        setSuccess('Article published successfully!')
        setTimeout(() => navigate('/admin/articles'), 1200)
      }
    } catch (err) {
      setError(err.message || 'Failed to save article.')
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
    <div className="space-y-6 animate-fade-in pb-16">
      <SEOHead title={`${isEdit ? 'Edit Article' : 'Write New Article'} | Admin`} />

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/articles"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-hairline bg-surface text-ink-muted hover:bg-subtle hover:text-ink shadow-xs"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-ink">
              {isEdit ? 'Edit Article' : 'Write New Article'}
            </h1>
            <p className="text-xs text-ink-muted mt-0.5">
              {isEdit ? `Updating: ${form.title}` : 'Compose and publish a career guide, walkthrough, or exam strategy.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPreviewTab(!previewTab)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-surface px-4 py-2.5 text-xs font-semibold text-ink-soft hover:bg-subtle shadow-xs"
          >
            <Eye size={15} />
            {previewTab ? 'Hide Preview' : 'Live Preview'}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/30 hover:brightness-110 disabled:opacity-60 transition-all"
          >
            <Save size={16} />
            {saving ? 'Saving…' : isEdit ? 'Update Article' : 'Publish Article'}
          </button>
        </div>
      </div>

      {/* Notifications */}
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

      {/* Grid: Form + Live Preview */}
      <div className={`grid grid-cols-1 gap-6 ${previewTab ? 'lg:grid-cols-2' : ''}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Main details */}
          <div className="card p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-ink flex items-center gap-2 border-b border-hairline pb-3">
              <Sparkles size={16} className="text-teal-500" />
              General Article Information
            </h2>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-soft">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={setField('title')}
                placeholder="e.g. How to Apply for JSSC CGL 2026: Step-by-Step Guide"
                className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs sm:text-sm font-semibold text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-soft">
                URL Slug *
              </label>
              <div className="flex items-center rounded-xl border border-hairline bg-page px-3 py-1.5 text-xs font-mono text-ink focus-within:border-brand-500 focus-within:bg-surface">
                <span className="text-ink-faint mr-1">/article/</span>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={handleSlugChange}
                  placeholder="how-to-apply-jssc-cgl-2026"
                  className="w-full bg-transparent outline-none text-ink"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={setField('category')}
                  className="w-full rounded-xl border border-hairline bg-surface py-2.5 px-3.5 text-xs font-medium text-ink focus:border-brand-500 focus:outline-none"
                >
                  <option value="how-to-apply">How to Apply (Step-by-Step)</option>
                  <option value="how-to-download">How to Download (Admit Card / Marks)</option>
                  <option value="strategy">Exam Strategy &amp; Preparation</option>
                  <option value="syllabus">Syllabus &amp; Pattern Breakdown</option>
                  <option value="result">Results &amp; Cut-off Analysis</option>
                  <option value="documentation">Document Verification &amp; Checklist</option>
                  <option value="job-guide">Job &amp; Recruitment Guide</option>
                  <option value="general">Career Tips &amp; News</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">
                  Read Time
                </label>
                <input
                  type="text"
                  value={form.readTime}
                  onChange={setField('readTime')}
                  placeholder="e.g. 6 min read"
                  className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-soft">
                Short Excerpt / Summary *
              </label>
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={setField('excerpt')}
                placeholder="2-3 sentence overview shown on article cards, search results, and meta descriptions..."
                className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Author Name</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={setField('author')}
                  placeholder="e.g. Job Alert X Editorial Team"
                  className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Author Designation / Role</label>
                <input
                  type="text"
                  value={form.authorRole}
                  onChange={setField('authorRole')}
                  placeholder="e.g. Govt Career & Exam Specialist"
                  className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-soft">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={handleTagsChange}
                placeholder="e.g. JSSC, CGL, How to Apply, Documents"
                className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
              />
            </div>
          </div>

          {/* Card 2: Cover Image */}
          <div className="card p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-ink flex items-center gap-2 border-b border-hairline pb-3">
              <ImageIcon size={16} className="text-blue-500" />
              Cover Image
            </h2>

            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-soft">Image URL</label>
                <input
                  type="url"
                  value={form.coverImage}
                  onChange={setField('coverImage')}
                  placeholder="https://images.unsplash.com/... or upload a file below"
                  className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none font-mono"
                />
              </div>

              {/* Upload button */}
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-subtle px-4 py-2 text-xs font-semibold text-ink cursor-pointer hover:bg-surface shadow-2xs">
                  <UploadCloud size={15} />
                  <span>{uploadingImage ? 'Uploading Image…' : 'Upload Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                {form.coverImage && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, coverImage: '' }))}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove cover image
                  </button>
                )}
              </div>

              {form.coverImage && (
                <div className="relative aspect-[16/9] max-w-sm rounded-xl overflow-hidden border border-hairline bg-subtle">
                  <img src={form.coverImage} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Rich Body Content */}
          <div className="card p-5 sm:p-6 space-y-4">
            <div className="border-b border-hairline pb-3">
              <h2 className="text-sm font-bold text-ink flex items-center gap-2">
                <BookOpen size={16} className="text-brand-500" />
                Article Body &amp; Rich Guide Content
              </h2>
              <p className="text-[11.5px] text-ink-muted mt-0.5">
                Use headings, lists, tables, callout notices, step badges, and embedded images.
              </p>
            </div>

            <BlogRichEditor
              value={form.content || ''}
              onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
              token={token}
            />
          </div>

          {/* Card 4: Publishing Status & Spotlight */}
          <div className="card p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-ink border-b border-hairline pb-3">
              Publishing Options &amp; Visibility
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 rounded-xl border border-hairline bg-subtle/40 p-3.5">
                <input
                  type="checkbox"
                  id="status-published"
                  checked={form.status === 'published'}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.checked ? 'published' : 'draft' }))
                  }
                  className="mt-0.5 h-4 w-4 rounded border-hairline text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="status-published" className="cursor-pointer text-xs font-semibold text-ink">
                  <span>Publish Live immediately</span>
                  <span className="block font-normal text-[11px] text-ink-muted mt-0.5">
                    When checked, this article will immediately be visible on the public articles hub. Uncheck to save as a draft.
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-hairline bg-subtle/40 p-3.5">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={form.featured}
                  onChange={setField('featured')}
                  className="mt-0.5 h-4 w-4 rounded border-hairline text-orange-500 focus:ring-orange-400"
                />
                <label htmlFor="featured-check" className="cursor-pointer text-xs font-semibold text-ink">
                  <span>🔥 Spotlight in Hero Banner</span>
                  <span className="block font-normal text-[11px] text-ink-muted mt-0.5">
                    Feature prominently at the top of the /articles hub and home page recommendations.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 5: SEO Meta Tags */}
          <div className="card p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-ink border-b border-hairline pb-3">
              SEO Optimization (Optional)
            </h2>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-soft">
                Meta Title
              </label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={setField('metaTitle')}
                placeholder={form.title || 'SEO Title for Google'}
                className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-soft">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={form.metaDescription}
                onChange={setField('metaDescription')}
                placeholder={form.excerpt || 'Short 150-160 character description for search engines'}
                className="w-full rounded-xl border border-hairline bg-page py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none"
              />
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/admin/articles"
              className="rounded-xl border border-hairline bg-surface px-5 py-2.5 text-xs font-semibold text-ink-soft hover:bg-subtle hover:text-ink shadow-xs"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/30 hover:brightness-110 disabled:opacity-60 transition-all"
            >
              <Save size={16} />
              {saving ? 'Saving…' : isEdit ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>

        {/* Live Preview Column */}
        {previewTab && (
          <div className="space-y-4">
            <div className="sticky top-24 card p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <span className="text-sm font-bold text-ink">Real-time Article Preview</span>
                <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                  {form.status === 'published' ? 'Will publish live' : 'Draft mode'}
                </span>
              </div>

              {/* Card preview */}
              <div className="space-y-3">
                {form.coverImage && (
                  <div className="aspect-[16/9] rounded-xl overflow-hidden bg-subtle">
                    <img src={form.coverImage} alt="" className="h-full w-full object-cover" />
                  </div>
                )}

                <span className={`inline-block rounded px-2 py-0.5 text-[10.5px] font-bold ${CATEGORY_BADGES[form.category]?.bg || CATEGORY_BADGES.general.bg}`}>
                  {CATEGORY_BADGES[form.category]?.label || form.category}
                </span>

                <h2 className="text-xl font-black text-ink">{form.title || 'Untitled Article'}</h2>

                {form.excerpt && (
                  <p className="text-xs text-ink-soft italic border-l-2 border-brand-500 pl-3">
                    {form.excerpt}
                  </p>
                )}

                <div className="text-[11px] text-ink-faint flex items-center gap-2">
                  <span>By {form.author}</span>
                  <span>•</span>
                  <span>{form.readTime}</span>
                </div>

                <div className="pt-3 border-t border-hairline">
                  <RichContentRenderer content={form.content || '<p>No content written yet.</p>'} className="text-xs" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
