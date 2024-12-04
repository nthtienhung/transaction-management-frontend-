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
    Alert, CardContent, Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Lock, Email, Phone, Home, Cake, People, ArrowBack } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import { useFormik } from "formik";

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
        const fetchProfile = async () => {
            try {
                const token = Cookies.get("its-cms-accessToken");
                if (!token) {
                    setError("You are not logged in. Please log in to continue.");
                    navigate("/");
                    return;
                }

                const response = await axios.get("http://localhost:8888/api/v1/user/profile", {
                    headers: { Authorization: token },
                });
                setUser(response.data.data);
            } catch (err) {
                setError("Unable to fetch user information. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    // Validation schema for password change form
    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Email is required"),
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
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        phone: Yup.string()
            .matches(/^((\s){0,}(0))((9|8|7|3|5|4|2)[0-9]{8,9}(\s){0,})$/, 'Phone number is invalid')
            .required('Phone is required'),
        address: Yup.string().required('Address is required'),
        dob: Yup.date().required('Date of Birth is required')
    });

    const handleClickShowPassword = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    const formik = useFormik({
        initialValues: {
            email: user?.email || "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        enableReinitialize: true, // Để cập nhật lại initialValues khi user thay đổi
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log("Here");
            console.log("Errors: ", formik.errors);
            console.log("Touched: ", formik.touched);
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

    const handleEditProfileSubmit = async () => {
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

            const updatedProfile = {
                firstName: user?.firstName,
                lastName: user?.lastName,
                phone: user?.phone,
                address: user?.address,
                dob: user?.dob,
            };

            const response = await axios.put("http://localhost:8888/api/v1/user/profile", updatedProfile, {
                headers: { Authorization: token },
            });

            if (response.status === 200) {
                setUser(response.data.data);
                setSnackbar({
                    open: true,
                    message: "Profile updated successfully!",
                    severity: "success",
                });
                setOpenEditProfileDialog(false);
            } else {
                setUser(response.data.data);
                setSnackbar({
                    open: true,
                    message: "Profile updated fail!",
                    severity: "error",
                });
                setOpenEditProfileDialog(false);
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Failed to update profile. Please try again later.",
                severity: "error",
            });
        }
    };

    return (
        <div style={{ background: "linear-gradient(to right, #6a11cb, #2575fc)", minHeight: "100vh", paddingTop: "20px" }}>
            <Box sx={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "20px" }}>
                <Paper elevation={3} sx={{ padding: "40px", borderRadius: "15px", backgroundColor: "#fff" }}>
                    <Button
                        startIcon={<ArrowBack />}
                        variant="outlined"
                        color="primary"
                        sx={{ marginBottom: 2 }}
                        onClick={() => navigate("/home")}
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
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3} sx={{ padding: 2 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="oldPassword"
                                name="oldPassword"
                                label="Old Password"
                                type={showPassword.oldPassword ? "text" : "password"}
                                value={formik.values.oldPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                                helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                                FormHelperTextProps={{
                                    style: { minHeight: "24px" },
                                }}
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
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                helperText={formik.touched.newPassword && formik.errors.newPassword}
                                FormHelperTextProps={{
                                    style: { minHeight: "24px" },
                                }}
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
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                FormHelperTextProps={{
                                    style: { minHeight: "24px" },
                                }}
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
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ padding: "12px", fontWeight: "bold" }}>
                                Change Password
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Dialog>

            {/* Edit Profile Dialog */}
            <Dialog open={openEditProfileDialog} onClose={() => setOpenEditProfileDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Profile</DialogTitle>
                <div>
                    <Box sx={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
                        <Paper elevation={3} sx={{ padding: "20px" }}>
                            <Box component="form" display="flex" flexDirection="column" gap={3}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="First Name"
                                            name="firstName"
                                            value={user?.firstName}
                                            fullWidth
                                            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Last Name"
                                            name="lastName"
                                            value={user?.lastName}
                                            fullWidth
                                            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={user?.email}
                                            fullWidth
                                            disabled
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Phone"
                                            name="phone"
                                            value={user?.phone}
                                            fullWidth
                                            onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Address"
                                            name="address"
                                            value={user?.address}
                                            fullWidth
                                            onChange={(e) => setUser({ ...user, address: e.target.value })}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Date of Birth"
                                            name="dob"
                                            type="date"
                                            value={user?.dob}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            onChange={(e) => setUser({ ...user, dob: e.target.value })}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleEditProfileSubmit} // Thực hiện submit
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </div>
            </Dialog>



            {/* Snackbar for success or error messages */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Profile;
