export const useBunnyUpload = () => {
  const _config = useRuntimeConfig()

  interface UploadResult {
    success: boolean
    url?: string
    error?: string
  }

  const uploadFile = async (file: File, folder: string = 'progress-photos'): Promise<UploadResult> => {
    try {
      // Generate a unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop()
      const fileName = `${folder}/${timestamp}-${randomString}.${extension}`

      // Create FormData and append the file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileName', fileName)

      // Upload to our API route which will handle Bunny CDN upload
      const response = await $fetch<{ success: boolean, url?: string, error?: string }>('/api/upload', {
        method: 'POST',
        body: formData
      })

      return response
    } catch (err: unknown) {
      console.error('Upload error:', err)
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Upload failed'
      }
    }
  }

  const uploadProgressPhoto = async (file: File): Promise<UploadResult> => {
    return uploadFile(file, 'progress-photos')
  }

  return {
    uploadFile,
    uploadProgressPhoto
  }
}
