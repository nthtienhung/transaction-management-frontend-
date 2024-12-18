import React from 'react';
import { Modal, Table, styled } from '@mui/material';
import { formatNumber } from '../utils/formatNumber';

// Custom styled modal component
const StyledModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

const modalContentStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const WalletInfoModal = ({ open, onClose, walletData }) => {
    return (
        <StyledModal
            open={open}
            onClose={onClose}
            aria-labelledby="wallet-info-modal"
        >
            <div className="modal-dialog" style={modalContentStyle}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Wallet Information</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {walletData ? (
                            <Table>
                                <tbody>
                                    <tr>
                                        <td><strong>First Name:</strong></td>
                                        <td>{walletData.firstName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Last Name:</strong></td>
                                        <td>{walletData.lastName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Wallet Code:</strong></td>
                                        <td>{walletData.walletCode}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Balance:</strong></td>
                                        <td>{formatNumber(walletData.balance)} đ</td>
                                    </tr>
                                </tbody>
                            </Table>
                        ) : (
                            <p>No wallet information available.</p>
                        )}
                    </div>
                </div>
            </div>
        </StyledModal>
    );
};

export default WalletInfoModal;