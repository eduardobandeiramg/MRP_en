import axios from 'axios';
import { API_BASE_URL } from './config'; // Supondo que você tenha uma config.js para armazenar a URL base

const API_URL_PRODUCTION = `${API_BASE_URL}/production`;

// Função para obter o cabeçalho de autenticação
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  // Obtém dados dos produtos para produzir
  async getToProduction() {
    try {
      const response = await axios.get(`${API_URL_PRODUCTION}/to-production`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dados para produção:', error);
      throw error;
    }
  },

  // Obtém dados dos produtos em produção
  async getOnProduction() {
    try {
      const response = await axios.get(`${API_URL_PRODUCTION}/on-production`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dados de produtos em produção:', error);
      throw error;
    }
  },

  // Obtém dados dos produtos finalizados
  async getFinishedProduction() {
    try {
      const response = await axios.get(`${API_URL_PRODUCTION}/finished-production`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dados de produtos finalizados:', error);
      throw error;
    }
  },

  // Obtém status dos produtos a produzir
  async getStatusProduction() {
    try {
      const response = await axios.get(`${API_URL_PRODUCTION}/status-production`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status dos produtos a produzir:', error);
      throw error;
    }
  },
};
