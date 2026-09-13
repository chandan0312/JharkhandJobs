import {
  Landmark,
  Scale,
  Banknote,
  TrainFront,
  ShieldCheck,
  GraduationCap,
  Siren,
  Anchor,
  Building2,
} from 'lucide-react'

// Map seed-data icon keys to lucide-react components.
const ICONS = {
  landmark: Landmark,
  scale: Scale,
  banknote: Banknote,
  train: TrainFront,
  shield: ShieldCheck,
  graduation: GraduationCap,
  siren: Siren,
  anchor: Anchor,
  building: Building2,
}

// Convert a #rrggbb hex to an rgba() string at the given alpha.
function hexToRgba(hex = '#1B6F81', alpha = 0.1) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return `rgba(27, 111, 129, ${alpha})`
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const num = parseInt(full, 16)
  if (isNaN(num)) return `rgba(27, 111, 129, ${alpha})`
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * A circular (or rounded-square) "emblem" badge for an organisation/category.
 * Renders a tinted background + coloured lucide icon so we get consistent,
 * self-contained logos without external image assets.
 */
export default function BrandIcon({
  icon,
  color = '#5558e6',
  size = 44,
  square = false,
  className = '',
}) {
  const Icon = ICONS[icon] || Building2
  const iconSize = Math.round(size * 0.5)
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${
        square ? 'rounded-xl' : 'rounded-full'
      } ring-1 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: hexToRgba(color, 0.1),
        color,
        borderColor: 'transparent',
        boxShadow: `inset 0 0 0 1px ${hexToRgba(color, 0.16)}`,
      }}
      aria-hidden="true"
    >
      <Icon size={iconSize} strokeWidth={2} />
    </span>
  )
}
