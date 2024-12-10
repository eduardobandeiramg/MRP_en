import axios from 'axios';
import { API_BASE_URL } from './config';  // Assumed config.js for storing the base URL

const API_URL_PRODUCTION_PLANS = `${API_BASE_URL}/production-plans`;

// Function to get the authentication header
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  // POST to add a new production plan
  async addProductionPlan(productionPlan) {
    try {
      const response = await axios.post(`${API_URL_PRODUCTION_PLANS}`, productionPlan, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error adding production plan:', error);
      throw error;
    }
  },

  // GET production plans by date range
  async getProductionPlansByDates(startDate, endDate) {
    try {
      const url = `${API_URL_PRODUCTION_PLANS}/by-dates?startDate=${startDate}&endDate=${endDate}`;
      const response = await axios.get(url, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching production plans by dates:', error);
      throw error;
    }
  },  

  // GET a specific production plan by ID
  async getProductionPlanById(id) {
    try {
      const response = await axios.get(`${API_URL_PRODUCTION_PLANS}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching production plan by ID:', error);
      throw error;
    }
  },

  // DELETE a production plan by ID
  async deleteProductionPlan(id) {
    try {
      const response = await axios.delete(`${API_URL_PRODUCTION_PLANS}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting production plan:', error);
      throw error;
    }
  },
};
