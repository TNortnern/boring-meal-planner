export type CookieConsentStatus = 'accepted' | 'declined' | null

const COOKIE_CONSENT_KEY = 'boring-cookie-consent'
// Track if we've initialized from localStorage to avoid SSR hydration mismatches
let isInitialized = false

// For testing purposes - reset the initialization state
export function _resetCookieConsentState() {
  isInitialized = false
}

function getStoredConsent(): CookieConsentStatus {
  // During SSR, always return null to ensure consistent rendering
  if (typeof localStorage === 'undefined') {
    return null
  }
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
  if (stored === 'accepted' || stored === 'declined') {
    return stored
  }
  return null
}

export function useCookieConsent() {
  // Initialize with null during SSR to avoid hydration mismatch
  // The actual value will be loaded on client mount
  const consentStatus = ref<CookieConsentStatus>(null)
  const isClient = ref(false)

  // Load from localStorage on client mount
  const init = () => {
    if (typeof localStorage !== 'undefined' && !isInitialized) {
      isClient.value = true
      consentStatus.value = getStoredConsent()
      isInitialized = true
    }
  }

  // Auto-init on client side
  if (import.meta.client) {
    onMounted(init)
  }

  const hasConsent = computed(() => consentStatus.value === 'accepted')
  const hasDeclined = computed(() => consentStatus.value === 'declined')
  const needsConsent = computed(() => consentStatus.value === null)

  function acceptCookies() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
      consentStatus.value = 'accepted'
    }
  }

  function declineCookies() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
      consentStatus.value = 'declined'
    }
  }

  function resetConsent() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(COOKIE_CONSENT_KEY)
      consentStatus.value = null
    }
  }

  return {
    consentStatus: readonly(consentStatus),
    hasConsent,
    hasDeclined,
    needsConsent,
    acceptCookies,
    declineCookies,
    resetConsent,
    init
  }
}
