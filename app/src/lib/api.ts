import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API request function
export const apiRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.request<ApiResponse<T>>({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    throw axiosError.response?.data || { success: false, message: 'Network error' };
  }
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ user: any; token: string }>('post', '/api/auth/login', { email, password }),
  
  register: (data: any) =>
    apiRequest<{ user: any; token: string }>('post', '/api/auth/register', data),
  
  getMe: () =>
    apiRequest<{ user: any }>('get', '/api/auth/me'),
  
  updateProfile: (data: any) =>
    apiRequest<{ user: any }>('patch', '/api/auth/profile', data),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest<void>('patch', '/api/auth/change-password', { currentPassword, newPassword }),
  
  logout: () =>
    apiRequest<void>('post', '/api/auth/logout'),
};

// Claims API
export const claimsApi = {
  getClaims: (params?: { status?: string; page?: number; limit?: number; search?: string }) =>
    apiRequest<{ claims: any[]; meta: any }>('get', '/api/claims', undefined, { params }),
  
  getClaimById: (id: string) =>
    apiRequest<{ claim: any }>('get', `/api/claims/${id}`),
  
  getClaimByNumber: (claimNumber: string) =>
    apiRequest<{ claim: any }>('get', `/api/claims/number/${claimNumber}`),
  
  updateStatus: (id: string, status: string, notes?: string) =>
    apiRequest<{ claim: any }>('patch', `/api/claims/${id}/status`, { status, notes }),
  
  submitAnalysis: (id: string, data: { errors: any[]; confidence: number }) =>
    apiRequest<{ claim: any }>('post', `/api/claims/${id}/analysis`, data),
  
  uploadCorrectedDocument: (id: string, file: File, annotations: any[]) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('annotations', JSON.stringify(annotations));
    
    return apiRequest<{ claim: any }>('post', `/api/claims/${id}/corrected-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  sendCorrectedDocument: (id: string) =>
    apiRequest<{ claim: any }>('post', `/api/claims/${id}/send-document`),
  
  getPendingPayments: () =>
    apiRequest<{ data: any[] }>('get', '/api/claims/pending-payments'),
  
  getStats: () =>
    apiRequest<{ data: any }>('get', '/api/claims/stats/overview'),
  
  addNotes: (id: string, notes: string) =>
    apiRequest<{ claim: any }>('patch', `/api/claims/${id}/notes`, { notes }),
  
  deleteClaim: (id: string) =>
    apiRequest<void>('delete', `/api/claims/${id}`),
};

// Hospitals API
export const hospitalsApi = {
  getHospitals: (params?: { status?: string; subscriptionType?: string; page?: number; limit?: number; search?: string }) =>
    apiRequest<{ data: any[]; meta: any }>('get', '/api/hospitals', undefined, { params }),
  
  getHospitalById: (id: string) =>
    apiRequest<{ data: any }>('get', `/api/hospitals/${id}`),
  
  getHospitalByFacilityCode: (code: string) =>
    apiRequest<{ data: any }>('get', `/api/hospitals/facility/${code}`),
  
  createHospital: (data: any) =>
    apiRequest<{ data: any }>('post', '/api/hospitals', data),
  
  updateHospital: (id: string, data: any) =>
    apiRequest<{ data: any }>('patch', `/api/hospitals/${id}`, data),
  
  updateSubscription: (id: string, data: any) =>
    apiRequest<{ data: any }>('patch', `/api/hospitals/${id}/subscription`, data),
  
  getHospitalClaims: (id: string, params?: { status?: string; page?: number; limit?: number }) =>
    apiRequest<{ data: any[]; meta: any }>('get', `/api/hospitals/${id}/claims`, undefined, { params }),
  
  getHospitalPayments: (id: string, params?: { page?: number; limit?: number }) =>
    apiRequest<{ data: any[]; meta: any }>('get', `/api/hospitals/${id}/payments`, undefined, { params }),
  
  getHospitalConversations: (id: string) =>
    apiRequest<{ data: any[] }>('get', `/api/hospitals/${id}/conversations`),
  
  getHospitalStats: (id: string) =>
    apiRequest<{ data: any }>('get', `/api/hospitals/${id}/stats`),
  
  deactivateHospital: (id: string) =>
    apiRequest<{ data: any }>('patch', `/api/hospitals/${id}/deactivate`),
  
  resetMonthlyClaims: (id: string) =>
    apiRequest<{ data: any }>('post', `/api/hospitals/${id}/reset-claims`),
};

// Dashboard API
export const dashboardApi = {
  getStats: () =>
    apiRequest<{ data: any }>('get', '/api/dashboard/stats'),
  
  getRecentActivity: (limit?: number) =>
    apiRequest<{ data: any[] }>('get', '/api/dashboard/activity', undefined, { params: { limit } }),
  
  getClaimsOverview: (days?: number) =>
    apiRequest<{ data: any }>('get', '/api/dashboard/claims-overview', undefined, { params: { days } }),
  
  getRevenueOverview: (days?: number) =>
    apiRequest<{ data: any }>('get', '/api/dashboard/revenue-overview', undefined, { params: { days } }),
  
  getHospitalGrowth: (days?: number) =>
    apiRequest<{ data: any }>('get', '/api/dashboard/hospital-growth', undefined, { params: { days } }),
  
  getPendingActions: () =>
    apiRequest<{ data: any }>('get', '/api/dashboard/pending-actions'),
};

// WhatsApp API
export const whatsappApi = {
  sendMessage: (phoneNumber: string, message: string, type?: string) =>
    apiRequest<any>('post', '/api/whatsapp/send', { phoneNumber, message, type }),
  
  getTemplates: () =>
    apiRequest<any>('get', '/api/whatsapp/templates'),
  
  createTemplate: (data: any) =>
    apiRequest<any>('post', '/api/whatsapp/templates', data),
};

// M-Pesa API
export const mpesaApi = {
  initiateSTKPush: (phoneNumber: string, amount: number, accountReference: string, transactionDesc: string) =>
    apiRequest<any>('post', '/api/mpesa/stkpush', { phoneNumber, amount, accountReference, transactionDesc }),
  
  querySTKPushStatus: (checkoutRequestId: string) =>
    apiRequest<any>('post', '/api/mpesa/query', { checkoutRequestId }),
  
  registerC2BUrls: () =>
    apiRequest<any>('post', '/api/mpesa/register-urls'),
  
  simulateC2BTransaction: (phoneNumber: string, amount: number, accountReference: string) =>
    apiRequest<any>('post', '/api/mpesa/simulate', { phoneNumber, amount, accountReference }),
  
  getPaymentStatus: (checkoutRequestId: string) =>
    apiRequest<any>('get', `/api/mpesa/payments/${checkoutRequestId}`),
};

export default api;
