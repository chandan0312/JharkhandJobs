import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import ResultsCard from './ResultsCard.jsx'
import AdmitCardsCard from './AdmitCardsCard.jsx'
import AnswerKeysCard from './AnswerKeysCard.jsx'
import SyllabusCard from './SyllabusCard.jsx'

function QuickSearch() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const query = q.trim()
    if (query) navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <section className="card p-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Quick Search</h2>
      <form onSubmit={submit} className="flex items-center gap-2" role="search">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jobs, exams, topics..."
            aria-label="Search jobs, exams, topics"
            className="w-full rounded-xl border border-hairline bg-page py-2.5 pl-9 pr-3 text-xs text-ink placeholder:text-ink-faint focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
          />
        </div>
        <button
          type="submit"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          aria-label="Submit Search"
        >
          <Search size={17} aria-hidden="true" />
        </button>
      </form>
    </section>
  )
}

export default function RightSidebar() {
  return (
    <div className="space-y-6">
      <QuickSearch />
      <ResultsCard />
      <AdmitCardsCard />
      <AnswerKeysCard />
      <SyllabusCard />
    </div>
  )
}
