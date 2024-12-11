import axios from 'axios';

const API_BASE_URL = "http://localhost:8888/api/v1/transaction"; // URL của backend

export const sendOTP = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-otp`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error sending OTP");
  }
};

export const confirmTransaction = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/confirm`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error confirming transaction");
  }
};
