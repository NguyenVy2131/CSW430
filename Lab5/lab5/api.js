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