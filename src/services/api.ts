import axios from 'axios';
import https from 'node:https';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_API_URL, // Base URL da API
  timeout: 30000, // Tempo limite para requisições
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_API_API_TOKEN}`
  },
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false, // Bypass SSL verification
  }),
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

const apiService = {
  // Método GET
  async get(endpoint, params = {}) {
    try {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Método POST
  async post(endpoint, data) {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Método PUT
  async put(endpoint, data) {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Método DELETE
  async delete(endpoint) {
    try {
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;