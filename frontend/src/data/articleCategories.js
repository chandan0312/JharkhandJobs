// ---------------------------------------------------------------------------
// Article Categories & Visual Badge Configurations
// ---------------------------------------------------------------------------

import {
  BookOpen,
  CheckCircle2,
  DownloadCloud,
  Sparkles,
  FileText,
  Award,
  GraduationCap,
} from 'lucide-react'

export const ARTICLE_CATEGORIES = [
  { id: 'all', label: 'All Articles', icon: BookOpen, color: 'text-brand-500' },
  { id: 'how-to-apply', label: 'How to Apply', icon: CheckCircle2, color: 'text-emerald-500' },
  { id: 'how-to-download', label: 'How to Download', icon: DownloadCloud, color: 'text-blue-500' },
  { id: 'strategy', label: 'Preparation Strategy', icon: Sparkles, color: 'text-amber-500' },
  { id: 'syllabus', label: 'Syllabus & Pattern', icon: FileText, color: 'text-purple-500' },
  { id: 'result', label: 'Results & Cut-offs', icon: Award, color: 'text-rose-500' },
  { id: 'documentation', label: 'Document Checklist', icon: GraduationCap, color: 'text-cyan-500' },
  { id: 'job-guide', label: 'Job & Exam Guides', icon: BookOpen, color: 'text-orange-500' },
]

export const CATEGORY_BADGES = {
  'how-to-apply': { label: 'How to Apply', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  'how-to-download': { label: 'How to Download', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  strategy: { label: 'Strategy & Tips', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  syllabus: { label: 'Syllabus', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  result: { label: 'Result & Cut-off', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  documentation: { label: 'Documentation', bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' },
  'job-guide': { label: 'Job Guide', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' },
  general: { label: 'Career Guide', bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' },
}
