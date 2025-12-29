import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const designService = {
  getAll: async (params) => {
    const response = await api.get('/designs', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/designs/${id}`);
    return response.data;
  },
  create: async (formData) => {
    const response = await api.post('/designs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/designs/${id}`);
    return response.data;
  },
};

export const modelService = {
  getAll: async (params) => {
    const response = await api.get('/models', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/models/${id}`);
    return response.data;
  },
  create: async (formData) => {
    const response = await api.post('/models', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/models/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/models/${id}`);
    return response.data;
  },
};

export const projectService = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
  saveImage: async (id, imageDataUrl) => {
    const response = await api.post(`/projects/${id}/save-image`, { imageDataUrl });
    return response.data;
  },
};

export default api;
