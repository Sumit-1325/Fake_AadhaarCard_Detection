// API endpoints
export const API_ENDPOINTS = {
  HEALTH: '/health',
  PREDICT: '/predict',
  BATCH_PREDICT: '/batch-predict',
};

// File upload constraints
export const FILE_CONSTRAINTS = {
  MAX_SIZE: 16 * 1024 * 1024, // 16MB
  ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp', 'image/tiff'],
  ALLOWED_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.bmp', '.tiff'],
};

// Prediction thresholds
export const THRESHOLDS = {
  REAL: 60,
  UNCERTAIN_RANGE: 10,
};

// Result colors
export const RESULT_COLORS = {
  REAL: 'from-green-500 to-emerald-600',
  FAKE: 'from-red-500 to-rose-600',
  UNCERTAIN: 'from-yellow-500 to-amber-600',
};

// Messages
export const MESSAGES = {
  SUCCESS: 'Analysis completed successfully',
  ERROR: 'An error occurred during analysis',
  NO_FILE: 'Please select a file',
  INVALID_FILE: 'Invalid file type',
  FILE_TOO_LARGE: 'File size exceeds 16MB',
  SERVER_ERROR: 'Cannot connect to server',
};