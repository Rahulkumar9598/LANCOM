import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error.response?.data?.code;
    if (code === 'SERVICE_EXPIRED') {
      // Update stored department so PrivateRoute also redirects on next navigation
      try {
        const dept = JSON.parse(localStorage.getItem('department') || '{}');
        dept.serviceExpiresAt = new Date(Date.now() - 1000).toISOString(); // mark as expired
        localStorage.setItem('department', JSON.stringify(dept));
      } catch (_) {}
      window.location.href = '/service-expired';
    }
    if (code === 'CLOCK_TAMPERED') {
      alert('System clock tampering detected. Please restore your system time.');
    }
    return Promise.reject(error);
  }
);

export default API;
