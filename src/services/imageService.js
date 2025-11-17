import { supabase } from './supabaseClient'
import { handleError } from '../utils/errorHandler'

/**
 * Image Service
 * Handles image validation and upload to Supabase Storage
 */

// Constants for image validation
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

/**
 * Validate image file before upload
 * @param {File} file - Image file to validate
 * @returns {Object} Validation result with valid flag and error message
 */
export const validateImage = (file) => {
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: 'No file provided',
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)
    return {
      valid: false,
      error: `File size must be less than ${sizeMB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
    }
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP formats are allowed',
    }
  }

  // Check file extension as additional validation
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return {
      valid: false,
      error: 'Invalid file extension. Only .jpg, .jpeg, .png, and .webp are allowed',
    }
  }

  return {
    valid: true,
    error: null,
  }
}

/**
 * Upload image to Supabase Storage
 * @param {File} file - Image file to upload
 * @param {string} patientId - Patient UUID for file naming
 * @returns {Promise<{url: string|null, error: Error|string|null}>}
 */
export const uploadImage = async (file, patientId) => {
  try {
    // Validate image first
    const validation = validateImage(file)
    if (!validation.valid) {
      return { url: null, error: validation.error }
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const timestamp = Date.now()
    const fileName = `${patientId}-${timestamp}.${fileExtension}`
    const filePath = `patient-images/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('patient-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      const errorInfo = handleError(uploadError, 'upload image')
      return {
        url: null,
        error: errorInfo.message,
        canRetry: errorInfo.canRetry,
      }
    }

    // Get public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from('patient-images')
      .getPublicUrl(filePath)

    if (!urlData || !urlData.publicUrl) {
      return {
        url: null,
        error: 'Failed to get public URL for uploaded image. Please try again.',
        canRetry: true,
      }
    }

    return {
      url: urlData.publicUrl,
      error: null,
    }
  } catch (error) {
    const errorInfo = handleError(error, 'upload image')
    return {
      url: null,
      error: errorInfo.message,
      canRetry: errorInfo.canRetry,
    }
  }
}

/**
 * Delete image from Supabase Storage
 * @param {string} imageUrl - Public URL of the image to delete
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export const deleteImage = async (imageUrl) => {
  try {
    // Extract file path from public URL
    const urlParts = imageUrl.split('/patient-images/')
    if (urlParts.length < 2) {
      return {
        success: false,
        error: 'Invalid image URL',
      }
    }

    const filePath = `patient-images/${urlParts[1]}`

    // Delete file from storage
    const { error } = await supabase.storage
      .from('patient-images')
      .remove([filePath])

    if (error) {
      console.error('Error deleting image:', error)
      return { success: false, error }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error deleting image:', error)
    return { success: false, error }
  }
}

// Export all functions as a service object
export const imageService = {
  validateImage,
  uploadImage,
  deleteImage,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
}

export default imageService
