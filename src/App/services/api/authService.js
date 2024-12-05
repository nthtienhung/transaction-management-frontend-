import axios from "axios";

const API_BASE_URL = "http://localhost:8888/api/v1";

export const register = async (data) => {
    return axios.post(`${API_BASE_URL}/auth/register`, data);
};

export const generateOtp = async (email) => {
    return axios.post(`${API_BASE_URL}/auth/register/generate-otp`,{ email }
    );
};

export const verifyOtp = async (data) => {
    return axios.post(`${API_BASE_URL}/auth/register/verify`, data);
};
