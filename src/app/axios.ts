import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4004/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('interdiscount_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const lang = localStorage.getItem('interdiscount_lang') || 'de';
  config.headers['Accept-Language'] = lang;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('interdiscount_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${apiClient.defaults.baseURL}/public/auth/refresh`,
            { refresh_token: refreshToken },
          );
          const { access_token, refresh_token } = res.data.data;
          localStorage.setItem('interdiscount_token', access_token);
          localStorage.setItem('interdiscount_refresh_token', refresh_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch {
          localStorage.removeItem('interdiscount_token');
          localStorage.removeItem('interdiscount_refresh_token');
          localStorage.removeItem('interdiscount_user');
          window.location.href = '/de/auth/login';
        }
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
