// client/src/api/authApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth'
});

export const signupUser = async (data) => {
  const payload = {
    firstName: data.firstName || data.firstname || data.first_name || '',
    lastName: data.lastName || data.lastname || data.last_name || '',
    email: data.email || data.gmail || '',
    password: data.password || '',
    confirmPassword: data.confirmPassword || data.conformPassword || data.confirm_password || data.password || ''
  };

  const res = await API.post('/signup', payload);

  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
};

// Aliased as createUser for Signup.jsx
export const createUser = async (...args) => {
  const data = typeof args[0] === 'object' && args[0] !== null ? args[0] : {
    firstName: args[0],
    lastName: args[1],
    email: args[2],
    password: args[3],
    confirmPassword: args[4]
  };

  return await signupUser(data);
};

export const getUsers = async () => [];

export const loginUser = async (email, password) => {
  const res = await API.post('/login', { email, password });
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getMe = async () => {
  const token = localStorage.getItem('token');
  const res = await API.get('/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};