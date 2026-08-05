import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://kami-backend-5rs0.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

const TOKEN_KEY = '@kami_login_token';

export async function saveToken(token) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.log('saveToken error:', error);
  }
}

export async function getToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.log('getToken error:', error);
    return null;
  }
}

export async function removeToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.log('removeToken error:', error);
  }
}

export async function login(phone, password) {
  const response = await api.post('/auth', { phone, password });
  return response.data;
}

export async function getServices() {
  const response = await api.get('/services');
  return response.data;
}

export async function getServiceById(id) {
  const response = await api.get(`/services/${id}`);
  return response.data;
}

export async function addService(name, price, token) {
  const response = await api.post(
    '/services',
    { name, price },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
}

export async function updateService(id, name, price, token) {
  const response = await api.put(
    `/services/${id}`,
    { name, price },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
}

export async function deleteService(id, token) {
  const response = await api.delete(`/services/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export default api;
