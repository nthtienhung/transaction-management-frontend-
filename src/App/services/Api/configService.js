import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:8888/api/v1';

// Hàm để lấy token từ cookie
const getAuthToken = () => {
    const token = Cookies.get('its-cms-accessToken'); // Đảm bảo cookie chứa token có tên 'authToken'
    return token;
  };

// Hàm tạo headers với token
const getAuthHeaders = (customHeaders = {}) => {
    const token = getAuthToken();
  if (!token) {
    throw new Error('Token not found');
  }
  const decoded = decodeToken(token);
  return {
    Authorization: `Bearer ${token}`,
    'X-User-Id': decoded?.sub,
    'X-Role': decoded?.role,
  };
};

// Hàm decode token
const decodeToken = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  export const addConfig = async (configRequest) => {
    return axios.post(
      `${API_BASE_URL}/config/`,
      configRequest,
      { headers: getAuthHeaders() }
    );
  };
  
  export const updateConfig = async (configId, configRequest) => {
    return axios.put(
      `${API_BASE_URL}/config/update/${configId}`,
      configRequest,
      { headers: getAuthHeaders() }
    );
  };
  
  export const getConfigs = async (group, type, configKey, status, pageable) => {
    console.log(pageable)
    return axios.get(`${API_BASE_URL}/config/getconfig`, {
      params: { group, type, configKey, status, ...pageable },
      headers: getAuthHeaders(),
    });
  };