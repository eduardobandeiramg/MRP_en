import axios from 'axios';
import { API_BASE_URL } from './config';

const API_URL_BOM = `${API_BASE_URL}/build-of-materials`;
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {

  // Get BOM by Product ID
  async getBOMByProductId(productId) {
    try {
      const response = await axios.get(`${API_URL_BOM}/product/${productId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter BOM por Product ID:', error);
      throw error;
    }
  },

  // Get BOM Children
  async getBOMChildrenById(id) {
    try {
      const response = await axios.get(`${API_URL_BOM}/children/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter BOM filhos por ID:', error);
      throw error;
    }
  },

  // Add a new BOM
  async addBOM(bomData) {
    try {
      const response = await axios.post(API_URL_BOM, bomData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar BOM:', error);
      throw error;
    }
  },

  // Delete BOM by ID
  async deleteBOM(id) {
    try {
      const response = await axios.delete(`${API_URL_BOM}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar BOM:', error);
      throw error;
    }
  },
  
};
