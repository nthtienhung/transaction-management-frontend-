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
    ).catch((error) =>{
      axios
              .get("http://localhost:8888/api/v1/auth/refreshTokenUser", {
                headers: {
                  Authorization: `${sessionStorage.getItem(
                    "its-cms-refreshToken"
                  )}`,
                },
              })
              .then((res) => {
                // Cập nhật token mới
                Cookies.remove("its-cms-accessToken");
                sessionStorage.removeItem("its-cms-refreshToken");
                Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
                sessionStorage.setItem("its-cms-refreshToken", res.data.data.refreshToken);
            
              })
    });
  };
  
  export const updateConfig = async (configId, configRequest) => {
    return axios.put(
      `${API_BASE_URL}/config/update/${configId}`,
      configRequest,
      { headers: getAuthHeaders() }
    );
  };
  
  export const getConfigs = async (group, type, configKey, status, pageable) => {
    console.log(group, type, configKey, status, pageable)
    return axios.get(`${API_BASE_URL}/config/getconfig`, {
      params: { group, type, configKey, status, ...pageable },
      headers: getAuthHeaders(),
    }).catch((error) =>{
      axios
              .get("http://localhost:8888/api/v1/auth/refreshTokenUser", {
                headers: {
                  Authorization: `${sessionStorage.getItem(
                    "its-cms-refreshToken"
                  )}`,
                },
              })
              .then((res) => {
                // Cập nhật token mới
                Cookies.remove("its-cms-accessToken");
                sessionStorage.removeItem("its-cms-refreshToken");
                Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
                sessionStorage.setItem("its-cms-refreshToken", res.data.data.refreshToken);
              })
    });
  };