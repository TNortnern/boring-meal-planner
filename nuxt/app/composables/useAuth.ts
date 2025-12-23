import { createSharedComposable } from '@vueuse/core'

// User interface matching Payload Users collection schema
export interface User {
  id: string
  email: string
  name?: string
  sex?: 'male' | 'female' | 'unspecified'
  age?: number
  height?: {
    value?: number
    unit?: 'cm' | 'in'
  }
  currentWeight?: {
    value?: number
    unit?: 'kg' | 'lbs'
  }
  startingWeight?: number
  goalWeight?: number
  goal?: 'cut' | 'maintain' | 'gain'
  liftingDaysPerWeek?: number
  dailyStepsEstimate?: number
  aggression?: 'safe' | 'aggressive'
  deadlineDate?: string
  dietaryRestrictions?: {
    allergies?: string // comma-separated
    dietaryPattern?: 'none' | 'halal' | 'kosher' | 'vegetarian' | 'pescatarian' | 'vegan'
    excludedFoods?: string // comma-separated
  }
  preferences?: {
    cookEverything?: boolean
    repeatMeals?: boolean
    mealsPerDay?: number
    cardioPreference?: 'incline_walk' | 'bike' | 'none'
  }
  macroTargets?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    fiber?: number
    water?: number
  }
  boringMode?: boolean
}

const _useAuth = () => {
  // Use relative URLs - Nuxt proxies /api/** to Payload
  const apiBase = '/api'

  const user = ref<User | null>(null)
  // Use ref instead of useLocalStorage to avoid SSR hydration mismatch
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // Load token from localStorage (client-side only)
  const loadToken = () => {
    if (import.meta.client && !isInitialized.value) {
      const stored = localStorage.getItem('boring-auth-token')
      token.value = stored
      isInitialized.value = true
    }
  }

  // Save token to localStorage
  const saveToken = (newToken: string | null) => {
    token.value = newToken
    if (import.meta.client) {
      if (newToken) {
        localStorage.setItem('boring-auth-token', newToken)
      } else {
        localStorage.removeItem('boring-auth-token')
      }
    }
  }

  // Fetch current user from Payload
  const fetchUser = async () => {
    console.log('[Auth] fetchUser called, token exists:', !!token.value)
    if (!token.value) return null

    try {
      // Payload /users/me returns user object directly (not wrapped in { user: ... })
      const response = await $fetch<User>(`${apiBase}/users/me`, {
        headers: {
          Authorization: `JWT ${token.value}`
        }
      })
      console.log('[Auth] fetchUser success, user:', response?.email, 'id:', response?.id)
      user.value = response
      return response
    } catch {
      // Token expired or invalid
      saveToken(null)
      user.value = null
      return null
    }
  }

  // Login with email and password
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ token: string, user: User }>(`${apiBase}/users/login`, {
        method: 'POST',
        body: { email, password }
      })

      saveToken(response.token)
      user.value = response.user
      return { success: true, user: response.user }
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string } }
      error.value = fetchError.data?.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Register new user
  const register = async (data: {
    email: string
    password: string
    name?: string
  }) => {
    isLoading.value = true
    error.value = null

    try {
      // Create user
      await $fetch<{ doc: User }>(`${apiBase}/users`, {
        method: 'POST',
        body: data
      })

      // Auto-login after registration
      const loginResult = await login(data.email, data.password)
      return loginResult
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string } }
      error.value = fetchError.data?.message || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      if (token.value) {
        await $fetch(`${apiBase}/users/logout`, {
          method: 'POST',
          headers: {
            Authorization: `JWT ${token.value}`
          }
        })
      }
    } catch {
      // Ignore errors on logout
    } finally {
      saveToken(null)
      user.value = null
    }
  }

  // Update user profile
  const updateProfile = async (updates: Partial<User>) => {
    if (!user.value || !token.value) return { success: false, error: 'Not authenticated' }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ doc: User }>(`${apiBase}/users/${user.value.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `JWT ${token.value}`
        },
        body: updates
      })

      user.value = response.doc
      return { success: true, user: response.doc }
    } catch (err: unknown) {
      const fetchError = err as { data?: { message?: string } }
      error.value = fetchError.data?.message || 'Update failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Initialize auth state on mount
  const init = async () => {
    console.log('[Auth] init called')
    // Load token from localStorage first (client-side only)
    loadToken()
    console.log('[Auth] after loadToken, token exists:', !!token.value)
    if (token.value) {
      await fetchUser()
    }
    console.log('[Auth] init complete, user:', user.value?.email, 'id:', user.value?.id)
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    fetchUser,
    init
  }
}

export const useAuth = createSharedComposable(_useAuth)
