import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8888/api/v1";

// Fetch all transactions
// export const fetchAllTransactions = async (walletCodeByUserLogIn,page,) => {
//     // return axios.get(`${API_BASE_URL}/transaction/transaction-list-by-user?walletCodeByUserLogIn=${walletCodeByUserLogIn}&page=${page}&size=10`);
//     const query = new URLSearchParams({
//         walletCodeByUserLogIn,
//         page,
//         size: 10,
//     }).toString();
//     // return axios.get(`${API_BASE_URL}/transaction/transaction-list-by-user?${query}`);
//     return axios.get(`${API_BASE_URL}/transaction/transaction-list-by-user?walletCodeByUserLogIn=${walletCodeByUserLogIn}&page=${page}&size=5`);
// };
export const fetchAllTransactions = async (walletCodeByUserLogIn, page, filters = {}) => {
    const query = new URLSearchParams({
        walletCodeByUserLogIn,
        page,
        size: 10, // Hoặc thay đổi thành size theo yêu cầu
        ...filters, // Gắn thêm các bộ lọc vào query
    }).toString();

    return axios.get(`${API_BASE_URL}/transaction/transaction-list-by-user?${query}`);
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
        axios.get("http://localhost:8888/api/v1/auth/refreshTokenUser",{
            headers: {
              Authorization: `Bearer ${Cookies.get("its-cms-refreshToken")}`,
            },
          }).then(res =>{
            Cookies.remove("its-cms-accessToken");
            Cookies.remove("its-cms-refreshToken");
            Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
            Cookies.set("its-cms-refreshToken",res.data.data.refreshToken);
          })
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
