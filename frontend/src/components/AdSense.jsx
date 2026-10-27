import { useEffect } from 'react'

/**
 * AdSense Component (Pre-Approval Safe)
 *
 * Prevents rendering empty placeholder boxes or calling `adsbygoogle.push()`
 * when slot IDs are dummy, missing, or unverified. This prevents Google
 * AdSense crawler flags during the initial approval review.
 */
const DUMMY_SLOTS = new Set([
  '1234567890',
  '0000000000',
  '1111111111',
  'YOUR_SLOT_ID',
  'DEMO_SLOT_ID',
  'XXXXX',
])

export default function AdSense({
  slot,
  client = 'ca-pub-3267638418796867',
  format = 'auto',
  responsive = 'true',
  style = { display: 'block' },
  className = '',
}) {
  const isDummySlot = !slot || DUMMY_SLOTS.has(String(slot).trim()) || String(slot).trim().length < 8

  useEffect(() => {
    if (isDummySlot) return

    try {
      if (typeof window !== 'undefined') {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (e) {
      // Catch adsbygoogle push errors quietly so they don't break page rendering
      if (process.env.NODE_ENV === 'development') {
        console.warn('AdSense push error:', e)
      }
    }
  }, [slot, isDummySlot])

  // Guard against dummy/placeholder slot IDs so they do not attempt to push to adsbygoogle
  // or render empty, broken boxes during the Google review phase
  if (isDummySlot) {
    return null
  }

  return (
    <div className={`adsense-wrapper my-4 text-center overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  )
}
