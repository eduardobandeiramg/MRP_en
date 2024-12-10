import axios from 'axios';
import { API_BASE_URL } from './config';

const API_URL_USER = `${API_BASE_URL}/users`;
const API_URL_AUTH = `${API_BASE_URL}/auth`;

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  async getCurrentUserProfile() {
    try {
      const response = await axios.get(`${API_URL_USER}/profile`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter o perfil do usuário atual:', error);
      throw error;
    }
  },

  // async updateUser(userData) {
  //   try {
  //     const response = await axios.put(`${API_URL_USER}`, userData, {
  //       headers: getAuthHeader(),
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Erro ao atualizar dados do usuário:', error);
  //     throw error;
  //   }
  // },

  async getAllUsers() {
    try {
      const response = await axios.get(`${API_URL_USER}/all`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter todos os usuários:', error);
      throw error;
    }
  },

  async getUserById(id) {
    try {
      const response = await axios.get(`${API_URL_USER}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter o usuário pelo ID:', error);
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      const response = await axios.delete(`${API_URL_USER}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar o usuário:', error);
      throw error;
    }
  },

  async getUserByUsername(username) {
    try {
      const response = await axios.get(`${API_URL_USER}/username/${username}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter o usuário pelo nome de usuário:', error);
      throw error;
    }
  },

  async getUserByEmail(email) {
    try {
      const response = await axios.get(`${API_URL_USER}/email/${email}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter o usuário pelo e-mail:', error);
      throw error;
    }
  },

  async getUsersByFilters(filters) {
    try {
      const response = await axios.get(`${API_URL_USER}/filters`, {
        headers: getAuthHeader(),
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuários com filtros:', error);
      throw error;
    }
  },

  // Adicionar novo usuário
  async registerUser(userData) {
    try {
      const response = await axios.post(`${API_URL_AUTH}/register`, userData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar um novo usuário:', error);
      throw error;
    }
  },

  // Login do usuário
  async loginUser(credentials) {
    try {
      const response = await axios.post(`${API_URL_AUTH}/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },
};
