
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Footer from "../../../compoment/fragment/Footer";
import Header from "../../../compoment/fragment/Header";
import Navbar from "../../../compoment/fragment/Navbar";
import {
    fetchAllTransactions,
    getUserId,
    getWalletByUserId
} from "../../api/TransactionApiRequest";
import './style/TransactionListUser.css';
import axios from "axios";

function TransactionListUser() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [userWalletCode, setUserWalletCode] = useState("");
    const [filters, setFilters] = useState({
        transactionCode: "",
        walletCodeByUserSearch: "",
        status: "",
        fromDate: "",
        toDate: ""
    });


    const fetchTransactions = async (page,currentFilters) => {
        try {
            const userId = await getUserId();
            const walletResponse = await getWalletByUserId(userId);
            setUserWalletCode(walletResponse.walletCode);
            const response = await fetchAllTransactions(walletResponse.walletCode, page, currentFilters);
            if (response.data.data.content) {
                setTransactions(response.data.data.content);
                setTotalPages(response.data.data.totalPages || 0);
            } else {
                setTransactions([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
            setTransactions([]);
            setTotalPages(0);
        }
    };

    const handleCreateTransaction = () => {
        navigate("/create-transaction");
    };

    useEffect(() => {
        fetchTransactions(currentPage,filters);
    }, [currentPage]);

    const formDataTransaction = useFormik({
        initialValues: {
            transactionCode: "",
            walletCodeByUserSearch: "",
            status: "",
            fromDate: "",
            toDate: ""
        },
        onSubmit: async (values) => {

            setFilters(values);
            setCurrentPage(0);
            await fetchTransactions(0, values);
        },
        onReset: () => {
            // console.log("Form reset to:", formDataTransaction.initialValues);
            // window.location.reload();
            const initialFilters = {
                transactionCode: "",
                walletCodeByUserSearch: "",
                status: "",
                fromDate: "",
                toDate: ""
            };
            setFilters(initialFilters);
            fetchTransactions(0, initialFilters);
        },
    });

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchTransactions(newPage, filters);
    };

    const formatNumber = (number) => {
        if (number == null || isNaN(number)) return "0";
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (

        <>
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    <Navbar />
                </div>
                <div className="layout-page">
                    <Header />

                    <div className="content-wrapper">
                        <div
                            className="table-transaction"
                            style={{
                                border: "1px solid #007bff",
                                borderRadius: "5px",
                                padding: "20px",
                                margin: "20px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#007bff",
                                    marginBottom: "10px",
                                }}
                            >
                                Transaction Manager
                            </p>
                            <hr />
                            <div
                                className="table-transaction-form-input"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "30px",
                                    padding: "20px",
                                }}
                            >
                                <form
                                    onSubmit={formDataTransaction.handleSubmit}
                                    onReset={formDataTransaction.handleReset}
                                >
                                    <div
                                        className="form-row"
                                        style={{
                                            display: "flex",
                                            gap: "20px",
                                            marginBottom: "20px",
                                        }}
                                    >
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label htmlFor="transactionCode">Transaction Code</label>
                                            <input
                                                type="text"
                                                id="transactionCode"
                                                name="transactionCode"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.transactionCode}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "100%",
                                                    boxSizing: "border-box",
                                                  }}
                                            />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label htmlFor="walletCodeByUserSearch">Wallet</label>
                                            <input
                                                type="text"
                                                id="walletCodeByUserSearch"
                                                name="walletCodeByUserSearch"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.walletCodeByUserSearch}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "100%",
                                                    boxSizing: "border-box",
                                                  }}
                                            />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label htmlFor="status">Status</label>
                                            <select
                                                type="text"
                                                id="status"
                                                name="status"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.status}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "100%",
                                                    boxSizing: "border-box",
                                                  }}
                                            >
                                                <option value={""}>-------</option>
                                                <option value={"SUCCESS"}>SUCCESS</option>
                                                <option value={"PENDING"}>PENDING</option>
                                                <option value={"FAILED"}>FAILED</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div
                                        className="form-row"
                                        style={{
                                            display: "flex",
                                            gap: "20px",
                                        }}
                                    >
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label htmlFor="fromDate">Từ ngày</label>
                                            <input
                                                type="date"
                                                id="fromDate"
                                                name="fromDate"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.fromDate}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "100%",
                                                    boxSizing: "border-box",
                                                  }}
                                            />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label htmlFor="toDate">Đến ngày</label>
                                            <input
                                                type="date"
                                                id="toDate"
                                                name="toDate"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.toDate}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "100%",
                                                    boxSizing: "border-box",
                                                  }}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className="form-actions"
                                        style={{
                                            display: "flex",
                                            gap: "15px",
                                            justifyContent: "center",
                                            marginTop: "20px",
                                        }}
                                    >
                                        <button
                                            className="button"
                                            type="submit"
                                            style={{
                                                padding: "10px 20px",
                                                backgroundColor: "#007bff",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Search
                                        </button>
                                        <button
                                            className="button"
                                            type="reset"
                                            style={{
                                                padding: "10px 20px",
                                                backgroundColor: "#007bff",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Reset
                                        </button>
                                        <button
                                            className="button"
                                            type="button"
                                            style={{
                                                padding: "10px 20px",
                                                backgroundColor: "#007bff",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                            }}
                                            onClick={handleCreateTransaction}
                                        >
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <hr />
                            <div className="table-transaction-show">
                                <table className="transaction-table">
                                    <thead>
                                    <tr>
                                        <th>Transaction Code</th>
                                        <th>From Wallet</th>
                                        <th>To Wallet</th>
                                        <th>To User</th>
                                        <th>Amount</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Operation</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Array.isArray(transactions) &&
                                        transactions.map((transaction, index) => {
                                            // Xác định loại giao dịch
                                            const isSentTransaction = transaction.senderWalletCode === userWalletCode;

                                            // Thêm dấu và định dạng số tiền
                                            const amountDisplay = isSentTransaction
                                                ? `- ${formatNumber(transaction.amount)} đ`
                                                : `+ ${formatNumber(transaction.amount)} đ`;

                                            // Định nghĩa style cho cột amount
                                            const amountStyle = {
                                                color: isSentTransaction ? "red" : "green",
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                            };

                                            return (
                                                <tr key={index}>
                                                    <td data-label="Transaction Code">{transaction.transactionCode}</td>
                                                    <td data-label="From Wallet">{transaction.senderWalletCode}</td>
                                                    <td data-label="To Wallet">{transaction.receiverWalletCode}</td>
                                                    <td data-label="To User">{transaction.lastName} {transaction.firstName}</td>
                                                    <td data-label="Amount" style={amountStyle}>{amountDisplay}</td>
                                                    <td data-label="Description">{transaction.description}</td>
                                                    <td data-label="Status">{transaction.status}</td>
                                                    <td data-label="Operation"><a href="/">Detail</a></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pagination">
                                <button
                                    onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))}
                                    disabled={currentPage === 0}
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {currentPage + 1} of {totalPages}
                                </span>
                                <button
                                    // onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={transactions.length === 0 || currentPage === totalPages - 1}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default TransactionListUser;

