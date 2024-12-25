import React from 'react';

const TransactionDetailDialog = ({ transactionDetail, onClose }) => {
    const dialogContainerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    const dialogContentStyle = {
        background: '#fff',
        borderRadius: '10px',
        padding: '20px',
        width: '90%',
        maxWidth: '600px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        fontFamily: 'Arial, sans-serif',
    };

    const dialogTitleStyle = {
        textAlign: 'center',
        fontSize: '20px',
        marginBottom: '20px',
        fontWeight: 'bold',
        color: '#333',
    };

    const transactionDetailsStyle = {
        display: 'flex',
        flexDirection: 'column',
    };

    const sectionTitleStyle = {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: '10px',
    };

    const transactionRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        fontSize: '14px',
        color: '#333',
    };

    const labelStyle = {
        fontWeight: 'bold',
        color: '#555',
    };

    const valueStyle = {
        textAlign: 'right',
        color: '#000',
    };

    const closeButtonStyle = {
        display: 'block',
        margin: '20px auto 0',
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const convertToLocalDate = (instant) => {
        if (!instant) return "";
        const date = new Date(instant);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    return (
        <div style={dialogContainerStyle}>
            <div style={dialogContentStyle}>
                <h1 style={dialogTitleStyle}>Chi tiết giao dịch</h1>
                <h2 style={{ fontSize: '28px', textAlign: 'center', color: '#007BFF', marginBottom: '20px' }}>
                    {formatCurrency(transactionDetail.amount)}
                </h2>
                <div style={transactionDetailsStyle}>
                    {/* Chuyển khoản từ */}
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={sectionTitleStyle}>Chuyển khoản từ</h3>
                        <div style={transactionRowStyle}>
                            <span style={labelStyle}>Tên tài khoản:</span>
                            <span style={valueStyle}>{transactionDetail.nameOfSender}</span>
                        </div>
                        <div style={transactionRowStyle}>
                            <span style={labelStyle}>Số tài khoản:</span>
                            <span style={valueStyle}>{transactionDetail.senderWalletCode}</span>
                        </div>
                    </div>

                    {/* Chuyển khoản đến */}
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={sectionTitleStyle}>Chuyển khoản đến</h3>
                        <div style={transactionRowStyle}>
                            <span style={labelStyle}>Tên tài khoản:</span>
                            <span style={valueStyle}>{transactionDetail.nameOfRecipient}</span>
                        </div>
                        <div style={transactionRowStyle}>
                            <span style={labelStyle}>Số tài khoản:</span>
                            <span style={valueStyle}>{transactionDetail.recipientWalletCode}</span>
                        </div>
                        <div style={transactionRowStyle}>
                            <span style={labelStyle}>Nội dung:</span>
                            <span style={valueStyle}>{transactionDetail.description}</span>
                        </div>
                    </div>

                    {/* Thông tin giao dịch */}
                    <div>
                        <div style={transactionRowStyle}>
                            <span style={labelStyle}>Thời gian:</span>
                            <span style={valueStyle}>{convertToLocalDate(transactionDetail.createdDate)}</span>
                        </div>
                        <div style={transactionRowStyle}>
                            <span style={labelStyle}>Mã giao dịch:</span>
                            <span style={valueStyle}>{transactionDetail.transactionCode}</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} style={closeButtonStyle}>
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default TransactionDetailDialog;
