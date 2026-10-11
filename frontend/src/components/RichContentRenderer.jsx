import React, { useMemo } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * Clean & sanitize HTML string while enhancing tables, images, links and callouts.
 * Strips executable scripts, event handlers, and unsafe protocols.
 */
function sanitizeAndFormatHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return ''

  if (typeof window === 'undefined') {
    return rawHtml
  }

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(rawHtml, 'text/html')

    // 1. Remove dangerous tags
    const dangerousTags = ['script', 'style', 'iframe', 'frame', 'object', 'embed', 'form', 'input', 'button', 'canvas', 'link', 'meta']
    dangerousTags.forEach((tagName) => {
      doc.querySelectorAll(tagName).forEach((el) => el.remove())
    })

    // 2. Remove inline event handlers & unsafe protocols from all elements
    const allElements = doc.body.querySelectorAll('*')
    allElements.forEach((el) => {
      // Clean attributes
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase()
        const value = attr.value.trim().toLowerCase()
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name)
        } else if ((name === 'href' || name === 'src') && (value.startsWith('javascript:') || value.startsWith('vbscript:') || value.startsWith('data:text/html'))) {
          el.removeAttribute(attr.name)
        }
      })
    })

    // 3. Format and enhance <table> elements
    doc.querySelectorAll('table').forEach((table) => {
      table.classList.add('w-full', 'border-collapse', 'text-left', 'text-xs', 'sm:text-sm')
      
      // Ensure the table is wrapped in a responsive horizontal scroll container
      if (!table.parentElement?.classList.contains('rich-table-wrapper')) {
        const wrapper = doc.createElement('div')
        wrapper.className = 'rich-table-wrapper my-4 overflow-x-auto rounded-xl border border-hairline bg-surface/50 shadow-xs'
        table.parentNode.insertBefore(wrapper, table)
        wrapper.appendChild(table)
      }

      table.querySelectorAll('thead').forEach((thead) => {
        thead.classList.add('bg-subtle/80', 'text-ink', 'font-bold', 'border-b', 'border-hairline')
      })

      table.querySelectorAll('th').forEach((th) => {
        th.classList.add('px-3.5', 'py-2.5', 'font-bold', 'text-ink', 'border', 'border-hairline', 'bg-subtle/60')
      })

      table.querySelectorAll('td').forEach((td) => {
        td.classList.add('px-3.5', 'py-2.5', 'text-ink-soft', 'border', 'border-hairline', 'align-top')
      })

      table.querySelectorAll('tbody tr').forEach((tr, i) => {
        if (i % 2 === 1) {
          tr.classList.add('bg-subtle/20')
        }
      })
    })

    // 4. Format and enhance <img> elements
    doc.querySelectorAll('img').forEach((img) => {
      let src = img.getAttribute('src') || ''
      if (src.startsWith('/uploads/')) {
        src = `${API_BASE}${src}`
        img.setAttribute('src', src)
      }
      img.classList.add('max-w-full', 'h-auto', 'rounded-xl', 'border', 'border-hairline', 'shadow-sm', 'my-3', 'mx-auto', 'block')
      img.setAttribute('loading', 'lazy')
      if (!img.getAttribute('alt')) {
        img.setAttribute('alt', 'Notification detail image')
      }
    })

    // 5. Enhance links (safe external links)
    doc.querySelectorAll('a').forEach((a) => {
      a.classList.add('text-brand-600', 'dark:text-brand-400', 'font-semibold', 'underline', 'underline-offset-2', 'hover:opacity-80', 'transition-opacity')
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
    })

    // 6. Enhance headings
    doc.querySelectorAll('h2').forEach((h) => {
      h.classList.add('text-lg', 'sm:text-xl', 'font-extrabold', 'text-ink', 'mt-6', 'mb-3', 'flex', 'items-center', 'gap-2', 'tracking-tight')
    })
    doc.querySelectorAll('h3').forEach((h) => {
      h.classList.add('text-base', 'sm:text-lg', 'font-bold', 'text-ink', 'mt-4', 'mb-2')
    })
    doc.querySelectorAll('h4').forEach((h) => {
      h.classList.add('text-sm', 'sm:text-base', 'font-bold', 'text-ink-soft', 'mt-3', 'mb-1.5')
    })

    // 7. Enhance lists
    doc.querySelectorAll('ul').forEach((ul) => {
      ul.classList.add('list-disc', 'list-inside', 'my-3', 'space-y-1.5', 'text-ink-soft', 'text-sm')
    })
    doc.querySelectorAll('ol').forEach((ol) => {
      ol.classList.add('list-decimal', 'list-inside', 'my-3', 'space-y-1.5', 'text-ink-soft', 'text-sm')
    })

    // 8. Enhance callout boxes
    doc.querySelectorAll('.callout, .callout-info, .callout-warning, .callout-success').forEach((box) => {
      box.classList.add('p-3.5', 'my-4', 'rounded-xl', 'border', 'text-xs', 'sm:text-sm', 'leading-relaxed')
    })

    return doc.body.innerHTML
  } catch (err) {
    console.error('Error formatting HTML content:', err)
    return rawHtml
  }
}

/**
 * RichContentRenderer
 * Renders blog content cleanly. Supports HTML, responsive tables, formatted headings,
 * embedded images, callouts, and backward-compatible plain text.
 */
export default function RichContentRenderer({ content, className = '' }) {
  const isHtml = useMemo(() => {
    if (!content || typeof content !== 'string') return false
    return /<[a-z][\s\S]*>/i.test(content)
  }, [content])

  const sanitizedHtml = useMemo(() => {
    if (!isHtml) return ''
    return sanitizeAndFormatHtml(content)
  }, [content, isHtml])

  if (!content) return null

  // Plain text mode (legacy backward-compatibility)
  if (!isHtml) {
    return (
      <div className={`whitespace-pre-line text-sm leading-relaxed text-ink-soft space-y-2 ${className}`}>
        {content}
      </div>
    )
  }

  return (
    <div
      className={`rich-blog-content text-sm leading-relaxed text-ink-soft space-y-3 break-words ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}
