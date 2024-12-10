import axios from 'axios';
import { API_BASE_URL } from './config'; // Certifique-se de ter o arquivo de configuração

const API_URL_LINE = `${API_BASE_URL}/line`;

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  // Obter todas as linhas
  async getAllLines() {
    try {
      const response = await axios.get(API_URL_LINE, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter linhas:', error);
      throw error;
    }
  },

  // Obter linha por ID
  async getLineById(id) {
    try {
      const response = await axios.get(`${API_URL_LINE}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter linha por ID:', error);
      throw error;
    }
  },

  // Adicionar uma nova linha
  async addLine(lineData) {
    try {
      const response = await axios.post(API_URL_LINE, lineData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar linha:', error);
      throw error;
    }
  },

  // Atualizar uma linha por ID
  async updateLine(id, lineData) {
    try {
      const response = await axios.put(`${API_URL_LINE}/${id}`, lineData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar linha:', error);
      throw error;
    }
  },

  // Excluir uma linha por ID
  async deleteLine(id) {
    try {
      const response = await axios.delete(`${API_URL_LINE}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir linha:', error);
      throw error;
    }
  },
};
