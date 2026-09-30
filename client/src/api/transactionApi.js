import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/transactions',
  timeout: 5000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Cache ஆகாமல் தடுக்க Date.now() சேர்க்கப்பட்டுள்ளது
export const getTransactions = async () => {
  const res = await API.get(`/?t=${Date.now()}`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createTransaction = async (data) => {
  const payload = {
    ...data,
    amount: Number(data.amount),
    type: String(data.type).toLowerCase().includes('incom') ? 'Income' : 'Expense',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    note: data.note || '',
  };
  const res = await API.post('/', payload);
  return res.data?.data || res.data;
};

export const updateTransaction = async (id, data) => {
  const payload = {
    ...data,
    amount: Number(data.amount),
    type: String(data.type).toLowerCase().includes('incom') ? 'Income' : 'Expense',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    note: data.note || '',
  };
  const res = await API.put(`/${id}`, payload);
  return res.data?.data || res.data;
};

export const deleteTransaction = async (id) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};