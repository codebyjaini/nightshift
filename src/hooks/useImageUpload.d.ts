/**
 * Image upload result
 */
export interface ImageUploadResult {
  url: string | null;
  error: string | null;
}

/**
 * Image upload hook return type
 */
export interface UseImageUploadReturn {
  uploadImage: (file: File, patientId: string) => Promise<ImageUploadResult>;
  uploading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Custom hook for handling image uploads
 */
export function useImageUpload(): UseImageUploadReturn;

export default useImageUpload;
