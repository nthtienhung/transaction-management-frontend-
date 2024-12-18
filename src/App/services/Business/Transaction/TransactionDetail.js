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
        borderRadius: '8px',
        padding: '20px',
        width: '80%',
        maxWidth: '800px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    };

    const dialogTitleStyle = {
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    };

    const transactionDetailsStyle = {
        display: 'flex',
        flexDirection: 'column',
    };

    const transactionRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
    };

    const labelStyle = {
        color: '#333',
        fontWeight: 'bold',
        width: '45%',  // Ensure labels have a fixed width
    };

    const valueStyle = {
        color: '#555',
        width: '45%',  // Ensure values are aligned properly
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

    return (
        <div className="dialog-transaction" style={dialogContainerStyle}>
            <div className="dialog-transaction-information" style={dialogContentStyle}>
                <h1 style={dialogTitleStyle}>Transaction Details</h1>
                <div style={transactionDetailsStyle}>
                    {/* Sender and Receiver Information - Two Column Layout */}
                    <div style={transactionRowStyle}>
                        <div style={{ width: '50%' }}>
                            <p style={labelStyle}><strong>Sender Wallet:</strong></p>
                            <p style={valueStyle}>{transactionDetail.senderWalletCode}</p>
                            <p style={labelStyle}><strong>Sender Name:</strong></p>
                            <p style={valueStyle}>{transactionDetail.nameOfSender}</p>
                        </div>
                        <div style={{ width: '50%' }}>
                            <p style={labelStyle}><strong>Receiver Wallet:</strong></p>
                            <p style={valueStyle}>{transactionDetail.recipientWalletCode}</p>
                            <p style={labelStyle}><strong>Receiver Name:</strong></p>
                            <p style={valueStyle}>{transactionDetail.nameOfRecipient}</p>
                        </div>
                    </div>
                    {/* Other Details - Single Column Layout */}
                    <div style={transactionRowStyle}>
                        <p style={labelStyle}><strong>Transaction Code:</strong></p>
                        <p style={valueStyle}>{transactionDetail.transactionCode}</p>
                    </div>
                    <div style={transactionRowStyle}>
                        <p style={labelStyle}><strong>Amount:</strong></p>
                        <p style={valueStyle}>{transactionDetail.amount} đ</p>
                    </div>
                    <div style={transactionRowStyle}>
                        <p style={labelStyle}><strong>Status:</strong></p>
                        <p style={valueStyle}>{transactionDetail.status}</p>
                    </div>
                    <div style={transactionRowStyle}>
                        <p style={labelStyle}><strong>Description:</strong></p>
                        <p style={valueStyle}>{transactionDetail.description}</p>
                    </div>
                    <div style={transactionRowStyle}>
                        <p style={labelStyle}><strong>Sending Time:</strong></p>
                        <p style={valueStyle}>{transactionDetail.createdDate}</p>
                    </div>
                    <div style={transactionRowStyle}>
                        <p style={labelStyle}><strong>Receiving Time:</strong></p>
                        <p style={valueStyle}>{transactionDetail.updatedDate}</p>
                    </div>
                </div>
                <button onClick={onClose} style={closeButtonStyle}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default TransactionDetailDialog;
