import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期或无效，清除并跳转到登录页
      localStorage.removeItem('token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getArticles = (search, page = 1, pageSize = 10) => {
  const params = { page, page_size: pageSize };
  if (search) params.search = search;
  return api.get('/articles', { params });
};
export const getArticle = (id) => api.get(`/article/${id}`);
export const getArchive = () => api.get('/archive');
export const getTags = () => api.get('/tags');
export const createArticle = (data) => api.post('/article', data);
export const updateArticle = (id, data) => api.put(`/article/${id}`, data);
export const deleteArticle = (id) => api.delete(`/article/${id}`);

export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);

export const getStatistics = () => api.get('/stats');
export const getAdminStatistics = () => api.get('/stats/admin');

export default api;
