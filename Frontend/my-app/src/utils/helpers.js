import { FILE_CONSTRAINTS } from './constants';

/**
 * Validate file before upload
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file size
  if (file.size > FILE_CONSTRAINTS.MAX_SIZE) {
    return { 
      valid: false, 
      error: `File size exceeds ${FILE_CONSTRAINTS.MAX_SIZE / (1024 * 1024)}MB` 
    };
  }

  // Check file type
  if (!FILE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Please upload an image file.' 
    };
  }

  return { valid: true };
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get result color class based on prediction
 */
export const getResultColor = (prediction, score, threshold) => {
  if (prediction === 'REAL') return 'from-green-500 to-emerald-600';
  if (prediction === 'FAKE') return 'from-red-500 to-rose-600';
  return 'from-yellow-500 to-amber-600';
};

/**
 * Get score color
 */
export const getScoreColor = (score) => {
  if (score >= 75) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
};

/**
 * Create image preview URL
 */
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revoke image preview URL to free memory
 */
export const revokeImagePreview = (url) => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};