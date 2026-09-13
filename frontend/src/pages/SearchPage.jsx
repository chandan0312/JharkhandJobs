import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import JobCard from '../components/JobCard.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { searchJobs } from '../services/api.js'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const [input, setInput] = useState(query)
  const [results, setResults] = useState(null)

  useEffect(() => {
    setInput(query)
    if (!query) {
      setResults([])
      return
    }
    let active = true
    setResults(null)
    searchJobs(query).then((data) => active && setResults(data))
    return () => {
      active = false
    }
  }, [query])

  const submit = (e) => {
    e.preventDefault()
    setParams(input.trim() ? { q: input.trim() } : {})
  }

  const searchBreadcrumbs = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jobalertx.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Search Jobs',
        item: 'https://jobalertx.com/search',
      },
    ],
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <SEOHead
        title={query ? `Search Results for "${query}"` : 'Search Sarkari Jobs, Results & Admit Cards'}
        description="Search government job vacancies, admit cards, results, and answer keys on Job Alert X."
        noIndex={true}
      />

      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Search</h1>
      <p className="mt-1 text-[13.5px] text-ink-muted">
        Find jobs, exams and updates across every department.
      </p>

      <form onSubmit={submit} className="mt-5 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            autoFocus
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try “SSC”, “railway”, “admit card”…"
            className="w-full rounded-xl border border-hairline bg-surface py-3 pl-10 pr-3 text-[14px] text-ink placeholder:text-ink-faint focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40"
          />
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <div className="mt-6">
        {!query ? (
          <p className="text-[13.5px] text-ink-muted">Enter a keyword to begin.</p>
        ) : results === null ? (
          <p className="text-[13.5px] text-ink-muted">Searching…</p>
        ) : results.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-[15px] font-semibold text-ink">No matches for “{query}”</p>
            <p className="mt-1 text-[13px] text-ink-muted">Try a broader term like a department or exam name.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-[13px] font-medium text-ink-muted">
              {results.length} result{results.length > 1 ? 's' : ''} for “{query}”
            </p>
            <div className="grid grid-cols-1 gap-4">
              {results.map((job) => (
                <JobCard key={job.id} job={job} variant="row" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
