import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        firstName: "John",
        lastName: "Doe",
        address: "123 Main Street, Cityville",
        phone: "0123456789",
        dob: "1990-01-01",
        email: "johndoe@example.com",
    });
    const backgroundStyle = {
        backgroundColor: "accentColor",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Roboto', sans-serif",
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSave = () => {
        console.log("Saved user data:", user);
        navigate("/profile");
    };

    return (
        <div style={backgroundStyle}>
            <Box sx={{maxWidth: "800px", margin: "20px auto", padding: "20px"}}>
                <Paper elevation={3} sx={{padding: "20px"}}>
                    <Typography variant="h4" gutterBottom>
                        Edit Profile
                    </Typography>
                    <Box component="form" display="flex" flexDirection="column" gap={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="First Name"
                                    name="firstName"
                                    value={user.firstName}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Last Name"
                                    name="lastName"
                                    value={user.lastName}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Phone"
                                    name="phone"
                                    value={user.phone}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={user.address}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Date of Birth"
                                    name="dob"
                                    type="date"
                                    value={user.dob}
                                    onChange={handleChange}
                                    fullWidth
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                        </Grid>
                        <Box display="flex" justifyContent="space-between">
                            <Button variant="contained" color="success" onClick={handleSave}>
                                Save
                            </Button>
                            <Button variant="contained" color="error" onClick={() => navigate("/profile")}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </div>
            );
            };

            export default EditProfile;
