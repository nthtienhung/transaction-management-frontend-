import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:8888/api/v1', // Thay bằng URL của backend
});

export const verifyMail = (email) => API.post('/forgot-password/verify-mail', { email });
export const verifyOTP = (otp) => API.post('/forgot-password/verify-otp', otp);
export const generateOTP = (email) => API.post('/forgot-password/generate', null, { params: { email } });
export const resetPassword = (data) => API.post('/forgot-password/reset', data);