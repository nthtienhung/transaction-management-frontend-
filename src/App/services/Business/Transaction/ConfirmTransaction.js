import React, {useState} from "react";
import TransactionApi from "../../api/transactionServiceApi";

const ConfirmTransaction = ({transactionData, onComplete}) => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const handleConfirm = async () => {
        try {
            const response = await TransactionApi.confirmTransaction({
                ...transactionData,
                otp,
            });
            onComplete(response);
        } catch {
            setError("OTP không hợp lệ hoặc đã hết hạn!");
        }
    };

    return (
        <div>
            <h2>Xác Minh Giao Dịch</h2>
            <div>
                <label>Nhập OTP:</label>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Nhập mã OTP"
                />
            </div>
            {error && <p style={{color: "red"}}>{error}</p>}
            <button onClick={handleConfirm}>Xác nhận</button>
        </div>
    );
};

export default ConfirmTransaction;
