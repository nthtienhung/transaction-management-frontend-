import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Avatar, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Thêm axios để gọi API
import Cookies from "js-cookie";
const Profile = () => {
    const navigate = useNavigate();

    // State để lưu thông tin profile
    const [user, setUser] = useState(null);

    // Gọi API để lấy thông tin profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://localhost:8082/user/profile", {
                    headers: {
                        Authorization: `${Cookies.get("its-cms-accessToken")}` // Lấy JWT từ localStorage hoặc cookie
                    }
                });
                setUser(response.data.data); // Lưu thông tin vào state
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    // Nếu chưa có dữ liệu profile, hiển thị loading
    if (!user) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <Typography variant="h6">Loading...</Typography>
            </div>
        );
    }

    // Cấu hình style background
    const backgroundStyle = {
        backgroundColor: "accentColor",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Roboto', sans-serif",
    };

    return (
        <div style={backgroundStyle}>
            <Box sx={{maxWidth: "1500px", margin: "20px auto", padding: "20px"}}>
                <Paper elevation={3} sx={{padding: "20px"}}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h4">Profile</Typography>
                        <Button variant="contained" color="primary" onClick={() => navigate("/edit-profile")}>
                            Edit Profile
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => navigate("/homeUser")}>
                            Back to Home
                        </Button>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                            <Avatar
                                src={user.avatar || "https://via.placeholder.com/150"} // Dự phòng nếu không có avatar
                                alt="Avatar"
                                sx={{width: "150px", height: "150px", border: "3px solid #007bff"}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography variant="h6">
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Typography><strong>Email:</strong> {user.email}</Typography>
                            <Typography><strong>Phone:</strong> {user.phone}</Typography>
                            <Typography><strong>Address:</strong> {user.address}</Typography>
                            <Typography><strong>Date of Birth:</strong> {user.dob}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </div>
    );
};

export default Profile;
