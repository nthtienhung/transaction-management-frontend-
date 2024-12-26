import axios from 'axios';
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8888/api/v1/transaction"; // URL của backend

const refreshToken = () => {
    axios.get("http://localhost:8888/api/v1/auth/refreshTokenUser", {
        headers: {
            Authorization: `${sessionStorage.getItem("its-cms-refreshToken")}`,
        },
    }).then(res => {
        Cookies.remove("its-cms-accessToken");
        sessionStorage.removeItem("its-cms-refreshToken");
        Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
        sessionStorage.setItem("its-cms-refreshToken", res.data.data.refreshToken);
    })
}
export const sendOTP = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-otp`, payload, {
      headers: {
        Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
      }
    });
    return response.data;
  } catch (error) {
    refreshToken();
  }
};

export const confirmTransaction = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/confirm-transaction`, payload, {
      headers: {
        Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
      }
    });
    return response.data;
  } catch (error) {
    refreshToken();
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
    refreshToken();
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
    refreshToken();
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
    refreshToken();
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
    refreshToken();
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
    refreshToken();
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
    refreshToken();
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
    refreshToken();
  }
}

