import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://kami-backend-5rs0.onrender.com';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (phone, password) => {
  const res = await axios.post(`${BASE_URL}/auth`, { phone, password });
  const data = res.data;
  console.log('LOGIN RESPONSE:', data);
  if (typeof data === 'string') return data;
  return data.token || data.accessToken || data.access_token;
};

export const getUserId = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(payload)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const obj = JSON.parse(json);
    return obj._id || obj.id || obj.userId || null;
  } catch (e) {
    return null;
  }
};

export const getServices = async () => {
  const res = await api.get('/services');
  return res.data;
};

export const getService = async (id) => {
  const res = await api.get(`/services/${id}`);
  return res.data;
};

export const addService = async (name, price) => {
  const res = await api.post('/services', { name, price });
  return res.data;
};

export const updateService = async (id, name, price) => {
  const res = await api.put(`/services/${id}`, { name, price });
  return res.data;
};

export const deleteService = async (id) => {
  const res = await api.delete(`/services/${id}`);
  return res.data;
};

export const getCustomers = async () => {
  const res = await api.get('/customers');
  return res.data;
};

export const getCustomer = async (id) => {
  const res = await api.post(`/customers/${id}`);
  return res.data;
};

export const addCustomer = async (name, phone) => {
  const res = await api.post('/customers', { name, phone });
  return res.data;
};

export const updateCustomer = async (id, name, phone) => {
  const res = await api.put(`/customers/${id}`, { name, phone });
  return res.data;
};

export const deleteCustomer = async (id) => {
  const res = await api.delete(`/customers/${id}`);
  return res.data;
};

export const getTransactions = async () => {
  const res = await api.get('/transactions');
  return res.data;
};

export const getTransaction = async (id) => {
  const res = await api.get(`/transactions/${id}`);
  return res.data;
};

export const addTransaction = async (customerId, services) => {
  const res = await api.post('/transactions', { customerId, services });
  return res.data;
};

export const deleteTransaction = async (id) => {
  const res = await api.delete(`/transactions/${id}`);
  return res.data;
};
