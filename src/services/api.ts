import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

export const register = async (username: string, password: string) => {
  const response = await api.post('/register', { username, password });
  return response.data;
};

export const login = async (username: string, password: string) => {
  const response = await api.post('/token', new URLSearchParams({ username, password }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

export const createAppointment = async (appointment: { service: string; date: string; time: string }) => {
  const response = await api.post('/appointments', appointment);
  return response.data;
};

export const getAppointments = async () => {
  const response = await api.get('/appointments');
  return response.data;
};

export const deleteAppointment = async (appointmentId: number) => {
  const response = await api.delete(`/appointments/${appointmentId}`);
  return response.data;
};

export default api;