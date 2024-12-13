// import React, { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import { useNavigate } from "react-router-dom";
// import Footer from "../../../compoment/fragment/Footer";
// import Header from "../../../compoment/fragment/Header";
// import Navbar from "../../../compoment/fragment/Navbar";
// import {
//     fetchAllTransactions,
//     getUserId,
//     getWalletByUserId
// } from "../../api/TransactionApiRequest";
//
// function TransactionListUser() {
//   const navigate = useNavigate();
//   const [transactions, setTransactions] = useState([]); // Khởi tạo mặc định là mảng rỗng
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//
//     const fetchTransactions = async (page) => {
//         try {
//             const userId = await getUserId();
//             const walletResponse = await getWalletByUserId(userId);
//             const response = await fetchAllTransactions(walletResponse.walletCode, page,);
//             if (response.data.data.content != null) {
//                 setTransactions(response.data.data.content);
//                 console.log(transactions);
//                 setTotalPages(response.data.totalPages); // Giả sử tổng số trang ở trường 'totalPages'
//             } else {
//                 setTransactions([]); // Xử lý trường hợp không có dữ liệu trả về
//                 setTotalPages(10); // Đặt tổng số trang bằng 0 nếu không có dữ liệu
//             }
//         } catch (error) {
//             console.error("Failed to fetch transactions:", error);
//             setTransactions([]); // Đặt mảng rỗng nếu có lỗi
//             setTotalPages(0); // Đặt tổng số trang bằng 0 nếu có lỗi
//         }
//     };
//
//     const handleCreateTransaction = () => {
//       navigate("/create-transaction");
//     };
//
//     useEffect(() => {
//         fetchTransactions(currentPage);
//     }, [currentPage]);
//
//     const formDataTransaction = useFormik({
//         initialValues: {
//             transactionUUID: "",
//             wallet: "",
//             status: "",
//             firstDay: "",
//             lastDay: ""
//         },
//         onSubmit: async (values) => {
//             try {
//                 const response = await fetch('/transactions/search', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(values),
//                 });
//                 if (response.ok) {
//                     const data = await response.json();
//                     setTransactions(data.data); // Cập nhật danh sách giao dịch với dữ liệu trả về
//                 } else {
//                     console.error('Failed to fetch transactions:', response.statusText);
//                     setTransactions([]); // Nếu không có dữ liệu trả về
//                 }
//             } catch (error) {
//                 console.error('Error fetching transactions:', error);
//                 setTransactions([]); // Nếu có lỗi
//             }
//         },
//         onReset: () => {
//             console.log("Form Reset");
//         },
//     });
//     const formatNumber = (number) => {
//         if (number == null || isNaN(number)) return "0"; // Handle invalid numbers
//         return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//     };
//     return (
//         <>
//             <div className="layout-wrapper layout-content-navbar">
//                 <div className="layout-container">
//                     <Navbar />
//                 </div>
//                 <div className="layout-page">
//                     <Header />
//
//                     <div className="content-wrapper">
//                         <div
//                             className="table-transaction"
//                             style={{
//                                 border: "1px solid #007bff", // Đường viền màu xanh
//                                 borderRadius: "5px", // Bo góc
//                                 padding: "20px", // Thêm khoảng cách bên trong
//                                 margin: "20px", // Thêm khoảng cách xung quanh
//                                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Hiệu ứng bóng đổ
//                             }}
//                         >
//                             <p
//                                 style={{
//                                     fontSize: "18px",
//                                     fontWeight: "bold",
//                                     color: "#007bff",
//                                     marginBottom: "10px",
//                                 }}
//                             >
//                                 Transaction Manager</p>
//                             <hr />
//                             <div
//                                 className="table-transaction-form-input"
//                                 style={{
//                                     display: "flex",
//                                     flexDirection: "column",
//                                     gap: "30px", // Khoảng cách giữa các dòng
//                                     padding: "20px", // Thêm padding để có không gian xung quanh form
//                                 }}
//                             >
//                                 <form onSubmit={formDataTransaction.handleSubmit}
//                                       onReset={formDataTransaction.handleReset}
//                                       >
//                                 <div
//                                     className="form-row"
//                                     style={{
//                                         display: "flex",
//                                         gap: "20px",
//                                         marginBottom: "20px",
//                                     }}
//                                 >
//                                     <div className="form-group" style={{flex: 1}}>
//                                         <label htmlFor="transactionUUID">Transaction Code</label>
//                                         <input
//                                             type="text"
//                                             className="input-search"
//                                             id="transactionUUID"
//                                             name="transactionUUID"
//                                             onChange={formDataTransaction.handleChange}
//                                             value={formDataTransaction.values.transactionUUID}
//                                             style={{
//                                                 padding: "10px",
//                                                 border: "1px solid #ccc",
//                                                 borderRadius: "5px",
//                                                 width: "150px",
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="form-group" style={{flex: 1}}>
//                                         <label htmlFor="wallet">Wallet</label>
//                                         <input
//                                             type="text"
//                                             className="input-search"
//                                             id="wallet"
//                                             name="wallet"
//                                             onChange={formDataTransaction.handleChange}
//                                             value={formDataTransaction.values.wallet}
//                                             style={{
//                                                 padding: "10px",
//                                                 border: "1px solid #ccc",
//                                                 borderRadius: "5px",
//                                                 width: "200px",
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="form-group" style={{flex: 1}}>
//                                         <label htmlFor="status">Status</label>
//                                         <input
//                                             type="text"
//                                             className="input-search"
//                                             id="status"
//                                             name="status"
//                                             onChange={formDataTransaction.handleChange}
//                                             value={formDataTransaction.values.status}
//                                             style={{
//                                                 padding: "10px",
//                                                 border: "1px solid #ccc",
//                                                 borderRadius: "5px",
//                                                 width: "200px",
//                                             }}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div
//                                     className="form-row"
//                                     style={{
//                                         display: "flex",
//                                         gap: "20px",
//                                     }}
//                                 >
//                                     <div className="form-group" style={{flex: 1}}>
//                                         <label htmlFor="firstDay">Từ ngày</label>
//                                         <input
//                                             type="date"
//                                             className="input-search"
//                                             id="firstDay"
//                                             name="firstDay"
//                                             onChange={formDataTransaction.handleChange}
//                                             value={formDataTransaction.values.firstDay}
//                                             style={{
//                                                 padding: "10px",
//                                                 border: "1px solid #ccc",
//                                                 borderRadius: "5px",
//                                                 width: "200px",
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="form-group" style={{flex: 1}}>
//                                         <label htmlFor="lastDay">Đến ngày</label>
//                                         <input
//                                             type="date"
//                                             className="input-search"
//                                             id="lastDay"
//                                             name="lastDay"
//                                             onChange={formDataTransaction.handleChange}
//                                             value={formDataTransaction.values.lastDay}
//                                             style={{
//                                                 padding: "10px",
//                                                 border: "1px solid #ccc",
//                                                 borderRadius: "5px",
//                                                 width: "200px",
//                                             }}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div
//                                     className="form-actions"
//                                     style={{
//                                         display: "flex",
//                                         gap: "15px",
//                                         justifyContent: "center", // Căn giữa các nút
//                                         marginTop: "20px",
//                                     }}
//                                 >
//                                     <button
//                                         className="button"
//                                         type="submit"
//                                         style={{
//                                             padding: "10px 20px",
//                                             backgroundColor: "#007bff",
//                                             color: "#fff",
//                                             border: "none",
//                                             borderRadius: "5px",
//                                             cursor: "pointer",
//                                         }}
//                                     >
//                                         Search
//                                     </button>
//                                     <button
//                                         className="button"
//                                         type="reset"
//                                         style={{
//                                             padding: "10px 20px",
//                                             backgroundColor: "#007bff",
//                                             color: "#fff",
//                                             border: "none",
//                                             borderRadius: "5px",
//                                             cursor: "pointer",
//                                         }}
//                                     >
//                                         Reset
//                                     </button>
//                                     <button
//                                         className="button"
//                                         type="button"
//                                         style={{
//                                             padding: "10px 20px",
//                                             backgroundColor: "#007bff",
//                                             color: "#fff",
//                                             border: "none",
//                                             borderRadius: "5px",
//                                             cursor: "pointer",
//                                         }}
//                                         onClick={handleCreateTransaction}
//                                     >
//                                         Create
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//
//                         <hr/>
//                         <div className="table-transaction-show">
//                             <table className="transaction-table">
//                                 <thead>
//                                 <tr>
//                                     <th>Transaction Code</th>
//                                     <th>From Wallet</th>
//                                     <th>To Wallet</th>
//                                     <th>To User</th>
//                                     <th>Amount</th>
//                                     <th>Description</th>
//                                     <th>Status</th>
//                                     <th>Operation</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody>
//                                 {Array.isArray(transactions) &&
//                                         transactions.map((transaction, index) => (
//                                             <tr key={index}>
//                                                 <td>{transaction.transactionCode}</td>
//                                                 <td>{transaction.senderWalletCode}</td>
//                                                 <td>{transaction.receiverWalletCode}</td>
//                                                 <td>{transaction.lastName} {transaction.firstName}</td>
//                                                 <td>{formatNumber(transaction.amount)}đ</td>
//                                                 <td>{transaction.description}</td>
//                                                 <td>{transaction.status}</td>
//                                                 <td><a href={'/'}>Detail</a></td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//
//                             <div className="pagination">
//                                 <button
//                                     // onClick={() => setCurrentPage(currentPage - 1)}
//                                     onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))}
//                                     disabled={currentPage === 0}
//                                 >
//                                     Previous
//                                 </button>
//                                 <span>
//                   Page {currentPage + 1} of {totalPages}
//                 </span>
//                                 <button
//                                     // onClick={() => setCurrentPage(currentPage + 1)}
//                                     onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
//                                     // disabled={currentPage === totalPages - 1}
//                                     disabled={transactions.length === 0 || currentPage === totalPages - 1}
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                     <Footer />
//                 </div>
//             </div>
//         </>
//     );
// }
//
// export default TransactionListUser;
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

function TransactionListUser() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchTransactions = async (page) => {
        try {
            const userId = await getUserId();
            const walletResponse = await getWalletByUserId(userId);
            const response = await fetchAllTransactions(walletResponse.walletCode, page);
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
        onSubmit: async (values) => {
            try {
                const userId = await getUserId();
                const walletResponse = await getWalletByUserId(userId);

                const filters = {
                    transactionUUID: formDataTransaction.values.transactionCode || undefined,
                    wallet: formDataTransaction.values.walletCodeByUserSearch || undefined,
                    status: formDataTransaction.values.status || undefined,
                    firstDay: formDataTransaction.values.fromDate || undefined,
                    lastDay: formDataTransaction.values.toDate || undefined
                };
                const response = await fetchAllTransactions(walletResponse.walletCode, currentPage, filters);

                if (response.data.data.content) {
                    setTransactions(response.data.data.content);
                    setTotalPages(response.data.data.totalPages || 0);
                } else {
                    setTransactions([]);
                    setTotalPages(0);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setTransactions([]);
            }
        },
        onReset: () => {
            setTransactions([]);
            fetchTransactions(0);
            setCurrentPage(0);
        },
    });

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
                                            <label htmlFor="transactionUUID">Transaction Code</label>
                                            <input
                                                type="text"
                                                id="transactionUUID"
                                                name="transactionUUID"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.transactionUUID}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "150px",
                                                }}
                                            />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label htmlFor="wallet">Wallet</label>
                                            <input
                                                type="text"
                                                id="wallet"
                                                name="wallet"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.wallet}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "200px",
                                                }}
                                            />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label htmlFor="status">Status</label>
                                            <input
                                                type="text"
                                                id="status"
                                                name="status"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.status}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "200px",
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
                                                id="firstDay"
                                                name="firstDay"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.firstDay}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "200px",
                                                }}
                                            />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label htmlFor="lastDay">Đến ngày</label>
                                            <input
                                                type="date"
                                                id="lastDay"
                                                name="lastDay"
                                                onChange={formDataTransaction.handleChange}
                                                value={formDataTransaction.values.lastDay}
                                                style={{
                                                    padding: "10px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    width: "200px",
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
                                        transactions.map((transaction, index) => (
                                            <tr key={index}>
                                                <td>{transaction.transactionCode}</td>
                                                <td>{transaction.senderWalletCode}</td>
                                                <td>{transaction.receiverWalletCode}</td>
                                                <td>{transaction.lastName} {transaction.firstName}</td>
                                                <td>{transaction.amount} đ</td>
                                                <td>{transaction.description}</td>
                                                <td>{transaction.status}</td>
                                                <td><a href={'/'}>Detail</a></td>
                                            </tr>
                                        ))}
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
                                    onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
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
