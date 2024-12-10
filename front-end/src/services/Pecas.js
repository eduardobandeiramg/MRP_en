import axios from 'axios';
import { API_BASE_URL } from './config'; 

const API_URL_MATERIAL = `${API_BASE_URL}/materials`;

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  async getMaterials() {
    try {
      const response = await axios.get(API_URL_MATERIAL, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter material:', error);
      throw error;
    }
  },

  async addMaterial(materialData) {
    try {
      const response = await axios.post(API_URL_MATERIAL, materialData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      throw error;
    }
  },

  async updateMaterial(id, materialData) {
    try {
      const response = await axios.put(`${API_URL_MATERIAL}/${id}`, materialData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar material:', error);
      throw error;
    }
  },

  async getMaterialById(id) {
    try {
      const response = await axios.get(`${API_URL_MATERIAL}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter material pelo ID:', error);
      throw error;
    }
  },

  async deleteMaterial(id) {
    try {
      const response = await axios.delete(`${API_URL_MATERIAL}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar material:', error);
      throw error;
    }
  },

  async updateMaterialStock(id, qtd) {
    try {
      const response = await axios.patch(`${API_URL_MATERIAL}/stock/update`, { id, qtd }, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar estoque do material:', error);
      throw error;
    }
  },

  async addMaterialStock(id, qtd) {
    try {
      const response = await axios.patch(`${API_URL_MATERIAL}/stock/add`, { id, qtd }, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar material ao estoque:', error);
      throw error;
    }
  },
};
