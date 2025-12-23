import { describe, it, expect, beforeEach, vi } from 'vitest'
import { _resetCookieConsentState } from '~/composables/useCookieConsent'

describe('useCookieConsent', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset the module's initialization state
    _resetCookieConsentState()
    vi.clearAllMocks()
  })

  it('initializes with null consent status when no stored preference exists', () => {
    const { consentStatus } = useCookieConsent()
    expect(consentStatus.value).toBeNull()
  })

  it('loads stored consent preference when init is called', () => {
    localStorage.setItem('boring-cookie-consent', 'accepted')

    const { consentStatus, hasConsent, init } = useCookieConsent()

    // Before init, should be null (SSR-safe default)
    expect(consentStatus.value).toBeNull()

    // After init, should load from localStorage
    init()
    expect(consentStatus.value).toBe('accepted')
    expect(hasConsent.value).toBe(true)
  })

  it('stores acceptance in localStorage when accepting cookies', () => {
    const { acceptCookies, consentStatus, hasConsent } = useCookieConsent()

    acceptCookies()

    expect(localStorage.getItem('boring-cookie-consent')).toBe('accepted')
    expect(consentStatus.value).toBe('accepted')
    expect(hasConsent.value).toBe(true)
  })

  it('stores decline in localStorage when declining cookies', () => {
    const { declineCookies, consentStatus, hasDeclined } = useCookieConsent()

    declineCookies()

    expect(localStorage.getItem('boring-cookie-consent')).toBe('declined')
    expect(consentStatus.value).toBe('declined')
    expect(hasDeclined.value).toBe(true)
  })

  it('identifies when consent is needed', () => {
    const { needsConsent } = useCookieConsent()

    expect(needsConsent.value).toBe(true)
  })

  it('identifies when consent has been given', () => {
    const { acceptCookies, needsConsent } = useCookieConsent()

    acceptCookies()

    expect(needsConsent.value).toBe(false)
  })

  it('resets consent preference when reset is called', () => {
    const { acceptCookies, resetConsent, consentStatus, needsConsent } = useCookieConsent()

    acceptCookies()
    expect(consentStatus.value).toBe('accepted')

    resetConsent()

    expect(localStorage.getItem('boring-cookie-consent')).toBeNull()
    expect(consentStatus.value).toBeNull()
    expect(needsConsent.value).toBe(true)
  })

  it('handles declined status correctly after init', () => {
    localStorage.setItem('boring-cookie-consent', 'declined')

    const { hasConsent, hasDeclined, needsConsent, init } = useCookieConsent()

    // Load from localStorage
    init()

    expect(hasConsent.value).toBe(false)
    expect(hasDeclined.value).toBe(true)
    expect(needsConsent.value).toBe(false)
  })
})
