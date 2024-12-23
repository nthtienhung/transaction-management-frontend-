import axios from "axios";
import Cookies from "js-cookie";
const BASE_URL = "http://localhost:8888/api/v1/wallet"; // Update with the correct base URL

/**
 * Fetches wallet details by wallet code.
 * @param {string} walletCode - The wallet code to fetch details for.
 * @returns {Promise} - The wallet details.
 */
export const getWalletByWalletCode = async (walletCode) => {
  try {
    const response = await axios.get(`${BASE_URL}/${walletCode}`,{
     headers: 
     { Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}` 
    }  
    }).catch((error) => {
                    axios
                      .get("http://localhost:8888/api/v1/auth/refreshTokenUser", {
                        headers: {
                          Authorization: `Bearer ${sessionStorage.getItem(
                            "its-cms-refreshToken"
                          )}`,
                        },
                      })
                      .then((res) => {
                        Cookies.remove("its-cms-accessToken");
                        sessionStorage.removeItem("its-cms-refreshToken");
                        Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
                        sessionStorage.setItem(
                          "its-cms-refreshToken",
                          res.data.data.refreshToken
                        );
                      });
                  });
    return response.data;
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    throw error;
  }
};

export const getWalletByUserId = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/code/${userId}`,{
      headers: 
      { Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}` 
     }  
     }).catch((error) => {
                     axios
                       .get("http://localhost:8888/api/v1/auth/refreshTokenUser", {
                         headers: {
                           Authorization: `Bearer ${sessionStorage.getItem(
                             "its-cms-refreshToken"
                           )}`,
                         },
                       })
                       .then((res) => {
                         Cookies.remove("its-cms-accessToken");
                         sessionStorage.removeItem("its-cms-refreshToken");
                         Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
                         sessionStorage.setItem(
                           "its-cms-refreshToken",
                           res.data.data.refreshToken
                         );
                       });
                   });
    return response.data;
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    throw error;
  }
};

/**
 * Updates the wallet balance.
 * @param {string} walletCode - The wallet code to update.
 * @param {number} amount - The amount to update the balance by.
 * @returns {Promise} - Response from the API.
 */
export const updateWalletBalance = async (walletCode, amount) => {
  try {
    const response = await axios.put(`${BASE_URL}/${walletCode}/balance`, {
      amount: amount,
      headers: 
      { Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}` 
     }  
    });
    return response.data;
  } catch (error) {
    console.error("Error updating wallet balance:", error);
    throw error;
  }
};
