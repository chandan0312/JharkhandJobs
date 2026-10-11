// ---------------------------------------------------------------------------
// Google Identity Services loader + sign-in button helper.
// ---------------------------------------------------------------------------
// The GSI script must be loaded exactly once per page load. The previous
// approach appended a <script> in a useEffect and removed it on cleanup, which
// breaks under React StrictMode (mount -> cleanup -> mount) and again whenever
// two pages that both want a Google button are visited in one session.
//
// `loadGoogleIdentity()` caches a single promise, so every caller shares one
// script tag and the library is never torn down.
// ---------------------------------------------------------------------------

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

const GSI_SRC = 'https://accounts.google.com/gsi/client'

let loaderPromise = null

/**
 * Resolve with `window.google` once Google Identity Services is ready.
 * Rejects if the script cannot be reached (offline, blocked by an extension,
 * or a content blocker).
 *
 * @returns {Promise<typeof window.google>}
 */
export function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google)
  if (loaderPromise) return loaderPromise

  loaderPromise = new Promise((resolve, reject) => {
    const finish = () => {
      if (window.google?.accounts?.id) resolve(window.google)
      else reject(new Error('Google Identity Services loaded but is unavailable.'))
    }

    // Reuse a tag another caller already added rather than adding a second one.
    const existing = document.querySelector(`script[src="${GSI_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', finish, { once: true })
      existing.addEventListener(
        'error',
        () => reject(new Error('Failed to load Google Identity Services.')),
        { once: true }
      )
      return
    }

    const script = document.createElement('script')
    script.src = GSI_SRC
    script.async = true
    script.defer = true
    script.onload = finish
    script.onerror = () => reject(new Error('Failed to load Google Identity Services.'))
    document.head.appendChild(script)
  })

  // A failed load should not be cached forever — let the next mount retry.
  loaderPromise.catch(() => {
    loaderPromise = null
  })

  return loaderPromise
}

/**
 * Initialise GSI and draw the official Google button inside `container`.
 *
 * `renderButton` measures its parent, so the container must be visible (not
 * `display: none`) when this runs, and it needs an explicit width — GSI clamps
 * to 200–400px and silently misrenders outside that range.
 *
 * @param {HTMLElement} container   Visible, empty mount point.
 * @param {object}      options
 * @param {(res: {credential: string}) => void} options.onCredential
 * @param {string}     [options.text] GSI button text key, e.g. 'continue_with'.
 */
export function renderGoogleButton(container, { onCredential, text = 'continue_with' }) {
  const google = window.google

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: onCredential,
    auto_select: false,
    cancel_on_tap_outside: true,
    // Keeps sign-in working in Safari/Firefox with tracking protection on.
    itp_support: true,
    use_fedcm_for_prompt: true,
  })

  // Clear first: a re-render (StrictMode, hot reload, navigating back) would
  // otherwise stack a second button iframe on top of the first.
  container.innerHTML = ''

  const width = Math.round(Math.min(400, Math.max(200, container.offsetWidth || 320)))

  const isDark = document.documentElement.classList.contains('dark')

  google.accounts.id.renderButton(container, {
    theme: isDark ? 'filled_black' : 'outline',
    size: 'large',
    shape: 'rectangular',
    text,
    logo_alignment: 'left',
    width,
  })
}

export default loadGoogleIdentity
