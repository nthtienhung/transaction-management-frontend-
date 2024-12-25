import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:8888/api/v1/user"; // Update with the correct base URL

/**
 * Fetches user details by user ID.
 * @param {string} userId - The user ID to fetch details for.
 * @returns {Promise} - The user details.
 */
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${userId}`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
    }
};

/**
 * Checks if an email exists in the user database.
 * @param {string} email - The email to check.
 * @returns {Promise} - Boolean indicating if the email exists.
 */
export const isEmailExists = async (email) => {
    try {
        const response = await axios.get(`${BASE_URL}/check-email-exists`, {
            params: {email: email},
            headers: {
                Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error checking if email exists:", error);
        throw error;
    }
};
