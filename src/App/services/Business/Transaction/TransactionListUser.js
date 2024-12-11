import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Footer from "../../../compoment/fragment/Footer";
import Header from "../../../compoment/fragment/Header";
import Navbar from "../../../compoment/fragment/Navbar";
import {fetchAllTransactions, getUserId, getWalletByUserId} from "../../api/TransactionApiRequest";

function TransactionListUser() {
    const [transactions, setTransactions] = useState([]); // Khởi tạo mặc định là mảng rỗng
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchTransactions = async (page) => {
        try {
            const userId = await getUserId();
            const walletResponse = await getWalletByUserId(userId);
            const response = await fetchAllTransactions(walletResponse.walletCode ,page);
            if (response.data.data.content != null) {
                setTransactions(response.data.data.content);
                console.log(transactions);// Giả sử dữ liệu nằm trong trường 'content'
                setTotalPages(response.data.totalPages); // Giả sử tổng số trang ở trường 'totalPages'
            } else {
                setTransactions([]); // Xử lý trường hợp không có dữ liệu trả về
                setTotalPages(0); // Đặt tổng số trang bằng 0 nếu không có dữ liệu
            }
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
            setTransactions([]); // Đặt mảng rỗng nếu có lỗi
            setTotalPages(0); // Đặt tổng số trang bằng 0 nếu có lỗi
        }
    };

    useEffect(() => {
        fetchTransactions(currentPage);
    }, [currentPage]);

    const formDataTransaction = useFormik({
        initialValues: {
            transactionUUID: "",
            wallet: "",
            status: "",
            firstDay: "",
            lastDay: ""
        },
        onSubmit: (values) => {
            console.log("Form Data:", values);
            // Thêm logic xử lý khi gửi form tại đây
        },
        onReset: () => {
            console.log("Form Reset");
        },
    });

    return (
        <>
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    <Navbar />
                </div>
                <div className="layout-page">
                    <Header />

                    <div className="content-wrapper">
                        <div className="table-transaction">
                            <p>Transaction Manager</p>
                            <hr />
                            <div
                                className="table-transaction-form-input"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "30px", // Khoảng cách giữa các dòng
                                    padding: "20px", // Thêm padding để có không gian xung quanh form
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
                                            <label htmlFor="transactionUUID">Transaction UUID</label>
                                            <input
                                                type="text"
                                                className="input-search"
                                                id="transactionUUID"
                                                name="transactionUUID"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.transactionUUID}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label htmlFor="wallet">Wallet</label>
                                            <input
                                                type="text"
                                                className="input-search"
                                                id="wallet"
                                                name="wallet"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.wallet}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label htmlFor="status">Status</label>
                                            <input
                                                type="text"
                                                className="input-search"
                                                id="status"
                                                name="status"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.status}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "100%",
                                                }}
                                            />
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
                                            <label htmlFor="firstDay">Từ ngày</label>
                                            <input
                                                type="date"
                                                className="input-search"
                                                id="firstDay"
                                                name="firstDay"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.firstDay}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label htmlFor="lastDay">Đến ngày</label>
                                            <input
                                                type="date"
                                                className="input-search"
                                                id="lastDay"
                                                name="lastDay"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.lastDay}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className="form-actions"
                                        style={{
                                            display: "flex",
                                            gap: "15px",
                                            justifyContent: "flex-start",
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
                                            Submit
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
                                        <th>Transaction UUID</th>
                                        <th>From Wallet</th>
                                        <th>To Wallet</th>
                                        <th>To User</th>
                                        <th>Amount</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Array.isArray(transactions) &&
                                        transactions.map((transaction, index) => (
                                            <tr key={index}>
                                                <td>{transaction.transactionCode}</td>
                                                <td>{transaction.senderWalletCode}</td>
                                                <td>{transaction.receiverWalletCode}</td>
                                                <td>{transaction.lastName} {transaction.firstName}</td>
                                                <td>{transaction.amount}$</td>
                                                <td>{transaction.description}</td>
                                                <td>{transaction.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pagination">
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 0}
                                >
                                    Previous
                                </button>
                                <span>
                  Page {currentPage + 1} of {totalPages}
                </span>
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
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
