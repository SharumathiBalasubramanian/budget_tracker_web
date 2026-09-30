import axios from 'axios';

// Backend Base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api/budgets',
  timeout: 5000,
});

// Auto-attach user's JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Fetch all budgets
export const getBudgets = async () => {
  const res = await API.get(`/?t=${Date.now()}`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

// 2. Create budget
export const createBudget = async (data) => {
  const payload = {
    category: data.category,
    monthlyLimit: Number(data.monthlyLimit || data.limit || data.amount),
    spent: Number(data.spent) || 0,
  };
  const res = await API.post('/', payload);
  return res.data?.data || res.data;
};

// 3. Update budget
export const updateBudget = async (id, data) => {
  const payload = {
    category: data.category,
    monthlyLimit: Number(data.monthlyLimit || data.limit || data.amount),
    spent: Number(data.spent) || 0,
  };
  const res = await API.put(`/${id}`, payload);
  return res.data?.data || res.data;
};

// 4. Delete budget
export const deleteBudget = async (id) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};