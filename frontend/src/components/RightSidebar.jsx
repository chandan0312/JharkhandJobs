import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import ResultsCard from './ResultsCard.jsx'
import AttentionCard from './AttentionCard.jsx'
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
    <section
      className="rounded-card p-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <h2 className="eyebrow mb-3">Quick Search</h2>

      <form onSubmit={submit} className="flex items-center gap-2" role="search">
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
            aria-hidden="true"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jobs, exams…"
            aria-label="Search jobs, exams, topics"
            className="input pl-9 pr-8"
            style={{ fontSize: 13 }}
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
              aria-label="Clear search"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={13} aria-hidden="true" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="btn-primary"
          aria-label="Submit search"
          style={{ width: 36, height: 36, padding: 0 }}
        >
          <Search size={15} aria-hidden="true" />
        </button>
      </form>
    </section>
  )
}

export default function RightSidebar() {
  return (
    <div className="space-y-4 xl:sticky xl:top-[76px] xl:max-h-[calc(100vh-88px)] xl:overflow-y-auto xl:overflow-x-hidden pr-1 pb-6 scrollbar-thin">
      <QuickSearch />
      <AttentionCard />
      <ResultsCard />
      <AdmitCardsCard />
      <AnswerKeysCard />
      <SyllabusCard />
    </div>
  )
}
