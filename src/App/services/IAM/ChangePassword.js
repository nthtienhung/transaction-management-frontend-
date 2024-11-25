import React, { useState } from "react";
import { TextField, Button, Typography, Grid, Snackbar, Alert, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

const ChangePasswordForm = () => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        oldPassword: Yup.string().required("Old password is required"),
        newPassword: Yup.string()
            .required("New password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(/.*[A-Z].*/, "Password must contain at least one uppercase letter")
            .matches(/.*[a-z].*/, "Password must contain at least one lowercase letter")
            .matches(/.*\d.*/, "Password must contain at least one number")
            .matches(/.*[!@#$%^&*(),.?":{}|<>].*/, "Password must contain at least one special character"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
            .required("Confirm password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await fetch("http://localhost:8081/api/v1/user/change-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
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

    const handleClickShowPassword = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    return (
        <div className="container-xxl backgroundLayout">
            <div className="authentication-wrapper authentication-basic container-p-y">
                <div className="authentication-inner">
                    <div className="card px-sm-6 px-0">
                        <div className="card-body">
                            <Typography variant="h4" gutterBottom style={{ textAlign: "center" }} className="mb-4">
                                Change Password
                            </Typography>
                            <form onSubmit={formik.handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="email"
                                            name="email"
                                            label="Email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email}
                                            FormHelperTextProps = {{
                                                style: { minHeight: "10px" }, // Đảm bảo khoảng cách
                                            }}
                                        />
                                    </Grid>
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
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton onClick={() => handleClickShowPassword("oldPassword")}>
                                                        {showPassword.oldPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                ),
                                            }}
                                        />
                                    </Grid>
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
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton onClick={() => handleClickShowPassword("newPassword")}>
                                                        {showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                ),
                                            }}
                                        />
                                    </Grid>
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
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton onClick={() => handleClickShowPassword("confirmPassword")}>
                                                        {showPassword.confirmPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button type="submit" fullWidth variant="contained" color="primary">
                                            Change Password
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </div>
    );
};

export default ChangePasswordForm;

