import axios from 'axios';
import { API_BASE_URL } from './config';  // Supondo que você tenha uma config.js para armazenar a URL base

const API_URL_PRODUCT = `${API_BASE_URL}/products`;

// Função para obter o cabeçalho de autenticação
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  // Obtém todos os produtos
  async getProducts() {
    try {
      const response = await axios.get(`${API_URL_PRODUCT}/all`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter produtos:', error);
      throw error;
    }
  },

  // Obtém produto por descrição
  async getProductByDescription(description) {
    try {
      const response = await axios.get(`${API_URL_PRODUCT}/by-description`, {
        params: { description },
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter produto por descrição:', error);
      throw error;
    }
  },

  // Obtém produto por ID
  async getProductById(id) {
    try {
      const response = await axios.get(`${API_URL_PRODUCT}/by-uid/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter produto por ID:', error);
      throw error;
    }
  },

  // Adiciona um novo produto
  async addProduct(product) {
    try {
      const response = await axios.post(API_URL_PRODUCT, product, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      throw error;
    }
  },

  // Atualiza um produto existente por ID
  async updateProduct(id, product) {
    try {
      const response = await axios.put(`${API_URL_PRODUCT}/${id}`, product, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  // Deleta um produto por ID
  async deleteProduct(id) {
    try {
      const response = await axios.delete(`${API_URL_PRODUCT}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  },
};
