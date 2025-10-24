// ...existing code...
import axios from 'axios';

/**
 * Resolve env value safely in both CRA and Vite (and optional runtime window.__ENV)
 */
const resolveEnv = (craKey, viteKey) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
    return import.meta.env[viteKey];
  }
  if (typeof process !== 'undefined' && process.env && process.env[craKey]) {
    return process.env[craKey];
  }
  if (typeof window !== 'undefined' && window.__ENV && window.__ENV[craKey]) {
    return window.__ENV[craKey];
  }
  return undefined;
};

const API_URL = resolveEnv('REACT_APP_API_URL', 'VITE_API_URL') || 'http://localhost:5000';
const API_BASE_PATH = resolveEnv('REACT_APP_API_BASE_PATH', 'VITE_API_BASE_PATH') || '/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: `${API_URL}${API_BASE_PATH}`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 30000, // 30 seconds
});

// API service object
const api = {
  /**
   * Health check endpoint
   */
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Predict single image - MAIN FUNCTION THAT CONNECTS TO BACKEND
   * @param {File} file - Image file to analyze
   */
  predictImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Batch predict images in a folder
   * @param {string} folderPath - Path to folder containing images
   */
  predictBatch: async (folderPath) => {
    try {
      const response = await apiClient.post(
        '/batch-predict',
        { folder_path: folderPath },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

/**
 * Error handler
 */
const handleError = (error) => {
  if (error && error.response) {
    // Server responded with error
    return {
      message: (error.response.data && error.response.data.error) || 'Server error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error && error.request) {
    // Request made but no response
    return {
      message: 'Cannot connect to server. Please ensure backend is running.',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      message: (error && error.message) || 'An unexpected error occurred',
      status: -1,
    };
  }
};

export default api;
// ...existing code...