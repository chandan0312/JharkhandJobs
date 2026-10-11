import React, { useState, useRef, useEffect } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  AlertCircle,
  CheckCircle2,
  Info,
  Code,
  Eye,
  Edit3,
  Upload,
  Plus,
  Trash2,
  Undo,
  Redo,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react'
import { uploadImage } from '../services/api.js'
import RichContentRenderer from './RichContentRenderer.jsx'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function BlogRichEditor({ value, onChange, token }) {
  const [activeTab, setActiveTab] = useState('visual') // 'visual' | 'code' | 'preview'
  const [showImageModal, setShowImageModal] = useState(false)
  const [showTableModal, setShowTableModal] = useState(false)
  const [imageTab, setImageTab] = useState('upload') // 'upload' | 'url'
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [imageCaption, setImageCaption] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // Table modal states
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const [hasHeader, setHasHeader] = useState(true)

  const editorRef = useRef(null)
  const isUpdatingFromProp = useRef(false)

  // Sync value from prop into contentEditable div
  useEffect(() => {
    if (editorRef.current && activeTab === 'visual') {
      if (editorRef.current.innerHTML !== (value || '')) {
        isUpdatingFromProp.current = true
        editorRef.current.innerHTML = value || ''
        isUpdatingFromProp.current = false
      }
    }
  }, [value, activeTab])

  // Handle content change inside visual editor
  const handleVisualInput = () => {
    if (isUpdatingFromProp.current) return
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      onChange(html)
    }
  }

  // Execute formatting commands
  const execCmd = (command, val = null) => {
    if (activeTab !== 'visual') {
      setActiveTab('visual')
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus()
          document.execCommand(command, false, val)
          handleVisualInput()
        }
      }, 50)
      return
    }

    if (editorRef.current) {
      editorRef.current.focus()
      document.execCommand(command, false, val)
      handleVisualInput()
    }
  }

  // Insert custom HTML fragment at current cursor position
  const insertHtmlAtCursor = (html) => {
    if (activeTab !== 'visual') {
      onChange((value || '') + '\n' + html)
      return
    }

    if (editorRef.current) {
      editorRef.current.focus()
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        range.deleteContents()
        const el = document.createElement('div')
        el.innerHTML = html
        const frag = document.createDocumentFragment()
        let node
        let lastNode
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node)
        }
        range.insertNode(frag)
        if (lastNode) {
          range.setStartAfter(lastNode)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      } else {
        editorRef.current.innerHTML += html
      }
      handleVisualInput()
    }
  }

  // Insert Callout Box
  const handleInsertCallout = (type) => {
    let calloutHtml = ''
    if (type === 'info') {
      calloutHtml = `<div class="callout callout-info" style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.3); border-left: 4px solid #3b82f6; border-radius: 10px; padding: 14px; margin: 16px 0;">
        <strong style="color: #2563eb; display: block; margin-bottom: 4px;">ℹ️ Important Notice:</strong>
        Enter important notice details, eligibility caution, or instructions here...
      </div><p><br></p>`
    } else if (type === 'warning') {
      calloutHtml = `<div class="callout callout-warning" style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); border-left: 4px solid #f59e0b; border-radius: 10px; padding: 14px; margin: 16px 0;">
        <strong style="color: #d97706; display: block; margin-bottom: 4px;">⚠️ Attention Candidates:</strong>
        Ensure all required documents are uploaded before the deadline. Late submissions will not be accepted.
      </div><p><br></p>`
    } else if (type === 'success') {
      calloutHtml = `<div class="callout callout-success" style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-left: 4px solid #10b981; border-radius: 10px; padding: 14px; margin: 16px 0;">
        <strong style="color: #059669; display: block; margin-bottom: 4px;">✅ Verification Completed:</strong>
        Notification verified against the official gazette. Online application link is active.
      </div><p><br></p>`
    }
    insertHtmlAtCursor(calloutHtml)
  }

  // Insert Link
  const handleInsertLink = () => {
    const url = prompt('Enter the link destination URL (https://...):', 'https://')
    if (url && url !== 'https://') {
      const text = prompt('Enter text for this link (leave empty to use selected text):', '')
      if (text) {
        insertHtmlAtCursor(`<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`)
      } else {
        execCmd('createLink', url)
      }
    }
  }

  // Handle local file image upload
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError('')

    try {
      const res = await uploadImage(token, file)
      if (res && res.url) {
        const fullUrl = res.url.startsWith('http') ? res.url : `${API_BASE}${res.url}`
        const captionMarkup = imageCaption
          ? `<figure style="margin: 16px 0; text-align: center;"><img src="${fullUrl}" alt="${imageAlt || file.name}" style="max-width: 100%; height: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); display: block; margin: 0 auto;" /><figcaption style="font-size: 12px; color: #94a3b8; margin-top: 6px; font-style: italic;">${imageCaption}</figcaption></figure><p><br></p>`
          : `<p><img src="${fullUrl}" alt="${imageAlt || file.name}" style="max-width: 100%; height: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); display: block; margin: 14px auto;" /></p><p><br></p>`
        insertHtmlAtCursor(captionMarkup)
        setShowImageModal(false)
        setImageUrl('')
        setImageAlt('')
        setImageCaption('')
      }
    } catch (err) {
      setUploadError(err.message || 'Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle insert image by URL
  const handleInsertImageUrl = () => {
    if (!imageUrl) return
    const captionMarkup = imageCaption
      ? `<figure style="margin: 16px 0; text-align: center;"><img src="${imageUrl}" alt="${imageAlt || 'Image'}" style="max-width: 100%; height: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); display: block; margin: 0 auto;" /><figcaption style="font-size: 12px; color: #94a3b8; margin-top: 6px; font-style: italic;">${imageCaption}</figcaption></figure><p><br></p>`
      : `<p><img src="${imageUrl}" alt="${imageAlt || 'Image'}" style="max-width: 100%; height: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); display: block; margin: 14px auto;" /></p><p><br></p>`
    insertHtmlAtCursor(captionMarkup)
    setShowImageModal(false)
    setImageUrl('')
    setImageAlt('')
    setImageCaption('')
  }

  // Insert Custom Grid Table
  const handleInsertGridTable = () => {
    const rows = Math.max(1, parseInt(tableRows) || 3)
    const cols = Math.max(1, parseInt(tableCols) || 3)

    let html = `<table class="w-full border-collapse" style="width: 100%; margin: 16px 0; border: 1px solid #334155; border-radius: 8px;">`
    if (hasHeader) {
      html += `<thead><tr style="background: rgba(255,255,255,0.08);">`
      for (let c = 0; c < cols; c++) {
        html += `<th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Header ${c + 1}</th>`
      }
      html += `</tr></thead>`
    }
    html += `<tbody>`
    for (let r = 0; r < rows; r++) {
      html += `<tr>`
      for (let c = 0; c < cols; c++) {
        html += `<td style="padding: 8px 14px; border: 1px solid #334155;">Row ${r + 1}, Col ${c + 1}</td>`
      }
      html += `</tr>`
    }
    html += `</tbody></table><p><br></p>`

    insertHtmlAtCursor(html)
    setShowTableModal(false)
  }

  // Insert Sarkari Table Preset
  const handleInsertPresetTable = (preset) => {
    let tableHtml = ''

    if (preset === 'vacancies') {
      tableHtml = `<h2>📊 Post-wise Vacancy Breakdown & Eligibility</h2>
      <table class="w-full border-collapse" style="width: 100%; margin: 16px 0; border: 1px solid #334155;">
        <thead>
          <tr style="background: rgba(255,255,255,0.08);">
            <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Post Name</th>
            <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Total Posts</th>
            <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Educational Qualification</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Inspector / Sub-Inspector</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;"><strong>1,250</strong></td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Bachelor's Degree in any stream from a recognized university.</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Assistant Section Officer</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;"><strong>850</strong></td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Graduation with Computer Proficiency test qualification.</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Tax Assistant / Clerk</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;"><strong>2,400</strong></td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">12th Passed or Graduate + English Typing 35 WPM / Hindi 30 WPM.</td>
          </tr>
        </tbody>
      </table><p><br></p>`
    } else if (preset === 'dates') {
      tableHtml = `<h2>📅 Important Exam Schedule & Key Dates</h2>
      <table class="w-full border-collapse" style="width: 100%; margin: 16px 0; border: 1px solid #334155;">
        <thead>
          <tr style="background: rgba(255,255,255,0.08);">
            <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Notification Event / Stage</th>
            <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Scheduled Date & Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Online Application Start Date</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;"><strong>Available Now</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Last Date for Online Registration</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;"><strong>30 Days from Notification</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Application Form Correction Window</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">To be notified soon</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Tier-1 / Preliminary Exam Date</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Expected in Upcoming Quarter</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Admit Card Release Date</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">4-7 Days prior to Exam</td>
          </tr>
        </tbody>
      </table><p><br></p>`
    } else if (preset === 'exam') {
      tableHtml = `<h2>📝 Exam Pattern & Marking Scheme</h2>
      <table class="w-full border-collapse" style="width: 100%; margin: 16px 0; border: 1px solid #334155;">
        <thead>
          <tr style="background: rgba(255,255,255,0.08);">
            <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Subject / Section</th>
            <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Questions</th>
            <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Maximum Marks</th>
            <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">General Intelligence & Reasoning</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">25</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">50</td>
            <td rowspan="4" style="padding: 10px 14px; border: 1px solid #334155; text-align: center; vertical-align: middle;"><strong>60 Minutes</strong> (Composite)</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">General Awareness & Current Affairs</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">25</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">50</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Quantitative Aptitude (Mathematics)</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">25</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">50</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">English Comprehension</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">25</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">50</td>
          </tr>
          <tr style="background: rgba(255,255,255,0.05); font-weight: bold;">
            <td style="padding: 10px 14px; border: 1px solid #334155;">Total</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">100 Questions</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">200 Marks</td>
            <td style="padding: 10px 14px; border: 1px solid #334155; text-align: center;">Negative: 0.50</td>
          </tr>
        </tbody>
      </table><p><br></p>`
    } else if (preset === 'salary') {
      tableHtml = `<h2>💰 Pay Scale & Salary In-Hand Details</h2>
      <table class="w-full border-collapse" style="width: 100%; margin: 16px 0; border: 1px solid #334155;">
        <thead>
          <tr style="background: rgba(255,255,255,0.08);">
            <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Post Designation</th>
            <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">7th CPC Pay Matrix Level</th>
            <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Basic Pay Band</th>
            <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Approx In-Hand Salary</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Assistant Section Officer</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Level-7</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">₹44,900 – ₹1,42,400</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">₹68,000 – ₹76,000 / month</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Sub-Inspector / Inspector</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Level-6</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">₹35,400 – ₹1,12,400</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">₹54,000 – ₹62,000 / month</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Tax Assistant / Clerk</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">Level-4</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">₹25,500 – ₹81,100</td>
            <td style="padding: 10px 14px; border: 1px solid #334155;">₹38,000 – ₹44,000 / month</td>
          </tr>
        </tbody>
      </table><p><br></p>`
    }

    insertHtmlAtCursor(tableHtml)
    setShowTableModal(false)
  }

  // Insert Full Sarkari Blog Outline
  const handleInsertBlogTemplate = () => {
    if (value && value.trim() && !window.confirm('Replace current content with the complete Sarkari Blog Outline template?')) {
      return
    }

    const template = `<h2>📌 Notification Overview & Highlights</h2>
<p>The recruitment department has officially released the detailed notification advertisement for eligible candidates. Candidates who satisfy all essential qualifications, age criteria, and physical standards can submit their online applications before the last date.</p>

<div class="callout callout-info" style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.3); border-left: 4px solid #3b82f6; border-radius: 10px; padding: 14px; margin: 16px 0;">
  <strong style="color: #2563eb; display: block; margin-bottom: 4px;">ℹ️ Official Notification Advice:</strong>
  Candidates are strongly advised to read the detailed PDF notice carefully before filling out the online form to avoid rejection.
</div>

<h2>📊 Post-wise Vacancy Breakdown & Eligibility</h2>
<table class="w-full border-collapse" style="width: 100%; margin: 16px 0; border: 1px solid #334155;">
  <thead>
    <tr style="background: rgba(255,255,255,0.08);">
      <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Post Designation</th>
      <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Total Vacancies</th>
      <th style="padding: 10px 14px; font-weight: bold; border: 1px solid #334155;">Essential Qualification</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px 14px; border: 1px solid #334155;">General Officer / Clerk</td>
      <td style="padding: 10px 14px; border: 1px solid #334155;"><strong>1,500</strong></td>
      <td style="padding: 10px 14px; border: 1px solid #334155;">Bachelor's Degree in any stream from recognized University.</td>
    </tr>
    <tr>
      <td style="padding: 10px 14px; border: 1px solid #334155;">Technical Specialist</td>
      <td style="padding: 10px 14px; border: 1px solid #334155;"><strong>500</strong></td>
      <td style="padding: 10px 14px; border: 1px solid #334155;">B.Tech / B.E / BCA or relevant Diploma.</td>
    </tr>
  </tbody>
</table>

<h2>📝 Step-by-Step Selection Process</h2>
<p>The recruitment process consists of multiple competitive stages:</p>
<ol>
  <li><strong>Stage 1:</strong> Computer Based Written Examination (CBT / Prelims).</li>
  <li><strong>Stage 2:</strong> Main Examination / Descriptive Subject Paper.</li>
  <li><strong>Stage 3:</strong> Skill Test / Typing Speed Test / Physical Standard Test (PST/PET).</li>
  <li><strong>Stage 4:</strong> Document Verification (DV) & Final Medical Examination.</li>
</ol>

<h2>💻 How to Apply Online (Step-by-Step Instructions)</h2>
<ul>
  <li>Visit the official application portal using the link provided below.</li>
  <li>Click on the <strong>New Registration</strong> button and provide basic personal details.</li>
  <li>Login using your newly generated Registration Number and Password.</li>
  <li>Fill in educational qualification details, examination center preferences, and address.</li>
  <li>Upload clear scanned copies of your passport size photograph, signature, and category certificate.</li>
  <li>Pay the required application fee through Net Banking, UPI, Credit Card, or Debit Card.</li>
  <li>Take a printout of the final submitted application form for future reference.</li>
</ul>

<div class="callout callout-warning" style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); border-left: 4px solid #f59e0b; border-radius: 10px; padding: 14px; margin: 16px 0;">
  <strong style="color: #d97706; display: block; margin-bottom: 4px;">⚠️ Important Reminder:</strong>
  Make sure your photograph is recent (taken within the last 3 months) with a plain light background to avoid cancellation of your candidature.
</div>`

    onChange(template)
    if (editorRef.current && activeTab === 'visual') {
      editorRef.current.innerHTML = template
    }
  }

  return (
    <div className="w-full rounded-2xl border border-hairline bg-surface shadow-xs transition-all">
      {/* Top Header: Tab Controls & Quick Templates */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-subtle/40 px-3.5 py-2.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'visual'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'text-ink-soft hover:bg-subtle hover:text-ink'
            }`}
          >
            <Edit3 size={13} /> Visual Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'code'
                ? 'bg-brand-500 text-white shadow-xs'
                : 'text-ink-soft hover:bg-subtle hover:text-ink'
            }`}
          >
            <Code size={13} /> HTML Source
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-ink-soft hover:bg-subtle hover:text-ink'
            }`}
          >
            <Eye size={13} /> Live Post Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInsertBlogTemplate}
            className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 transition-all"
            title="Insert standard Sarkari blog outline with sections and tables"
          >
            <Sparkles size={13} />
            <span>Blog Template</span>
          </button>
        </div>
      </div>

      {/* Visual Formatting Toolbar (Active when in Visual Mode) */}
      {activeTab === 'visual' && (
        <div className="flex flex-wrap items-center gap-1 border-b border-hairline bg-page/70 p-2 text-ink-soft">
          {/* History */}
          <button
            type="button"
            onClick={() => execCmd('undo')}
            className="rounded-lg p-1.5 hover:bg-subtle hover:text-ink transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('redo')}
            className="rounded-lg p-1.5 hover:bg-subtle hover:text-ink transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo size={14} />
          </button>

          <div className="h-4 w-[1px] bg-hairline mx-1" />

          {/* Heading Dropdown */}
          <select
            onChange={(e) => {
              const val = e.target.value
              if (val) {
                execCmd('formatBlock', `<${val}>`)
                e.target.value = ''
              }
            }}
            defaultValue=""
            className="rounded-lg border border-hairline bg-surface px-2 py-1 text-xs font-semibold text-ink focus:border-brand-500 focus:outline-none"
          >
            <option value="" disabled>Format Text</option>
            <option value="p">Paragraph</option>
            <option value="h2">Heading 2 (Section Title)</option>
            <option value="h3">Heading 3 (Sub-Section)</option>
            <option value="h4">Heading 4 (Minor Title)</option>
          </select>

          <div className="h-4 w-[1px] bg-hairline mx-1" />

          {/* Inline Styles */}
          <button
            type="button"
            onClick={() => execCmd('bold')}
            className="rounded-lg p-1.5 hover:bg-subtle hover:text-ink transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('italic')}
            className="rounded-lg p-1.5 hover:bg-subtle hover:text-ink transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('underline')}
            className="rounded-lg p-1.5 hover:bg-subtle hover:text-ink transition-colors"
            title="Underline (Ctrl+U)"
          >
            <Underline size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('strikeThrough')}
            className="rounded-lg p-1.5 hover:bg-subtle hover:text-ink transition-colors"
            title="Strikethrough"
          >
            <Strikethrough size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('hiliteColor', '#fef08a')}
            className="rounded-lg p-1.5 hover:bg-subtle hover:text-ink transition-colors"
            title="Highlight Text"
          >
            <Highlighter size={14} />
          </button>

          <div className="h-4 w-[1px] bg-hairline mx-1" />

          {/* Alignment */}
          <button
            type="button"
            onClick={() => execCmd('justifyLeft')}
            className="rounded-lg p-1.5 hover:bg-subtle hover:text-ink transition-colors"
            title="Align Left"
          >
            <AlignLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyCenter')}
            className="rounded-lg p-1.5 hover:bg-subtle hover:text-ink transition-colors"
            title="Align Center"
          >
            <AlignCenter size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyRight')}
            className="rounded-lg p-1.5 hover:bg-subtle hover:text-ink transition-colors"
            title="Align Right"
          >
            <AlignRight size={14} />
          </button>

          <div className="h-4 w-[1px] bg-hairline mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => execCmd('insertUnorderedList')}
            className="rounded-lg p-1.5 hover:bg-subtle hover:text-ink transition-colors"
            title="Bullet List"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            className="rounded-lg p-1.5 hover:bg-subtle hover:text-ink transition-colors"
            title="Numbered List"
          >
            <ListOrdered size={14} />
          </button>

          <div className="h-4 w-[1px] bg-hairline mx-1" />

          {/* Insert Elements */}
          <button
            type="button"
            onClick={handleInsertLink}
            className="rounded-lg p-1.5 hover:bg-subtle hover:text-ink transition-colors"
            title="Insert Hyperlink"
          >
            <LinkIcon size={14} />
          </button>

          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-surface px-2 py-1 text-xs font-bold text-ink hover:bg-subtle transition-colors shadow-xs"
            title="Upload or Insert Image"
          >
            <ImageIcon size={13} className="text-brand-500" />
            <span>Image</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTableModal(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-surface px-2 py-1 text-xs font-bold text-ink hover:bg-subtle transition-colors shadow-xs"
            title="Insert Table"
          >
            <TableIcon size={13} className="text-orange-500" />
            <span>Table</span>
          </button>

          <div className="h-4 w-[1px] bg-hairline mx-1" />

          {/* Callout Notice Dropdown */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleInsertCallout('info')}
              className="inline-flex items-center gap-1 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20"
              title="Insert Information Notice Callout"
            >
              <Info size={12} /> Notice Box
            </button>
            <button
              type="button"
              onClick={() => handleInsertCallout('warning')}
              className="inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
              title="Insert Warning / Attention Callout"
            >
              <AlertCircle size={12} /> Alert Box
            </button>
          </div>
        </div>
      )}

      {/* Editor Main Content Area */}
      <div className="p-3 sm:p-4">
        {activeTab === 'visual' && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleVisualInput}
            onBlur={handleVisualInput}
            placeholder="Write full detailed blog post, eligibility criteria, exam scheme, selection procedure, vacancies table..."
            className="min-h-[380px] max-h-[700px] overflow-y-auto rounded-xl border border-hairline bg-page p-4 text-sm leading-relaxed text-ink focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            style={{ outline: 'none' }}
          />
        )}

        {activeTab === 'code' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-ink-faint">
              <span>Direct HTML Source Code Editor</span>
              <span>Edits will reflect instantly in Visual & Preview modes</span>
            </div>
            <textarea
              rows={16}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="<h2>Title</h2><p>Full description...</p>"
              className="w-full font-mono text-xs leading-relaxed rounded-xl border border-hairline bg-page p-4 text-ink placeholder:text-ink-faint focus:border-brand-500 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="rounded-xl border border-hairline bg-page p-5 min-h-[380px]">
            <div className="mb-4 flex items-center justify-between border-b border-hairline pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-500">Public Page Live Preview</span>
              <span className="text-xs text-ink-faint">Exact styling rendered on the public Job Details page</span>
            </div>
            <RichContentRenderer content={value} />
          </div>
        )}
      </div>

      {/* --- Image Modal --- */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-hairline bg-surface p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <ImageIcon size={16} className="text-brand-500" /> Insert Image
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-ink-faint hover:text-ink text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 flex rounded-xl border border-hairline bg-subtle p-1">
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                  imageTab === 'upload' ? 'bg-surface text-ink shadow-xs' : 'text-ink-muted hover:text-ink'
                }`}
              >
                Upload from Computer
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                  imageTab === 'url' ? 'bg-surface text-ink shadow-xs' : 'text-ink-muted hover:text-ink'
                }`}
              >
                Image URL
              </button>
            </div>

            {uploadError && (
              <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs font-medium text-red-600 dark:text-red-400">
                {uploadError}
              </div>
            )}

            {imageTab === 'upload' ? (
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-hairline bg-page p-6 text-center cursor-pointer hover:border-brand-500/60 transition-colors">
                  <Upload size={24} className="text-brand-500 mb-2" />
                  <span className="text-xs font-bold text-ink">
                    {isUploading ? 'Uploading Image…' : 'Click to select image file'}
                  </span>
                  <span className="text-[11px] text-ink-faint mt-1">
                    Supports JPG, PNG, WEBP, GIF, SVG (Up to 15MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                <div>
                  <label className="text-[11px] font-semibold text-ink-soft block mb-1">Caption (Optional)</label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="e.g. Official SSC Notification Gazette Notice"
                    className="w-full rounded-xl border border-hairline bg-page px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-ink-soft block mb-1">Image URL *</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/images/notification.jpg"
                    className="w-full rounded-xl border border-hairline bg-page px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-ink-soft block mb-1">Alt Description</label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Brief description for search engines & accessibility"
                    className="w-full rounded-xl border border-hairline bg-page px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-ink-soft block mb-1">Caption (Optional)</label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="e.g. Exam center map or official syllabus diagram"
                    className="w-full rounded-xl border border-hairline bg-page px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowImageModal(false)}
                    className="rounded-xl border border-hairline px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-subtle"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleInsertImageUrl}
                    disabled={!imageUrl}
                    className="rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-600 disabled:opacity-50"
                  >
                    Insert Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Table Modal --- */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-hairline bg-surface p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <TableIcon size={16} className="text-orange-500" /> Insert Table
              </h3>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="text-ink-faint hover:text-ink text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Presets */}
              <div>
                <span className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
                  ⚡ 1-Click Sarkari Table Presets
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInsertPresetTable('vacancies')}
                    className="flex flex-col items-start rounded-xl border border-hairline bg-page p-3 text-left hover:border-brand-500 hover:bg-subtle transition-all"
                  >
                    <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <FileSpreadsheet size={13} className="text-brand-500" /> Vacancy Breakdown
                    </span>
                    <span className="text-[11px] text-ink-faint mt-0.5">Post name, total posts, eligibility</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertPresetTable('dates')}
                    className="flex flex-col items-start rounded-xl border border-hairline bg-page p-3 text-left hover:border-brand-500 hover:bg-subtle transition-all"
                  >
                    <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <FileSpreadsheet size={13} className="text-orange-500" /> Important Dates
                    </span>
                    <span className="text-[11px] text-ink-faint mt-0.5">Application start, last date, exam dates</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertPresetTable('exam')}
                    className="flex flex-col items-start rounded-xl border border-hairline bg-page p-3 text-left hover:border-brand-500 hover:bg-subtle transition-all"
                  >
                    <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <FileSpreadsheet size={13} className="text-emerald-500" /> Exam Pattern / Syllabus
                    </span>
                    <span className="text-[11px] text-ink-faint mt-0.5">Subject, questions, marks, duration</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertPresetTable('salary')}
                    className="flex flex-col items-start rounded-xl border border-hairline bg-page p-3 text-left hover:border-brand-500 hover:bg-subtle transition-all"
                  >
                    <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <FileSpreadsheet size={13} className="text-purple-500" /> Salary / Pay Scale
                    </span>
                    <span className="text-[11px] text-ink-faint mt-0.5">Pay level, basic salary, in-hand pay</span>
                  </button>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-hairline"></div>
                <span className="flex-shrink mx-3 text-[11px] font-bold text-ink-faint uppercase">Or Custom Grid</span>
                <div className="flex-grow border-t border-hairline"></div>
              </div>

              {/* Custom Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-ink-soft block mb-1">Rows</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={tableRows}
                    onChange={(e) => setTableRows(e.target.value)}
                    className="w-full rounded-xl border border-hairline bg-page px-3 py-2 text-xs text-ink focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-ink-soft block mb-1">Columns</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={tableCols}
                    onChange={(e) => setTableCols(e.target.value)}
                    className="w-full rounded-xl border border-hairline bg-page px-3 py-2 text-xs text-ink focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="include-header-cb"
                  checked={hasHeader}
                  onChange={(e) => setHasHeader(e.target.checked)}
                  className="rounded border-hairline"
                />
                <label htmlFor="include-header-cb" className="text-xs font-medium text-ink">
                  Include Top Header Row
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-hairline">
                <button
                  type="button"
                  onClick={() => setShowTableModal(false)}
                  className="rounded-xl border border-hairline px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-subtle"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertGridTable}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 text-xs font-bold text-white shadow-xs hover:brightness-110"
                >
                  Insert Custom Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
