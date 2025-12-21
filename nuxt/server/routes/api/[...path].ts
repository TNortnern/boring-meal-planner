/**
 * Proxy all /api/** requests to Payload CMS
 * This is more reliable than routeRules proxy in development
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = event.context.params?.path || ''
  // Default to localhost:3009 for development, use env var for production/docker
  const payloadUrl = process.env.NUXT_PAYLOAD_API_URL || config.payloadApiUrl || 'http://localhost:3009'
  // Ensure we're not using Docker hostname in local dev
  const baseUrl = payloadUrl.includes('payload:') ? 'http://localhost:3009' : payloadUrl
  const targetUrl = `${baseUrl}/api/${path}`

  // Get query string
  const query = getQuery(event)
  const queryString = new URLSearchParams(
    Object.entries(query).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value)
      }
      return acc
    }, {} as Record<string, string>)
  ).toString()

  const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl

  // Get request body for non-GET requests
  let body: unknown
  const method = event.method
  if (method !== 'GET' && method !== 'HEAD') {
    body = await readBody(event)
  }

  // Forward headers (except host)
  const headers: Record<string, string> = {}
  const incomingHeaders = getHeaders(event)
  for (const [key, value] of Object.entries(incomingHeaders)) {
    if (key.toLowerCase() !== 'host' && value) {
      headers[key] = value
    }
  }

  try {
    const response = await $fetch.raw(fullUrl, {
      method: method as 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
      headers,
      body: body as Record<string, unknown> | undefined
    })

    // Forward response headers
    const responseHeaders = response.headers
    for (const [key, value] of responseHeaders.entries()) {
      if (key.toLowerCase() !== 'content-encoding') {
        setHeader(event, key, value)
      }
    }

    return response._data
  } catch (error: unknown) {
    const fetchError = error as { statusCode?: number, data?: unknown, message?: string }

    if (fetchError.statusCode) {
      setResponseStatus(event, fetchError.statusCode)
      return fetchError.data
    }

    throw createError({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      message: `Failed to proxy to Payload: ${fetchError.message || 'Unknown error'}`
    })
  }
})
