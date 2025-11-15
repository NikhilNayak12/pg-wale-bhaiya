// API configuration for PG Wale Bhaiya frontend
import axios from 'axios';

// Base URL for the API - Always use production URL (Firestore already has data)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-y7s7mjbnma-uc.a.run.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Firebase auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminData');
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('landlordData');
      
      // Redirect to login (no real backend token refresh in demo mode)
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// =============== API Functions ===============

// Health check
export const healthCheck = () => api.get('/health');

// =============== PG Listings ===============
export const getAllPGs = (params = {}) => api.get('/pgs', { params });
export const getPGById = (id) => api.get(`/pgs/${id}`);
export const createPG = (data) => api.post('/pgs', data);
export const updatePG = (id, data) => api.put(`/pgs/${id}`, data);
export const deletePG = (id) => api.delete(`/pgs/${id}`);
export const updatePGStatus = (id, data) => api.patch(`/pgs/${id}/status`, data);
export const incrementPGViews = (id) => api.post(`/pgs/${id}/view`);

// =============== Search ===============
export const searchPGs = (params) => api.get('/search', { params });

// =============== Inquiries ===============
export const createInquiry = (pgId, data) => api.post(`/pgs/${pgId}/inquire`, data);
export const getPGInquiries = (pgId, params = {}) => api.get(`/pgs/${pgId}/inquiries`, { params });
export const getAllInquiries = (params = {}) => api.get('/inquiries', { params });
export const updateInquiryStatus = (id, status) => api.patch(`/inquiries/${id}/status`, { status });

// =============== Admin ===============
export const adminLogin = (credentials) => api.post('/admin-login', credentials);
export const getAdminDashboard = () => api.get('/admin/dashboard');

// =============== Landlords ===============
export const createLandlord = (data) => api.post('/landlords', data);
export const getAllLandlords = (params = {}) => api.get('/landlords', { params });
export const getLandlordById = (id) => api.get(`/landlords/${id}`);

// =============== Amenities ===============
export const getAmenities = () => api.get('/amenities');

// =============== Contact ===============
export const submitContact = (data) => api.post('/contact', data);

// =============== Auth Helpers ===============
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('adminData');
  localStorage.removeItem('landlordData');
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Export the configured axios instance
export default api;
