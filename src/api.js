// src/api.js

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Create axios instance with custom config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 300000, // 5 minutes for large file uploads
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // For file uploads, remove timeout and set proper headers
    if (config.data instanceof FormData) {
      config.timeout = 0; // No timeout for file uploads
      delete config.headers['Content-Type']; // Let browser set it with boundary
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - file might be too large');
      error.message = 'Upload timeout - please try with a smaller file or check your connection';
    } else if (error.response?.status === 413) {
      error.message = 'File too large - maximum size is 600MB';
    } else if (error.response?.status === 415) {
      error.message = 'File type not supported';
    } else if (!error.response) {
      error.message = 'Network error - please check your connection';
    }
    return Promise.reject(error);
  }
);

export default {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  
  // Special method for file uploads with progress tracking
  uploadFile: (file, parent = null, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (parent) formData.append('parent', parent);
    
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 0, // No timeout for uploads
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  }
};