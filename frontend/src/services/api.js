import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout for agent execution
  withCredentials: true,
});

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Request interceptor to ensure token is set on each request
apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('insightflow_auth');
      authToken = null;
      delete apiClient.defaults.headers.common['Authorization'];
      // Redirect to login if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Health check
  getHealth: async () => {
    const response = await apiClient.get('/api/health');
    return response.data;
  },

  // Auth endpoints
  register: async (name, email, password) => {
    const response = await apiClient.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  // List all available datasets
  getDatasets: async () => {
    const response = await apiClient.get('/api/datasets');
    return response.data;
  },

  // Get schema & preview details for a dataset
  getDatasetDetails: async (datasetId) => {
    const response = await apiClient.get(`/api/datasets/${encodeURIComponent(datasetId)}`);
    return response.data;
  },

  // Upload CSV or Excel dataset
  uploadDataset: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Remove an uploaded dataset file
  deleteDataset: async (datasetId) => {
    const response = await apiClient.delete(`/api/datasets/${encodeURIComponent(datasetId)}`);
    return response.data;
  },

  // Submit natural language question
  askQuestion: async (datasetId, question) => {
    const response = await apiClient.post('/api/query', {
      dataset_id: datasetId,
      question: question,
    });
    return response.data;
  },

  // Get interaction logs history
  getHistory: async (limit = 50) => {
    const response = await apiClient.get(`/api/history?limit=${limit}`);
    return response.data;
  },

  // ─── V2 Endpoints ────────────────────────────────────────

  // Get comprehensive profiling report
  getProfile: async (datasetId) => {
    const response = await apiClient.get(`/api/profile/${encodeURIComponent(datasetId)}`);
    return response.data;
  },

  // Get quality score + validation issues
  getQualityScore: async (datasetId) => {
    const response = await apiClient.get(`/api/quality/${encodeURIComponent(datasetId)}`);
    return response.data;
  },

  // Get auto-generated insights
  getInsights: async (datasetId) => {
    const response = await apiClient.get(`/api/insights/${encodeURIComponent(datasetId)}`);
    return response.data;
  },

  // Clean dataset with specified operations
  cleanDataset: async (datasetId, operations = []) => {
    const response = await apiClient.post('/api/clean', {
      dataset_id: datasetId,
      operations: operations,
    });
    return response.data;
  },

  // Get rich dataset summary (LLM context)
  getDatasetSummary: async (datasetId) => {
    const response = await apiClient.get(`/api/summary/${encodeURIComponent(datasetId)}`);
    return response.data;
  },

  // Export analysis result as PDF
  exportPdf: async (analysisResult, datasetName) => {
    const response = await apiClient.post('/api/export/pdf', {
      analysis_result: analysisResult,
      dataset_name: datasetName,
    }, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;