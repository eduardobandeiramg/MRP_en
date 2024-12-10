import axios from 'axios';
import { API_BASE_URL } from './config';

const API_URL_LOGIN = `${API_BASE_URL}/auth/login`;
const API_URL_REGISTER = `${API_BASE_URL}/auth/register`;
const API_URL_FORGOT_PASSWORD = `${API_BASE_URL}/auth/forgot-password`;

export const login = async (username, password) => {
  try {
    const response = await axios.post(API_URL_LOGIN, { username, password });
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (data) => {
  try {
    const response = await axios.post(API_URL_REGISTER, data); // Envia o objeto completo
    return response;
  } catch (error) {
    throw error;
  }
};

// Função para a requisição de recuperação de senha
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(API_URL_FORGOT_PASSWORD, { email });
    return response;
  } catch (error) {
    throw error;
  }
};
