/**
 * Structured table for job-detail sections.
 *
 * Two modes:
 *   1) Key/value pairs — pass `rows={[{ label, value }]}`
 *   2) Multi-column     — pass `columns={[{ key, label }]}` and `rows={[{...}]}`
 *
 * Always pass a `title` for the section heading.
 */
export default function TableView({ title, columns, rows = [], className = '' }) {
  const isMatrix = Array.isArray(columns) && columns.length > 0

  return (
    <section className={`card overflow-hidden ${className}`}>
      {title && (
        <h3 className="border-b border-hairline px-4 py-3 text-[14px] font-bold text-ink">{title}</h3>
      )}

      {isMatrix ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-subtle/60">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="whitespace-nowrap px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-ink-muted"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-subtle/50">
                  {columns.map((col, ci) => (
                    <td
                      key={col.key}
                      className={`px-4 py-2.5 align-top ${
                        ci === 0 ? 'font-semibold text-ink' : 'text-ink-soft'
                      }`}
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <table className="w-full text-left text-[13px]">
          <tbody className="divide-y divide-hairline">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-subtle/50">
                <th
                  scope="row"
                  className="w-1/2 px-4 py-2.5 align-top text-[13px] font-medium text-ink-muted"
                >
                  {row.label}
                </th>
                <td className="px-4 py-2.5 align-top font-semibold text-ink">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
