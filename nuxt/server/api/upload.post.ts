import { promises as fs } from 'node:fs'
import { join } from 'node:path'

// File size limit: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Allowed image MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
]

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif']

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    // Parse multipart form data using Nuxt's built-in method
    const formData = await readMultipartFormData(event)

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No file uploaded'
      })
    }

    const fileField = formData.find(f => f.name === 'file')
    if (!fileField || !fileField.data) {
      throw createError({
        statusCode: 400,
        message: 'No file found in upload'
      })
    }

    const fileName = fileField.filename || 'upload'
    const mimeType = fileField.type || 'application/octet-stream'

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw createError({
        statusCode: 400,
        message: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
      })
    }

    // Validate file extension
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      throw createError({
        statusCode: 400,
        message: `Invalid file extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`
      })
    }

    // Validate file size
    if (fileField.data.length > MAX_FILE_SIZE) {
      throw createError({
        statusCode: 400,
        message: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      })
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const storageFileName = `progress-photos/${timestamp}-${randomString}.${extension}`

    // Check if Bunny CDN is configured
    const storageZone = config.bunnyStorageZone
    const storageApiKey = config.bunnyStorageApiKey
    const storageHostname = config.bunnyStorageHostname || 'storage.bunnycdn.com'

    // If Bunny CDN is configured, upload to it
    if (storageZone && storageApiKey) {
      try {
        const uploadUrl = `https://${storageHostname}/${storageZone}/${storageFileName}`

        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'AccessKey': storageApiKey as string,
            'Content-Type': mimeType
          },
          body: new Uint8Array(fileField.data)
        })

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text()
          console.error('Bunny CDN upload failed:', errorText)
          // Fall through to local storage on error
          throw new Error(`Bunny CDN upload failed: ${errorText}`)
        }

        // Construct the CDN URL
        const cdnHostname = config.public.bunnyCdnHostname
        const cdnUrl = cdnHostname
          ? `https://${cdnHostname}/${storageFileName}`
          : `https://${storageZone}.b-cdn.net/${storageFileName}`

        return {
          success: true,
          url: cdnUrl,
          storage: 'bunny'
        }
      } catch (bunnyError: unknown) {
        console.error('Bunny CDN upload error, falling back to local storage:', bunnyError instanceof Error ? bunnyError.message : bunnyError)
        // Continue to local storage fallback
      }
    }

    // Local storage fallback
    console.log('Using local storage for file upload')

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'progress-photos')
    await fs.mkdir(uploadsDir, { recursive: true })

    // Save file locally
    const localFileName = `${timestamp}-${randomString}.${extension}`
    const localFilePath = join(uploadsDir, localFileName)
    await fs.writeFile(localFilePath, fileField.data)

    // Return local URL
    const localUrl = `/uploads/progress-photos/${localFileName}`

    return {
      success: true,
      url: localUrl,
      storage: 'local'
    }
  } catch (error: unknown) {
    console.error('Upload error:', error)

    // Don't expose internal errors, but log them
    const err = error as { statusCode?: number, message?: string }
    const statusCode = err.statusCode || 500
    const message = err.statusCode
      ? err.message
      : 'Upload failed. Please try again.'

    throw createError({
      statusCode,
      message
    })
  }
})
