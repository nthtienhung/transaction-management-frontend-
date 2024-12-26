import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../../compoment/fragment/Footer";
import Header from "../../../compoment/fragment/Header";
import Navbar from "../../../compoment/fragment/Navbar";
import './style/CreateTransaction.css';

// Import services
import { getUserById, isEmailExists } from "../../../services/api/userServiceApi";
import { getWalletByWalletCode, getWalletByUserId, updateWalletBalance } from "../../../services/api/walletServiceApi"
import { sendOTP, confirmTransaction } from "../../../services/api/transactionServiceApi";


function CreateTransaction() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [senderBalance, setSenderBalance] = useState(null); // Thêm state lưu trữ số dư
  const [error, setError] = useState("");
  const [senderWalletCode, setSenderWalletCode] = useState("");
  const [lockUntil, setLockUntil] = useState(null); // Thời gian bị khóa
  const [otpAttempts, setOtpAttempts] = useState(0); // Số lần nhập OTP sai

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Thời gian khóa khi nhập sai quá số lần cho phép (ms)
  const LOCK_TIME = 1 * 60 * 1000; // 1 phút

  const getUserId = async () => {
    try {
      const token = Cookies.get("its-cms-accessToken");
      console.log(token);

      if (!token) {
        throw new Error("You're not logged in. Please log in to continue");
      }

      const response = await axios.get("http://localhost:8888/api/v1/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    const fetchSenderBalance = async () => {
      try {
        const userId = await getUserId();
        const senderWallet = await getWalletByUserId(userId);
        if (senderWallet && senderWallet.balance !== undefined) {
          setSenderWalletCode(senderWallet.walletCode);
          setSenderBalance(senderWallet.balance); // Cập nhật số dư
        }
      } catch (error) {
        setError("Unable to retrieve your balance information. Please try again");
      }
    };

    fetchSenderBalance();
  }, []);

  // Step 1: Transaction Details Schema
  const createTransactionSchema = Yup.object().shape({
    recipientWalletCode: Yup.string().required("Recipient wallet code is required"),
    amount: Yup.number()
      .positive("Amount must be positive")
      .required("Amount is required"),
    description: Yup.string().max(255, "Description too long"),
  });

  // Step 2: OTP Schema
  const otpSchema = Yup.object().shape({
    otp: Yup.string().required("OTP is required"),
  });

  // Formik for Step 1
  const formikCreateTransaction = useFormik({
    initialValues: {
      recipientWalletCode: "",
      amount: "",
      description: "",
    },
    validationSchema: createTransactionSchema,
    onSubmit: async (values) => {
      try {
        setError("");

        if (lockUntil && new Date() < lockUntil) {
          setSnackbar({
            open: true,
            message: "You are temporarily locked. Please try again later.",
            severity: "error"
          });
          return;
        }

        // Kiểm tra số dư
        if (senderBalance !== null && values.amount > senderBalance) {
          throw new Error("The deposit amount exceeds your balance");
        }

        console.log("values : " + values.recipientWalletCode)

        // Call API to get wallet info by wallet code
        const walletInfo = await getWalletByWalletCode(values.recipientWalletCode);
        console.log(walletInfo);

        console.log(walletInfo);

        if (!walletInfo || !walletInfo.userId) {
          throw new Error("Wallet information is invalid or userId is missing.");
        }

        // Call API to get user info by userId
        const recipientInfo = await getUserById(walletInfo.userId);
        const recipientFullName = `${recipientInfo.firstName} ${recipientInfo.lastName}`;
        setRecipientName(recipientFullName);

        const senderWalletCode = await getWalletByUserId(await getUserId());
        if (!senderWalletCode) {
          throw new Error("Unable to fetch sender wallet code. Please check your login status.");
        }

        if (values.recipientWalletCode === senderWalletCode.walletCode) {
          throw new Error("Wallet code cannot match your wallet code");
        }

        // Send OTP
        const response = await sendOTP({
          walletCode: senderWalletCode.walletCode,
          amount: values.amount,
        });

        if (response.status === 200) {
          setSnackbar({
            open: true,
            message: response.message,
            severity: "success"
          });

          // Move to OTP step
          setStep(2);
        }
      } catch (err) {
        setError(err.message || "Failed to validate recipient or send OTP. Please try again.");
      }
    },
  });

  // Formik for Step 2
  const formikOTP = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: otpSchema,
    onSubmit: async (values) => {
      try {
        setError("");

        const senderWalletCode = await getWalletByUserId(await getUserId());

        // Confirm transaction
        const response = await confirmTransaction({
          senderWalletCode: senderWalletCode.walletCode, // Replace with actual sender wallet code from context/auth
          recipientWalletCode: formikCreateTransaction.values.recipientWalletCode,
          amount: formikCreateTransaction.values.amount,
          description: formikCreateTransaction.values.description,
          otp: values.otp,
        });
        if (response.status === 200) {
          console.log("test")
          setSnackbar({
            open: true,
            message: response.message,
            severity: "success"
          });
          // Navigate to transaction list on success
          // navigate("/transactionUser");
          setTimeout(() => navigate("/transactionUser"), 2000); // Delay 100ms để toast được render
        }
      } catch (err) {
        setOtpAttempts(prev => prev + 1);

        if (otpAttempts + 1 >= 5) {
          const lockTime = new Date();
          lockTime.setMinutes(lockTime.getMinutes() + 1);
          setLockUntil(lockTime);

          setSnackbar({
            open: true,
            message: "Too many incorrect OTP attempts. You are temporarily locked for 5 minutes.",
            severity: "error"
          });
          setStep(1);
        } else {
          setSnackbar({
            open: true,
            message: "Incorrect OTP. Please try again.",
            severity: "error"
          });
        }
      }
    },
  });

  // Step 1: Render Create Transaction Form
  const renderCreateTransactionStep = () => (
    <div className="create-transaction-form">
      <h2>Create Transaction</h2>
      {error && <div className="error">{error}</div>}
      <div>
        <p><strong>Current balance:</strong> {senderBalance !== null ? `${senderBalance} đ` : "Loading..."}</p>
        <br></br>
      </div>
      <form onSubmit={formikCreateTransaction.handleSubmit}>
        <div>
          <label>Recipient Wallet Code</label>
          <input
            type="text"
            id="recipientWalletCode"
            name="recipientWalletCode"
            onChange={formikCreateTransaction.handleChange}
            onBlur={(e) => {
              formikCreateTransaction.handleBlur(e); // Giữ lại xử lý của Formik
              handleBlurRecipientWalletCode(e); // Thêm hàm kiểm tra mã ví
            }}
            value={formikCreateTransaction.values.recipientWalletCode}
          />
          {formikCreateTransaction.touched.recipientWalletCode &&
            formikCreateTransaction.errors.recipientWalletCode && (
              <div className="error">{formikCreateTransaction.errors.recipientWalletCode}</div>
            )}
          {recipientName && <p>Recipient: {recipientName}</p>}
        </div>

        <div>
          <label>Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            onChange={formikCreateTransaction.handleChange}
            onBlur={formikCreateTransaction.handleBlur}
            value={formikCreateTransaction.values.amount}
          />
          {formikCreateTransaction.touched.amount &&
            formikCreateTransaction.errors.amount && (
              <div className="error">{formikCreateTransaction.errors.amount}</div>
            )}
        </div>

        <div>
          <label>Description</label>
          <textarea
            id="description"
            name="description"
            onChange={formikCreateTransaction.handleChange}
            onBlur={formikCreateTransaction.handleBlur}
            value={formikCreateTransaction.values.description}
          />
          {formikCreateTransaction.touched.description &&
            formikCreateTransaction.errors.description && (
              <div className="error">{formikCreateTransaction.errors.description}</div>
            )}
        </div>

        {/* <button type="submit">Continue</button> */}
        <div className="button-group">
          <button type="button" className="btn-continue" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </form>
    </div>
  );

  // Step 2: Render OTP Confirmation Form
  const renderOTPStep = () => (
    <div className="otp-form">
      <h2>Confirm Transaction</h2>
      <p>OTP has been sent to your registered email</p>
      {error && <div className="error">{error}</div>}
      {/* Transaction Summary */}
      <div className="transaction-summary">
        <h3>Transaction Details</h3>
        <p>
          <strong>Recipient:</strong> {recipientName || "N/A"}
        </p>
        <p>
          <strong>Recipient Wallet Code:</strong> {formikCreateTransaction.values.recipientWalletCode}
        </p>
        <p>
          <strong>Amount:</strong> {formikCreateTransaction.values.amount} USD
        </p>
        <p>
          <strong>Description:</strong> {formikCreateTransaction.values.description || "N/A"}
        </p>
        <br></br>
      </div>
      <form onSubmit={formikOTP.handleSubmit}>
        <div>
          <label>Enter OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            onChange={formikOTP.handleChange}
            onBlur={formikOTP.handleBlur}
            value={formikOTP.values.otp}
          ></input>
          {formikOTP.touched.otp && formikOTP.errors.otp && (
            <div className="error">{formikOTP.errors.otp}</div>
          )}
        </div>
        <div className="button-group">
          <button type="submit">Confirm Transaction</button>
          {/* <button type="submit" disabled={lockUntil && new Date() < lockUntil}>
            Confirm
          </button> */}
          <button type="button" className="btn-back" onClick={() => setStep(1)}>Back</button>
        </div>
      </form>
    </div>
  );

  const handleBlurRecipientWalletCode = async (e) => {
    const walletCode = e.target.value.trim();
    if (!walletCode) return;

    try {
      if (walletCode === senderWalletCode) {
        setRecipientName("");
        setError("Wallet code cannot match your wallet code"); // Chỉ báo lỗi
        setSnackbar({
          open: true,
          message: "Wallet code cannot match your wallet code",
          severity: "error"
        });
        return;
      }

      // Gọi API để lấy thông tin ví
      const walletInfo = await getWalletByWalletCode(walletCode);
      console.log(walletInfo)
      if (!walletInfo || !walletInfo.userId) {
        setRecipientName("");
        throw new Error("Wallet information not found or invalid information");
      }

      // Gọi API để lấy thông tin người dùng dựa trên userId từ ví
      const recipientInfo = await getUserById(walletInfo.userId);
      const recipientFullName = `${recipientInfo.firstName} ${recipientInfo.lastName}`;
      setRecipientName(recipientFullName); // Cập nhật trạng thái tên người nhận
    } catch (err) {
      setRecipientName(""); // Reset tên nếu xảy ra lỗi
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error"
      });
      // setError("Recipient not found. Please check wallet code!");
    }
  };

  const handleContinue = async () => {
    if (lockUntil && new Date() < lockUntil) {
      const remainingTime = Math.ceil((lockUntil - new Date()) / 60000); // Tính số phút còn lại
      setSnackbar({
        open: true,
        message: `You are temporarily locked. Please try again after ${remainingTime} minute(s).`,
        severity: "error"
      });
      return;
    }

    // Gọi submit nếu không bị khóa
    if (!formikCreateTransaction.isSubmitting) {
      await formikCreateTransaction.handleSubmit();
    }
  };

  // Xử lý thay đổi form
  useEffect(() => {
    if (otpAttempts > 0 || lockUntil) {
      // Reset trạng thái khi sửa form
      setOtpAttempts(0);
      // setLockUntil(null);
      // toast.info("Form updated. Lock reset.", { position: "top-right", autoClose: 2000 });
    }
  }, [formikCreateTransaction.values]);

  // Main Render
  return (
    <>
      {/* <ToastContainer /> */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Navbar />
        </div>
        <div className="layout-page">
          <Header />
          <div className="transaction-content-wrapper">
            {step === 1 ? renderCreateTransactionStep() : renderOTPStep()}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default CreateTransaction;
