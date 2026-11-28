/**
 * Zero-CLS Skeleton component library for loading states.
 * Uses CSS custom properties so light and dark themes adapt automatically.
 */

function SkeletonPrimitive({
  className = '',
  variant = 'default', // 'default' | 'muted' | 'brand' | 'surface'
  animation = 'pulse', // 'pulse' | 'wave' | 'none'
  'aria-hidden': ariaHidden = 'true',
  ...props
}) {
  const base = 'rounded animate-skeleton'
  const variantClass =
    variant === 'muted'
      ? 'bg-subtle/80'
      : variant === 'brand'
      ? 'bg-brand-500/15'
      : variant === 'surface'
      ? 'bg-surface border border-hairline'
      : 'bg-subtle/90'
  const animClass = animation === 'wave' ? '' : animation === 'pulse' ? 'animate-pulse' : ''
  return <div className={`${base} ${variantClass} ${animClass} ${className}`} aria-hidden={ariaHidden} {...props} />
}

export function TextSkeleton({ lines = 3, className = '', variant = 'default' }) {
  return (
    <div className={`space-y-1.5 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonPrimitive
          key={i}
          variant={variant}
          className={i === lines - 1 ? 'h-3.5 rounded w-3/4' : 'h-3.5 rounded w-full'}
        />
      ))}
    </div>
  )
}

export function CardSkeleton({ withImage = true, withMeta = true, variant = 'default', className = '' }) {
  const isHorizontal = variant === 'horizontal'
  const isCompact = variant === 'compact'

  return (
    <div
      className={`
        card overflow-hidden transition-all duration-200
        ${isHorizontal ? 'flex flex-row items-start gap-4 p-4' : 'flex flex-col'}
        ${isCompact ? 'p-3' : 'p-4 sm:p-5'}
        ${className}
      `}
      aria-hidden="true"
    >
      {withImage && !isHorizontal && (
        <SkeletonPrimitive className="aspect-video w-full rounded-lg mb-3" variant="surface" />
      )}

      <div className={`${isHorizontal ? 'flex-1 min-w-0' : 'flex-1'} space-y-2`}>
        <SkeletonPrimitive className="h-5 w-20 rounded-full" variant="brand" />
        <SkeletonPrimitive className={`h-5 rounded ${isCompact ? 'w-3/4' : 'w-5/6'}`} variant="default" />
        <SkeletonPrimitive className={`h-4 rounded ${isCompact ? 'w-1/2' : 'w-1/3'}`} variant="muted" />

        {withMeta && (
          <div className="flex items-center gap-3">
            <SkeletonPrimitive className="h-3.5 w-16 rounded" variant="muted" />
            <SkeletonPrimitive className="h-3.5 w-20 rounded" variant="muted" />
            <SkeletonPrimitive className="h-3.5 w-16 rounded" variant="muted" />
          </div>
        )}

        {!isCompact && (
          <div className="pt-2 border-t border-hairline flex items-center justify-between">
            <SkeletonPrimitive className="h-8 w-28 rounded-lg" variant="brand" />
            <SkeletonPrimitive className="h-7 w-20 rounded-lg" variant="muted" />
          </div>
        )}
      </div>

      {withImage && isHorizontal && (
        <SkeletonPrimitive className="aspect-square w-36 sm:w-40 flex-shrink-0 rounded-lg" variant="surface" />
      )}
    </div>
  )
}

export function TableRowSkeleton({ cols = 3, withAction = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 py-2.5 px-3 border-b border-hairline/60 last:border-b-0 ${className}`} aria-hidden="true">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <SkeletonPrimitive className="h-8 w-8 rounded-lg shrink-0" variant="surface" />
        <div className="flex-1 space-y-1.5 min-w-0">
          <SkeletonPrimitive className="h-3.5 rounded w-3/5" variant="default" />
          <SkeletonPrimitive className="h-2.5 rounded w-1/3" variant="muted" />
        </div>
      </div>
      {Array.from({ length: Math.max(0, cols - 1) }).map((_, i) => (
        <SkeletonPrimitive key={i} className="hidden sm:block h-3.5 w-20 rounded shrink-0" variant="muted" />
      ))}
      {withAction && <SkeletonPrimitive className="h-7 w-20 rounded-lg shrink-0" variant="brand" />}
    </div>
  )
}

export function TableSkeleton({ rows = 4, cols = 3, withHeader = true, className = '' }) {
  return (
    <div className={`rjt-wrapper ${className}`} aria-hidden="true">
      {withHeader && (
        <div className="rjt-head-row flex items-center justify-between px-4 py-3">
          <SkeletonPrimitive className="h-3 w-36 rounded" variant="muted" />
          <SkeletonPrimitive className="h-3 w-20 rounded" variant="muted" />
        </div>
      )}
      <div className="divide-y divide-hairline/60">
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} cols={cols} />
        ))}
      </div>
    </div>
  )
}

export function HeroSkeleton({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-card border border-hairline bg-surface p-5 sm:p-7 ${className}`}
      aria-hidden="true"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <SkeletonPrimitive className="h-5 w-24 rounded-full" variant="brand" />
            <SkeletonPrimitive className="h-5 w-20 rounded-full" variant="muted" />
          </div>
          <SkeletonPrimitive className="h-7 w-4/5 rounded" variant="default" />
          <SkeletonPrimitive className="h-4 w-3/5 rounded" variant="muted" />
          <div className="flex items-center gap-3 pt-2">
            <SkeletonPrimitive className="h-9 w-32 rounded-btn" variant="brand" />
            <SkeletonPrimitive className="h-9 w-28 rounded-btn" variant="muted" />
          </div>
        </div>
        <SkeletonPrimitive className="hidden md:block h-20 w-20 rounded-card shrink-0" variant="surface" />
      </div>
    </div>
  )
}

export function ArticleSkeleton({ className = '' }) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface p-4 space-y-3 ${className}`}
      aria-hidden="true"
    >
      <SkeletonPrimitive className="aspect-[16/9] w-full rounded-xl" variant="surface" />
      <div className="flex items-center gap-2">
        <SkeletonPrimitive className="h-3 w-16 rounded" variant="muted" />
        <SkeletonPrimitive className="h-3 w-20 rounded" variant="muted" />
      </div>
      <SkeletonPrimitive className="h-4 w-5/6 rounded" variant="default" />
      <SkeletonPrimitive className="h-3 w-full rounded" variant="muted" />
      <div className="pt-2 border-t border-hairline flex items-center justify-between">
        <SkeletonPrimitive className="h-3 w-20 rounded" variant="muted" />
        <SkeletonPrimitive className="h-3 w-16 rounded" variant="brand" />
      </div>
    </div>
  )
}

export function PageGridSkeleton({ count = 6, columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', className = '' }) {
  return (
    <div className={`grid ${columns} gap-6 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleSkeleton key={i} />
      ))}
    </div>
  )
}

export function ArticlePageSkeleton({ className = '' }) {
  return (
    <div className={`mx-auto max-w-4xl space-y-8 py-4 ${className}`} aria-hidden="true">
      <div className="card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <SkeletonPrimitive className="h-5 w-24 rounded-md" variant="brand" />
          <SkeletonPrimitive className="h-4 w-20 rounded" variant="muted" />
        </div>
        <SkeletonPrimitive className="h-8 w-4/5 rounded" variant="default" />
        <SkeletonPrimitive className="h-4 w-2/3 rounded" variant="muted" />
        <div className="pt-4 border-t border-hairline flex items-center justify-between">
          <SkeletonPrimitive className="h-9 w-40 rounded-full" variant="muted" />
          <SkeletonPrimitive className="h-8 w-36 rounded-xl" variant="muted" />
        </div>
      </div>
      <SkeletonPrimitive className="aspect-[16/9] w-full rounded-3xl" variant="surface" />
      <div className="card p-6 sm:p-10 space-y-3">
        <TextSkeleton lines={6} />
      </div>
    </div>
  )
}

export const Skeleton = {
  Text: TextSkeleton,
  Card: CardSkeleton,
  Table: TableSkeleton,
  TableRow: TableRowSkeleton,
  Hero: HeroSkeleton,
  Article: ArticleSkeleton,
  PageGrid: PageGridSkeleton,
  ArticlePage: ArticlePageSkeleton,
  Primitive: SkeletonPrimitive,
}

export default Skeleton
