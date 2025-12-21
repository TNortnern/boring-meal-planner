/**
 * API utility for making authenticated requests to Payload CMS
 * Follows the pattern established in useAuth.ts
 */

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PayloadListResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface PayloadDocResponse<T> {
  doc: T
  message?: string
}

/**
 * Makes an authenticated API request to Payload CMS
 * Uses relative URLs which Nuxt proxies to Payload
 */
export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    body?: unknown
    query?: Record<string, string | number | boolean | undefined>
  } = {}
): Promise<ApiResponse<T>> {
  const { token } = useAuth()

  try {
    const response = await $fetch(endpoint, {
      method: options.method || 'GET',
      headers: token.value
        ? { Authorization: `JWT ${token.value}` }
        : undefined,
      body: options.body as Record<string, unknown> | undefined,
      query: options.query
    })

    return { success: true, data: response as T }
  } catch (err: unknown) {
    const fetchError = err as { data?: { message?: string }, statusCode?: number }
    const errorMessage = fetchError.data?.message
      || (fetchError.statusCode === 401 ? 'Not authenticated' : 'Request failed')

    return { success: false, error: errorMessage }
  }
}

/**
 * GET request helper
 */
export async function apiGet<T>(
  endpoint: string,
  query?: Record<string, string | number | boolean | undefined>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'GET', query })
}

/**
 * POST request helper
 */
export async function apiPost<T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'POST', body })
}

/**
 * PATCH request helper
 */
export async function apiPatch<T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'PATCH', body })
}

/**
 * DELETE request helper
 */
export async function apiDelete<T>(
  endpoint: string
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' })
}

/**
 * Helper to format dates for Payload queries
 */
export function formatDateForPayload(date: Date): string {
  return date.toISOString().split('T')[0]!
}

/**
 * Helper to check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDateForPayload(date1) === formatDateForPayload(date2)
}
