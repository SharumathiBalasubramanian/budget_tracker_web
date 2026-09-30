import client from './client';

// Fetch all transactions
export const getTransactions = async () => {
  const res = await client.get(`/transactions?t=${Date.now()}`);
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

// Create transaction
export const createTransaction = async (data) => {
  const payload = {
    ...data,
    amount: Number(data.amount),
    type: String(data.type).toLowerCase().includes('incom') ? 'Income' : 'Expense',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    note: data.note || '',
  };
  const res = await client.post('/transactions', payload);
  return res.data?.data || res.data;
};

// Update transaction
export const updateTransaction = async (id, data) => {
  const payload = {
    ...data,
    amount: Number(data.amount),
    type: String(data.type).toLowerCase().includes('incom') ? 'Income' : 'Expense',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    note: data.note || '',
  };
  const res = await client.put(`/transactions/${id}`, payload);
  return res.data?.data || res.data;
};

// Delete transaction
export const deleteTransaction = async (id) => {
  const res = await client.delete(`/transactions/${id}`);
  return res.data;
};