export type CookieConsentStatus = 'accepted' | 'declined' | null

const COOKIE_CONSENT_KEY = 'boring-cookie-consent'

function getStoredConsent(): CookieConsentStatus {
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
  const consentStatus = ref<CookieConsentStatus>(getStoredConsent())

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
    resetConsent
  }
}
