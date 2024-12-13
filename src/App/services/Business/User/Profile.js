import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {
    Box,
    Button,
    Typography,
    Avatar,
    Paper,
    Grid,
    Dialog,
    DialogTitle,
    TextField,
    IconButton,
    Snackbar,
    Alert,
    CardContent,
    Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Lock, Email, Phone, Home, Cake, People, ArrowBack } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { use } from "react";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
    const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    // Fetch user profile
    useEffect(() => {
            try {
                const token = Cookies.get("its-cms-accessToken");
                if (!token) {
                    setError("You are not logged in. Please log in to continue.");
                    navigate("/");
                    return;
                }
                axios.get("http://localhost:8888/api/v1/user/profile", {
                    headers: { Authorization: token },
                }).then(res =>{
                    setUser(res.data.data);
                    setLoading(false);
                    console.log(res.data.data);
                });
            } catch (err) {
                console.log(Cookies.get("its-cms-refreshToken"));
                axios.get("http://localhost:8888/api/v1/auth/refreshTokenUser",{
                  headers: {
                    Authorization: `Bearer ${Cookies.get("its-cms-refreshToken")}`,
                  },
                }).then(res =>{
                  Cookies.remove("its-cms-accessToken");
                  Cookies.remove("its-cms-refreshToken");
                  Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
                  Cookies.set("its-cms-refreshToken",res.data.data.refreshToken);
                axios.get("http://localhost:8888/api/v1/user/profile", {
                    headers: { 
                        Authorization: `${Cookies.get("its-cms-refreshToken")}`
                    },
                }).then(res =>{
                    setUser(res.data.data);
                    setLoading(false);
                    console.log(res.data.data);
                });
                })
            }
    }, []);

    // Validation schema for password change form
    const validationSchema = Yup.object({
        oldPassword: Yup.string().required("Old password is required"),
        newPassword: Yup.string()
            .required("New password is required")
            .min(8, "Password must be at least 8 characters")
            .max(20, "Password must only have a maximum of 20 characters")
            .matches(/.*[A-Z].*/, "Password must contain at least one uppercase letter")
            .matches(/.*[a-z].*/, "Password must contain at least one lowercase letter")
            .matches(/.*\d.*/, "Password must contain at least one number")
            .matches(/.*[!@#$%^&*(),.?":{}|<>].*/, "Password must contain at least one special character"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
            .required("Confirm password is required"),
    });

    const validationEditProfileSchema = Yup.object({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        phone: Yup.string()
            .matches(/^((\s){0,}(0))((9|8|7|3|5|4|2)[0-9]{8,9}(\s){0,})$/, "Phone number is invalid")
            .required("Phone is required"),
        address: Yup.string().required("Address is required"),
        dob: Yup.date()
            .max(new Date(), "Date of Birth must be in the past")
            .required("Date of Birth is required"),
    });

    const handleClickShowPassword = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

const changePasswordFormik = useFormik({
        initialValues: {
            email: user?.email,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const token = Cookies.get("its-cms-accessToken");
                if (!token) {
                    setError("You are not logged in. Please log in to continue.");
                    navigate("/");
                    return;
                }
                const response = await fetch("http://localhost:8888/api/v1/auth/change-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (response.ok) {
                    setSnackbar({
                        open: true,
                        message: data.message,
                        severity: "success",
                    });
                } else {
                    setSnackbar({
                        open: true,
                        message: data.message,
                        severity: "error",
                    });
                    console.log(values);
                }
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: "Unable to connect to the server. Please try again later.",
                    severity: "error",
                });
            }
        },
    });

    const editProfileFormik = useFormik({
        initialValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email,
            phone: user?.phone || "",
            address: user?.address || "",
            dob: user?.dob || "",
        },
        enableReinitialize: true,
        validationSchema: validationEditProfileSchema,
        onSubmit: async (values) => {
            try {
                const token = Cookies.get("its-cms-accessToken");
                if (!token) {
                    setSnackbar({
                        open: true,
                        message: "You are not logged in. Please log in to continue.",
                        severity: "error",
                    });
                    navigate("/");
                    return;
                }

                const response = await axios.put(
                    "http://localhost:8888/api/v1/user/profile",
                    values,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                    }
                );

                if (response.status === 200) {
                    setSnackbar({
                        open: true,
                        message: response.data.message,
                        severity: "success",
                    });
                    setUser(response.data.data); // Update the user state
                } else {
                    setSnackbar({
                        open: true,
                        message: response.data.message,
                        severity: "error",
                    });
                }
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: "Unable to connect to the server. Please try again later.",
                    severity: "error",
                });
            }
        },
    });

return (
        <div style={{ background: "linear-gradient(to right, #6a11cb, #2575fc)", minHeight: "100vh", paddingTop: "20px" }}>
            <Box sx={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "20px" }}>
                <Paper elevation={3} sx={{ padding: "40px", borderRadius: "15px", backgroundColor: "#fff" }}>
                    <Button
                        startIcon={<ArrowBack />}
                        variant="outlined"
                        color="primary"
                        sx={{ marginBottom: 2 }}
                        onClick={() => navigate("/homeUser")}
                    >
                        Back to Home
                    </Button>
                    <Box mb={4} textAlign="center">
                        <Typography variant="h3" fontWeight="bold">
                            Profile
                        </Typography>
                    </Box>
                    {loading ? (
                        <Typography textAlign="center">Loading user information...</Typography>
                    ) : error ? (
                        <Typography color="error" textAlign="center">{error}</Typography>
                    ) : (
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                                <Avatar
                                    src={user?.avatar || process.env.PUBLIC_URL + "/assets/img/avatars/1.png"}
                                    alt="Avatar"
                                    sx={{ width: "180px", height: "180px", border: "5px solid #fff" }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Typography>
                                    <People fontSize="small" /> <strong>Name:</strong> {user?.firstName} {user?.lastName}
                                </Typography>
                                <Typography>
                                    <Email fontSize="small" /> <strong>Email:</strong> {user?.email}
                                </Typography>
                                <Typography>
                                    <Phone fontSize="small" /> <strong>Phone:</strong> {user?.phone}
                                </Typography>
                                <Typography>
                                    <Home fontSize="small" /> <strong>Address:</strong> {user?.address}
                                </Typography>
                                <Typography>
                                    <Cake fontSize="small" /> <strong>Date of Birth:</strong> {user?.dob}
                                </Typography>
                                <Button
                                    startIcon={<Edit />}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setOpenEditProfileDialog(true)}
                                >
                                    Edit Profile
                                </Button>
                                <Button
                                    sx={{ marginLeft: 2 }}
                                    startIcon={<Lock />}
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setOpenChangePasswordDialog(true)}
                                >
                                    Change Password
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                    <Box mt={5}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Card elevation={2} sx={{ borderRadius: "10px", textAlign: "center" }}>
                                    <CardContent>

<Typography variant="h6" color="primary">
                                            Welcome Back!
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "gray" }}>
                                            Explore your profile and settings here.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card elevation={2} sx={{ borderRadius: "10px", textAlign: "center" }}>
                                    <CardContent>
                                        <Typography variant="h6" color="secondary">
                                            Did You Know?
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "gray" }}>
                                            You can change your password.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box mt={5} textAlign="center">
                        <Typography variant="body2" sx={{ color: "gray" }}>
                            © 2024 IceTea Software. All rights reserved.
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            {/* Change Password Dialog */}
            <Dialog open={openChangePasswordDialog} onClose={() => setOpenChangePasswordDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Change Password</DialogTitle>
                <form onSubmit={changePasswordFormik.handleSubmit}>
                    <Grid container spacing={3} sx={{ padding: 2 }}>
                        {/* Old Password */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="oldPassword"
                                name="oldPassword"
                                label="Old Password"
                                type={showPassword.oldPassword ? "text" : "password"}
                                value={changePasswordFormik.values.oldPassword}
                                onChange={changePasswordFormik.handleChange}
                                onBlur={changePasswordFormik.handleBlur}
                                error={changePasswordFormik.touched.oldPassword && Boolean(changePasswordFormik.errors.oldPassword)}
                                helperText={changePasswordFormik.touched.oldPassword && changePasswordFormik.errors.oldPassword}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={() => handleClickShowPassword("oldPassword")} tabIndex={-1}>
                                            {showPassword.oldPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Grid>

{/* New Password */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="newPassword"
                                name="newPassword"
                                label="New Password"
                                type={showPassword.newPassword ? "text" : "password"}
                                value={changePasswordFormik.values.newPassword}
                                onChange={changePasswordFormik.handleChange}
                                onBlur={changePasswordFormik.handleBlur}
                                error={changePasswordFormik.touched.newPassword && Boolean(changePasswordFormik.errors.newPassword)}
                                helperText={changePasswordFormik.touched.newPassword && changePasswordFormik.errors.newPassword}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={() => handleClickShowPassword("newPassword")} tabIndex={-1}>
                                            {showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Confirm Password */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showPassword.confirmPassword ? "text" : "password"}
                                value={changePasswordFormik.values.confirmPassword}
                                onChange={changePasswordFormik.handleChange}
                                onBlur={changePasswordFormik.handleBlur}
                                error={changePasswordFormik.touched.confirmPassword && Boolean(changePasswordFormik.errors.confirmPassword)}
                                helperText={changePasswordFormik.touched.confirmPassword && changePasswordFormik.errors.confirmPassword}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={() => handleClickShowPassword("confirmPassword")} tabIndex={-1}>
                                            {showPassword.confirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" fullWidth type="submit">
                                Change Password
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Dialog>

{/* Edit Profile Dialog */}
            <Dialog
                open={openEditProfileDialog}
                onClose={() => setOpenEditProfileDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Edit Profile</DialogTitle>
                <form onSubmit={editProfileFormik.handleSubmit}>
                    <Box padding={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="First Name"
                                    name="firstName"
                                    value={editProfileFormik.values.firstName}
                                    onChange={editProfileFormik.handleChange}
                                    onBlur={editProfileFormik.handleBlur}
                                    fullWidth
                                    error={editProfileFormik.touched.firstName && Boolean(editProfileFormik.errors.firstName)}
                                    helperText={editProfileFormik.touched.firstName && editProfileFormik.errors.firstName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Last Name"
                                    name="lastName"
                                    value={editProfileFormik.values.lastName}
                                    onChange={editProfileFormik.handleChange}
                                    onBlur={editProfileFormik.handleBlur}
                                    fullWidth
                                    error={editProfileFormik.touched.lastName && Boolean(editProfileFormik.errors.lastName)}
                                    helperText={editProfileFormik.touched.lastName && editProfileFormik.errors.lastName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={editProfileFormik.values.email}
                                    onChange={editProfileFormik.handleChange}
                                    onBlur={editProfileFormik.handleBlur}
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Phone"
                                    name="phone"
                                    value={editProfileFormik.values.phone}
                                    onChange={editProfileFormik.handleChange}
                                    onBlur={editProfileFormik.handleBlur}
                                    fullWidth
                                    error={editProfileFormik.touched.phone && Boolean(editProfileFormik.errors.phone)}
                                    helperText={editProfileFormik.touched.phone && editProfileFormik.errors.phone}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={editProfileFormik.values.address}
                                    onChange={editProfileFormik.handleChange}
                                    onBlur={editProfileFormik.handleBlur}
                                    fullWidth
                                    error={editProfileFormik.touched.address && Boolean(editProfileFormik.errors.address)}

helperText={editProfileFormik.touched.address && editProfileFormik.errors.address}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Date of Birth"
                                    name="dob"
                                    type="date"
                                    value={editProfileFormik.values.dob}
                                    onChange={editProfileFormik.handleChange}
                                    onBlur={editProfileFormik.handleBlur}
                                    fullWidth
                                    error={editProfileFormik.touched.dob && Boolean(editProfileFormik.errors.dob)}
                                    helperText={editProfileFormik.touched.dob && editProfileFormik.errors.dob}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Box textAlign="right" mt={3}>
                            <Button type="submit" variant="contained" color="primary">
                                Save
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Dialog>

            {/* Snackbar for showing alerts */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </div>
    );
};

export default Profile;