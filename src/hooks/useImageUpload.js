import { useState } from 'react'
import { imageService } from '../services/imageService'

/**
 * Custom hook for handling image uploads
 * Provides upload functionality with loading and error states
 * 
 * @returns {Object} Hook state and functions
 * @returns {Function} uploadImage - Function to upload an image
 * @returns {boolean} uploading - Loading state during upload
 * @returns {string|null} error - Error message if upload fails
 * @returns {Function} clearError - Function to clear error state
 */
export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Upload an image file to Supabase Storage
   * @param {File} file - Image file to upload
   * @param {string} patientId - Patient UUID for file naming
   * @returns {Promise<{url: string|null, error: string|null}>}
   */
  const uploadImage = async (file, patientId) => {
    // Reset error state
    setError(null)
    setUploading(true)

    try {
      // Validate image before upload
      const validation = imageService.validateImage(file)
      if (!validation.valid) {
        setError(validation.error)
        setUploading(false)
        return { url: null, error: validation.error }
      }

      // Upload image to Supabase Storage
      const { url, error: uploadError } = await imageService.uploadImage(file, patientId)

      if (uploadError) {
        setError(uploadError)
        setUploading(false)
        return { url: null, error: uploadError }
      }

      setUploading(false)
      return { url, error: null }
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred during upload'
      setError(errorMessage)
      setUploading(false)
      return { url: null, error: errorMessage }
    }
  }

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null)
  }

  return {
    uploadImage,
    uploading,
    error,
    clearError,
  }
}

export default useImageUpload
