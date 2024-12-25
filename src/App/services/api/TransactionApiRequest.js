import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8888/api/v1";

export const fetchAllTransactions = async (walletCodeByUserLogIn, page, filters = {}) => {
    // Loại bỏ các giá trị undefined và null khỏi bộ lọc
    const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );

    const query = new URLSearchParams({
        walletCodeByUserLogIn,
        page,
        size: 10,
        ...cleanedFilters
    }).toString();

    return axios.get(`${API_BASE_URL}/transaction/transaction-list-by-user?${query}`, {
        headers: {
            Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
        }
    });
};


export const getUserId = async () => {
    try {
        const token = Cookies.get("its-cms-accessToken");
        console.log(token);

        if (!token) {
            throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
        }

        const response = await axios.get("http://localhost:8888/api/v1/user/profile", {
            headers: {
                Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
            }
        });

        console.log(response.data.data.userId);

        return response.data.data.userId; // Giả sử API trả về userId trong response.data
    } catch (error) {
        // Xử lý lỗi
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
};

export const getWalletByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/wallet/code/${userId}`,{
            headers: {
                Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching wallet details:", error);
        throw error;
    }
};
