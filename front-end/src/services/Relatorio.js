import axios from 'axios';
import { API_BASE_URL } from './config';

const API_URL_RELATORIO = `${API_BASE_URL}/relatorios`;

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  // Relatório 1: Diferença de Produção
  async getDiferencaProducao() {
    try {
      const response = await axios.get(`${API_URL_RELATORIO}/diferenca-producao`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter relatório de diferença de produção:', error);
      throw error;
    }
  },

  // Relatório 2: Estoque vs Necessidade
  async getEstoqueNecessidade() {
    try {
      const response = await axios.get(`${API_URL_RELATORIO}/estoque-necessidade`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter relatório de estoque vs necessidade:', error);
      throw error;
    }
  },
};
