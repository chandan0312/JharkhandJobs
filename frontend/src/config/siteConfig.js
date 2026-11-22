// Site-wide configuration constants
// Used for contact info, branding, and AdSense readiness

export const SITE_CONFIG = {
  name: 'Jharkhand JobAlert X',
  url: 'https://jharkhand.jobalertx.com',
  favicon: 'https://jharkhand.jobalertx.com/favicon.svg',

  // Contact information (use for AdSense submission)
  contact: {
    email: 'support@jobalertx.com',
    phone: '+91 8789862771',
  },

  // AdSense readiness notice
  adsense: {
    // Set to false for AdSense submission, true after approval
    isApproved: false,
    // Placeholder slot IDs that should NOT render ads
    safeSlots: ['1234567890', '0000000000', '1111111111', 'YOUR_SLOT_ID', 'DEMO_SLOT_ID', 'XXXXX'],
  },
}

export default SITE_CONFIG