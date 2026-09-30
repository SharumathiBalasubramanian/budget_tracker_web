import client from './client';

// 1. Fetch all budgets
export const getBudgets = async () => {
  const res = await client.get(`/budgets?t=${Date.now()}`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

// 2. Create budget
export const createBudget = async (data) => {
  const payload = {
    category: data.category,
    monthlyLimit: Number(data.monthlyLimit || data.limit || data.amount),
    spent: Number(data.spent) || 0,
  };
  const res = await client.post('/budgets', payload);
  return res.data?.data || res.data;
};

// 3. Update budget
export const updateBudget = async (id, data) => {
  const payload = {
    category: data.category,
    monthlyLimit: Number(data.monthlyLimit || data.limit || data.amount),
    spent: Number(data.spent) || 0,
  };
  const res = await client.put(`/budgets/${id}`, payload);
  return res.data?.data || res.data;
};

// 4. Delete budget
export const deleteBudget = async (id) => {
  const res = await client.delete(`/budgets/${id}`);
  return res.data;
};