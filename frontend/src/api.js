import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllTrees = async () => {
  const response = await api.get('/trees');
  return response.data;
};

export const getTree = async (id) => {
  const response = await api.get(`/trees/${id}`);
  return response.data;
};

export const createTree = async (tree) => {
  const response = await api.post('/trees', { tree });
  return response.data;
};

export const updateTree = async (id, tree) => {
  const response = await api.put(`/trees/${id}`, { tree });
  return response.data;
};

export const deleteTree = async (id) => {
  const response = await api.delete(`/trees/${id}`);
  return response.data;
};

export default api;
