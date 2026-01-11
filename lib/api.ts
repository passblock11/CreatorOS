import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4004/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getMe: () => api.get('/auth/me'),
  
  updateProfile: (data: { name: string }) =>
    api.put('/auth/profile', data),
};

export const postsAPI = {
  create: (data: any) => api.post('/posts', data),
  
  getAll: (params?: any) => api.get('/posts', { params }),
  
  getOne: (id: string) => api.get(`/posts/${id}`),
  
  update: (id: string, data: any) => api.put(`/posts/${id}`, data),
  
  delete: (id: string) => api.delete(`/posts/${id}`),
  
  publish: (id: string) => api.post(`/posts/${id}/publish`),
  
  getAnalytics: () => api.get('/posts/analytics'),
};

export const snapchatAPI = {
  getAuthURL: () => api.get('/snapchat/auth-url'),
  
  disconnect: () => api.post('/snapchat/disconnect'),
  
  getStatus: () => api.get('/snapchat/status'),
};

export const stripeAPI = {
  getPlans: () => api.get('/stripe/plans'),
  
  createCheckout: (plan: string) => api.post('/stripe/create-checkout', { plan }),
  
  createPortalSession: () => api.post('/stripe/create-portal-session'),
  
  cancelSubscription: () => api.post('/stripe/cancel-subscription'),
};

export const adminAPI = {
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  
  getStats: () => api.get('/admin/stats'),
  
  getApiLogs: (params?: any) => api.get('/admin/logs', { params }),
};

export default api;
