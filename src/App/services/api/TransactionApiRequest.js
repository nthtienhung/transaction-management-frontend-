import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8888/api/v1";

// Fetch all transactions
export const fetchAllTransactions = async (walletCodeByUserLogIn,page) => {
    return axios.get(`${API_BASE_URL}/transaction/transaction-list-by-user?walletCodeByUserLogIn=${walletCodeByUserLogIn}&page=${page}&size=10`);
};

export const getUserId = async () => {
    try {
        const token = Cookies.get("its-cms-accessToken");
        console.log(token);

        if (!token) {
            throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
        }

        const response = await axios.get("http://localhost:8888/api/v1/user/profile", {
            headers: { Authorization: token },
        });

        console.log(response.data.data.userId);

        return response.data.data.userId; // Giả sử API trả về userId trong response.data
    } catch (error) {
        // Xử lý lỗi
        if (error.response) {
            // Lỗi từ phía server
            console.error("Lỗi từ server:", error.response.data);
        } else if (error.request) {
            // Lỗi không nhận được response
            console.error("Không nhận được phản hồi từ server");
        } else {
            // Lỗi khác
            console.error("Lỗi:", error.message);
        }
        return null;
    }
};

export const getWalletByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/wallet/code/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching wallet details:", error);
        throw error;
    }
};
