import axios from 'axios';
import Cookies from "js-cookie";
const API_BASE_URL = "http://localhost:8888/api/v1/transaction"; // URL của backend

export const sendOTP = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-otp`, payload, {
      headers: {
        Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error sending OTP");
  }
};

export const confirmTransaction = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/confirm`, payload, {
      headers: {
        Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error confirming transaction");
  }
};

export const getRecentReceivedTransactionList = async (walletCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recent-received-transaction-list-by-user`, {
      params: { walletCodeByUserLogIn: walletCode },
      headers: {
        Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching recent received transactions");
  }
};

export const getRecentSentTransactionList = async (walletCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recent-sent-transaction-list-by-user`, {
      params: { walletCodeByUserLogIn: walletCode },
      headers: {
        Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching recent sent transactions");
  }
};

export const getTotalAmountSentTransactionByUser = async (walletCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/total-amount-sent-transaction-by-user-in-week`, {
      params: { senderWalletCode: walletCode },
      headers: {
        Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching total amount sent");
  }
};

export const getTotalAmountReceivedTransactionByUser = async (walletCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/total-amount-received-transaction-by-user-in-week`, {
      params: { recipientWalletCode: walletCode },
      headers: {
        Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching total amount received");
  }
};

export const getTotalTransactionByUser = async (walletCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/total-transaction-by-user`, {
      params: { walletCode },
      headers: {
        Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching total transactions");
  }
};

export const getTransactionDetailByUser = async (transactionCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transaction-detail-by-user/${transactionCode}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
      }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error fetching transactions");
  }
}

export const getTransactionDetailByAdmin = async (transactionCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transaction-detail-by-admin/${transactionCode}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
      }
    });
    return response.data.data;
  } catch (error) {
    window.location.reload();
  }
}

