import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('useCookieConsent', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('initializes with null consent status when no stored preference exists', () => {
    const { consentStatus } = useCookieConsent()
    expect(consentStatus.value).toBeNull()
  })

  it('loads stored consent preference immediately', () => {
    localStorage.setItem('boring-cookie-consent', 'accepted')

    const { consentStatus, hasConsent } = useCookieConsent()

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

  it('handles declined status correctly', () => {
    localStorage.setItem('boring-cookie-consent', 'declined')

    const { hasConsent, hasDeclined, needsConsent } = useCookieConsent()

    expect(hasConsent.value).toBe(false)
    expect(hasDeclined.value).toBe(true)
    expect(needsConsent.value).toBe(false)
  })
})
