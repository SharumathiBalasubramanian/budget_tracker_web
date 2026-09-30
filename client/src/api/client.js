import axios from 'axios';

// Detects Vite (.env: VITE_API_URL) or Create React App (.env: REACT_APP_API_URL), falls back to localhost
const baseURL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
  'http://localhost:5000/api';

const client = axios.create({
  baseURL,
  timeout: 10000,
});

// Auto-attach JWT token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;