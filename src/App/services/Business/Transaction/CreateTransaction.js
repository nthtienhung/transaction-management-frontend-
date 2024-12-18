import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
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
  const [error, setError] = useState("");

  const getUserId = async () => {
    try {
      const token = Cookies.get("its-cms-accessToken");
      console.log(token);

      if (!token) {
        throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
      }

      const response = await axios.get("http://localhost:8888/api/v1/user/profile", {
        headers: { Authorization: token },
      });

      console.log(response.data.userId);

      return response.data.data.userId; // Giả sử API trả về userId trong response.data
    } catch (error) {
      // Xử lý lỗi
      axios.get("http://localhost:8888/api/v1/auth/refreshTokenUser",{
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("its-cms-refreshToken")}`,
        },
      }).then(res =>{
        Cookies.remove("its-cms-accessToken");
        sessionStorage.removeItem("its-cms-refreshToken");
        Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
        sessionStorage.setItem("its-cms-refreshToken",res.data.data.refreshToken);
      })
    }
  };

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

        // Call API to get wallet info by wallet code
        const walletInfo = await getWalletByWalletCode(values.recipientWalletCode);

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
        console.log(senderWalletCode);

        // Send OTP
        await sendOTP({
          walletCode: senderWalletCode.walletCode,
          amount: values.amount,
        });

        // Move to OTP step
        setStep(2);
      } catch (err) {
        setError("Failed to validate recipient or send OTP. Please try again.");
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
        await confirmTransaction({
          senderWalletCode: senderWalletCode.walletCode, // Replace with actual sender wallet code from context/auth
          recipientWalletCode: formikCreateTransaction.values.recipientWalletCode,
          amount: formikCreateTransaction.values.amount,
          description: formikCreateTransaction.values.description,
          otp: values.otp,
        });

        // Navigate to transaction list on success
        navigate("/transactionUser");
      } catch (err) {
        setError("Transaction failed. Please verify OTP and try again.");
      }
    },
  });

  // Step 1: Render Create Transaction Form
  const renderCreateTransactionStep = () => (
    <div className="create-transaction-form">
      <h2>Create Transaction</h2>
      {error && <div className="error">{error}</div>}
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

        <button type="submit">Continue</button>
      </form>
    </div>
  );

  // Step 2: Render OTP Confirmation Form
  const renderOTPStep = () => (
    <div className="otp-form">
      <h2>Confirm Transaction</h2>
      <p>OTP has been sent to your registered email</p>
      {error && <div className="error">{error}</div>}
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
          />
          {formikOTP.touched.otp && formikOTP.errors.otp && (
            <div className="error">{formikOTP.errors.otp}</div>
          )}
        </div>

        <button type="submit">Confirm Transaction</button>
        <button type="button" onClick={() => setStep(1)}>Back</button>
      </form>
    </div>
  );

  const handleBlurRecipientWalletCode = async (e) => {
    const walletCode = e.target.value.trim();
    if (!walletCode) return;

    try {
      // Gọi API để lấy thông tin ví
      const walletInfo = await getWalletByWalletCode(walletCode);
      if (!walletInfo || !walletInfo.userId) {
        setRecipientName("");
        throw new Error("Không tìm thấy thông tin ví hoặc thông tin không hợp lệ.");
      }

      // Gọi API để lấy thông tin người dùng dựa trên userId từ ví
      const recipientInfo = await getUserById(walletInfo.userId);
      const recipientFullName = `${recipientInfo.firstName} ${recipientInfo.lastName}`;
      setRecipientName(recipientFullName); // Cập nhật trạng thái tên người nhận
    } catch (err) {
      setRecipientName(""); // Reset tên nếu xảy ra lỗi
      setError("Không thể tìm thấy người nhận. Vui lòng kiểm tra mã ví.");
    }
  };


  // Main Render
  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Navbar />
      </div>
      <div className="layout-page">
        <Header />
        <div className="content-wrapper">
          {step === 1 ? renderCreateTransactionStep() : renderOTPStep()}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default CreateTransaction;
