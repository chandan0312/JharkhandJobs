// ---------------------------------------------------------------------------
// Date helper — parses Indian and international date formats to detect
// application deadlines and whether a job post is expired / archived.
// ---------------------------------------------------------------------------

export function parseDateRobust(val) {
  if (!val || typeof val !== 'string') return null
  const s = val.trim()

  // Match DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
  const ddmmyyyy = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/)
  if (ddmmyyyy) {
    const day = parseInt(ddmmyyyy[1], 10)
    const month = parseInt(ddmmyyyy[2], 10) - 1
    const year = parseInt(ddmmyyyy[3], 10)
    const d = new Date(year, month, day, 23, 59, 59)
    if (!isNaN(d.getTime())) return d
  }

  // Match YYYY-MM-DD
  const yyyymmdd = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/)
  if (yyyymmdd) {
    const year = parseInt(yyyymmdd[1], 10)
    const month = parseInt(yyyymmdd[2], 10) - 1
    const day = parseInt(yyyymmdd[3], 10)
    const d = new Date(year, month, day, 23, 59, 59)
    if (!isNaN(d.getTime())) return d
  }

  // Match DD Mon YYYY e.g. "28 Jul 2026" or "15 October 2026"
  const ddMonYear = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/)
  if (ddMonYear) {
    const d = new Date(`${ddMonYear[2]} ${ddMonYear[1]}, ${ddMonYear[3]} 23:59:59`)
    if (!isNaN(d.getTime())) return d
  }

  // Standard Date parse
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

export function cleanDateString(str) {
  if (!str) return ''
  return String(str)
    .replace(/^(last\s*date(\s*(for|to)\s*apply(\s*online)?)?|closing\s*date|end\s*date|apply\s*end|application\s*begin|start\s*date|apply\s*start|online\s*apply|posted\s*date)[\s:]*/i, '')
    .trim()
}

/**
 * Reduce a date string to a concise, readable format: e.g. "15 Oct", "31 Oct", "28 Jul"
 * Strips redundant labels, timestamps, and returns clean compact text.
 */
export function formatReducedDate(val, fallback = '—') {
  if (!val) return fallback
  let s = cleanDateString(String(val)).trim()
  if (!s || s === '—' || s === '-' || s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined') {
    return fallback
  }

  // Remove time portions e.g. "11:59 PM", "23:59:59", "upto 5 PM"
  s = s.replace(/\s*(at|upto|till)?\s*\d{1,2}:\d{2}(:\d{2})?\s*(am|pm)?/gi, '')
  s = s.replace(/\s*(upto|till)\s*\d{1,2}\s*(am|pm)/gi, '')
  s = s.replace(/\s*\(.*?\)/g, '').trim()

  // Try parsing to Date
  const parsed = parseDateRobust(s)
  if (parsed && !isNaN(parsed.getTime())) {
    const day = parsed.getDate()
    const month = parsed.toLocaleDateString('en-IN', { month: 'short' })
    const year = parsed.getFullYear()
    const currentYear = new Date().getFullYear()
    if (year !== currentYear) {
      return `${day} ${month} '${String(year).slice(-2)}`
    }
    return `${day} ${month}`
  }

  // Fallback regex cleanup for strings that couldn't be parsed directly
  s = s
    .replace(/January/i, 'Jan')
    .replace(/February/i, 'Feb')
    .replace(/March/i, 'Mar')
    .replace(/April/i, 'Apr')
    .replace(/August/i, 'Aug')
    .replace(/September/i, 'Sep')
    .replace(/October/i, 'Oct')
    .replace(/November/i, 'Nov')
    .replace(/December/i, 'Dec')
    .replace(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/, '$1/$2')
    .replace(/,?\s*202\d\b/, '')
    .trim()

  if (s.toLowerCase().includes('notified soon') || s.toLowerCase().includes('available soon')) {
    return 'Soon'
  }

  return s.length > 14 ? s.slice(0, 12) + '…' : s || fallback
}

export function getJobLastDate(job) {
  if (!job) return { rawDateStr: '', parsedDate: null }
  let rawDateStr = ''

  if (Array.isArray(job.importantDates)) {
    const entry = job.importantDates.find((item) => {
      const lbl = String(item?.label || '').toLowerCase()
      return (
        lbl.includes('last date') ||
        lbl.includes('close') ||
        lbl.includes('end date') ||
        lbl.includes('closing') ||
        lbl.includes('apply end')
      )
    })
    if (entry && entry.value) {
      rawDateStr = entry.value
    } else {
      const fallback = job.importantDates.find((item) => {
        const lbl = String(item?.label || '').toLowerCase()
        return lbl.includes('last') || lbl.includes('end')
      })
      if (fallback?.value) rawDateStr = fallback.value
    }
  } else if (typeof job.importantDates === 'string') {
    const parts = job.importantDates.split('|')
    const match = parts.find((p) => {
      const lower = p.toLowerCase()
      return lower.includes('last date') || lower.includes('close') || lower.includes('end date')
    })
    if (match) {
      const splitVal = match.split(':')
      rawDateStr = splitVal.length > 1 ? splitVal.slice(1).join(':').trim() : match.trim()
    }
  }

  if (!rawDateStr && job.lastDate) rawDateStr = job.lastDate
  if (!rawDateStr && job.endDate) rawDateStr = job.endDate

  const parsedDate = parseDateRobust(rawDateStr)
  return {
    rawDateStr: cleanDateString(rawDateStr) || 'Check Details',
    parsedDate,
  }
}

export function isJobExpired(job) {
  const { parsedDate } = getJobLastDate(job)
  if (!parsedDate) return false
  return parsedDate.getTime() < Date.now()
}
