import {useEffect, useState} from "react";
import Footer from "../../../compoment/fragment/Footer";
import Header from "../../../compoment/fragment/Header";
import Navbar from "../../../compoment/fragment/Navbar";
import {useFormik} from "formik";
import axios from "axios";
import Cookies from "js-cookie";
import ConfigService from "./../../../services/CONFIGFE/ConfigService";
import UserManagement from "../../../pages/Admin/UserManagement";
import {CiSearch} from "react-icons/ci";
import TransactionDetail from "./TransactionDetail";
import {getTransactionDetailByAdmin} from "../../api/transactionServiceApi";
import { date } from "yup";


function TransactionListAdmin() {
    const [transactions, setTransactions] = useState([]);
    const [activeContent, setActiveContent] = useState("dashboard"); // State để xác định nội dung hiển thị
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [transactionDetail, setTransactionDetail] = useState(null);

    const [error, setError] = useState("");
    
    const formDataTransasction = useFormik({
        initialValues: {
            transactionId: "",
            walletCode: "",
            status: "",
            fromDate: "",
            toDate: "",
        },validate: (values) => {
          const errors = {};

          // Check if `toDate` is before `fromDate`
          if (values.fromDate && values.toDate) {
              const fromDate = new Date(values.fromDate);
              const toDate = new Date(values.toDate);

              if (toDate < fromDate) {
                  errors.toDate = "Invalid logic date search.";
              }
          }

          return errors;
      },
        onSubmit: async (values) => {
            console.log(values);
            const params = new URLSearchParams();
            params.append("transactionId", values.transactionId || "");
            params.append("walletCode", values.walletCode || "");
            params.append("status", values.status || "");
            params.append("fromDate", values.fromDate ? new Date(values.fromDate).toISOString() : "");
            params.append("toDate", values.toDate ? new Date(values.toDate).toISOString() : "");
            console.log(params);
            axios
                .post(
                    "http://localhost:8888/api/v1/transaction/getAllTransaction",
                    params, // Không có body
                    {
                        params: {
                            page: 0, // Trang hiện tại
                            size: 5, // Số lượng bản ghi mỗi trang
                        },
                        headers: {
                          Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
                        },
                    }
                )
                .then((res) => {
                    console.log(res.data)
                    if (res.data.empty === true) {
                        axios.post("http://localhost:8888/api/v1/transaction/getAllTransaction", params, // Không có body
                            {
                                params: {
                                    page: currentPage + 1, // Trang hiện tại
                                    size: 5, // Số lượng bản ghi mỗi trang
                                },
                                headers: {
                                  Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
                                },
                            }
                        ).then(res => {
                            const {content, totalElements} = res.data;
                            setTransactions(content);

                            // Tính tổng số trang nếu API không trả về totalPages
                            const calculatedTotalPages = Math.ceil(totalElements / 1); // Chia theo `size`
                            setTotalPages(calculatedTotalPages);

                            console.log("Transactions:", content);
                            console.log("Total pages:", calculatedTotalPages);
                        })
                    }
                    const {content, totalElements} = res.data;
                    setTransactions(content);

                    // Tính tổng số trang nếu API không trả về totalPages
                    const calculatedTotalPages = Math.ceil(totalElements / 1); // Chia theo `size`
                    setTotalPages(calculatedTotalPages);

                    console.log("Transactions:", content);
                    console.log("Total pages:", calculatedTotalPages);
                })
                .catch((error) => {
                    axios
                        .get("http://localhost:8888/api/v1/auth/refreshTokenUser", {
                            headers: {
                                Authorization: `${sessionStorage.getItem(
                                    "its-cms-refreshToken"
                                )}`,
                            },
                        })
                        .then((res) => {
                            Cookies.remove("its-cms-accessToken");
                            sessionStorage.removeItem("its-cms-refreshToken");
                            Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
                            sessionStorage.setItem(
                                "its-cms-refreshToken",
                                res.data.data.refreshToken
                            );
                            window.location.reload();
                        });
                });
        },
        onReset: () => {
            console.log("Form reset to:", formDataTransasction.initialValues);
            window.location.reload();
        },
    });
    const fetchTransactions = async (page) => {
        try {
            console.log(Cookies.get("its-cms-accessToken"));
            console.log(formDataTransasction.values);
            const params = new URLSearchParams();
            params.append("transactionId", formDataTransasction.values.transactionId || "");
            params.append("walletCode", formDataTransasction.values.walletCode || "");
            params.append("status", formDataTransasction.values.status || "");
            params.append("fromDate", formDataTransasction.values.fromDate ? new Date(formDataTransasction.values.fromDate).toISOString() : "");
            params.append("toDate", formDataTransasction.values.toDate ? new Date(formDataTransasction.values.toDate).toISOString() : "");
            console.log(currentPage);
            const response = await axios.post(
                "http://localhost:8888/api/v1/transaction/getAllTransaction",
                params, // Không có body
                {
                    params: {
                        page: page, // Trang hiện tại
                        size: 5, // Số lượng bản ghi mỗi trang
                    },
                    headers: {
                        Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
                    },
                }
            );
            const {content, totalElements} = response.data;
            setTransactions(content);

            // Tính tổng số trang nếu API không trả về totalPages
            const calculatedTotalPages = Math.ceil(totalElements / 1); // Chia theo `size`
            setTotalPages(calculatedTotalPages);

            console.log("Transactions:", content);
            console.log("Total pages:", calculatedTotalPages);
        } catch (error) {
            axios
                .get("http://localhost:8888/api/v1/auth/refreshTokenUser", {
                    headers: {
                        Authorization: `${sessionStorage.getItem(
                            "its-cms-refreshToken"
                        )}`,
                    },
                })
                .then((res) => {
                    Cookies.remove("its-cms-accessToken");
                    sessionStorage.removeItem("its-cms-refreshToken");
                    Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
                    sessionStorage.setItem(
                        "its-cms-refreshToken",
                        res.data.data.refreshToken
                    );
                    console.log(Cookies.get("its-cms-accessToken"));
                    console.log(formDataTransasction.values);
                    const params = new URLSearchParams();
                    params.append("transactionId", formDataTransasction.values.transactionId || "");
                    params.append("walletCode", formDataTransasction.values.walletCode || "");
                    params.append("status", formDataTransasction.values.status || "");
                    params.append("fromDate", formDataTransasction.values.fromDate ? new Date(formDataTransasction.values.fromDate).toISOString() : "");
                    params.append("toDate", formDataTransasction.values.toDate ? new Date(formDataTransasction.values.toDate).toISOString() : "");
                    console.log(currentPage);
                    axios.post(
                        "http://localhost:8888/api/v1/transaction/getAllTransaction",
                        params, // Không có body
                        {
                            params: {
                                page: page, // Trang hiện tại
                                size: 5, // Số lượng bản ghi mỗi trang
                            },
                            headers: {
                                Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
                            },
                        }
                    ).then(res =>{
                        const {content, totalElements} = res.data;
                        setTransactions(content);

                        // Tính tổng số trang nếu API không trả về totalPages
                        const calculatedTotalPages = Math.ceil(totalElements / 1); // Chia theo `size`
                        setTotalPages(calculatedTotalPages);

                        console.log("Transactions:", content);
                        console.log("Total pages:", calculatedTotalPages);
                    });


                });
        }
    };
    useEffect(() => {
        fetchTransactions(currentPage);
    }, [currentPage]);
    const renderContent = () => {
        switch (activeContent) {
            case "configuration":
                return <ConfigService/>;
            case "users":
                return <UserManagement />;
            case "dashboard":
                return (<>
                    <div className="talbe-transaction">
                                    <p>Transaction Manager</p>
                                    <hr></hr>
                                    <div className="table-transaction-form-input">
                                        <form
                                            onSubmit={formDataTransasction.handleSubmit}
                                            onReset={formDataTransasction.handleReset}
                                        >
                                            <div className="top-form-input">
                                                <div>
                                                    Transaction UUID{" "}
                                                    <input
                                                        type="text"
                                                        class="input-search"
                                                        id="transactionId"
                                                        name="transactionId"
                                                        onChange={formDataTransasction.handleChange}
                                                    />
                                                </div>
                                                <div>
                                                    Wallet{" "}
                                                    <input
                                                        type="text"
                                                        className="input-search"
                                                        id="walletCode"
                                                        name="walletCode"
                                                        onChange={formDataTransasction.handleChange}
                                                    />
                                                </div>
                                                <div>
                                                    Status{" "}
                                                    <select
                                                        className="input-search"
                                                        id="status"
                                                        name="status"
                                                        onChange={formDataTransasction.handleChange}
                                                    >
                                                        <option value={""}>-------</option>
                                                        <option value={"SUCCESS"}>SUCCESS</option>
                                                        <option value={"PENDING"}>PENDING</option>
                                                        <option value={"FAILED"}>FAILED</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="bot-form-input">
                                                <div>
                                                    Từ ngày
                                                    <input
                                                        type="date"
                                                        className="input-search"
                                                        id="fromDate"
                                                        name="fromDate"
                                                        onChange={formDataTransasction.handleChange}
                                                        value={formDataTransasction.values.fromDate}
                                                    />
                                                </div>
                                                <div>
                                                    Đến ngày
                                                    <input
                                                        type="date"
                                                        className="input-search"
                                                        id="toDate"
                                                        name="toDate"
                                                        onChange={formDataTransasction.handleChange}
                                                        value={formDataTransasction.values.toDate}
                                                    />
                                                </div>
                                                {formDataTransasction.errors.toDate && (
                    <p style={{ color: "red" }}>{formDataTransasction.errors.toDate}</p>
                )}
                                            </div>
                                            <div className="fot-input">
                                                <div>
                                                    <button className="button" type="submit">
                                                        Submit
                                                    </button>
                                                </div>
                                                <div>
                                                    <button className="button" type="reset">
                                                        Reset
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <hr></hr>
                                    <div className="table-transaction-show">
                                        <div style={{overflowX: "auto", whiteSpace: "nowrap"}}>
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Transaction Code</th>
                                                    <th>From Wallet</th>
                                                    <th>From User</th>
                                                    <th>To Wallet</th>
                                                    <th>To User</th>
                                                    <th>Amount</th>
                                                    <th>Description</th>
                                                    <th>Status</th>
                                                    <th>Operator</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {transactions.map((transaction, index) => (
                                                    <tr key={transaction.id}>
                                                        <td>{index}</td>
                                                        <td>{transaction.transactionCode}</td>
                                                        <td>{transaction.senderWalletCode}</td>
                                                        <td>{transaction.fromUser}</td>
                                                        <td>{transaction.receiverWalletCode}</td>
                                                        <td>{transaction.toUser}</td>
                                                        <td>{formatNumber(transaction.amount)} đ</td>
                                                        <td>{transaction.description}</td>
                                                        <td>{transaction.status}</td>
                                                        <td style={{width: "50%", height: "50%"}}>
                                                            <div onClick={() => openDialog(transaction.transactionCode)}>
                                                                <CiSearch style={{cursor: "pointer"}}/>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* {information transaction detail} */}
                                        {isDialogOpen && transactionDetail && (
                                            <TransactionDetail
                                                transactionDetail={transactionDetail}
                                                onClose={closeDialog}
                                            />
                                        )}
                                        {/* Thanh phân trang */}
                                        <div className="pagination">
                                            <button
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                disabled={currentPage === 0}
                                            >
                                                Previous
                                            </button>
                                            <span>Page {currentPage + 1}</span>
                                            <button
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                disabled={
                                                    currentPage === totalPages || // Đã đến trang cuối
                                                    transactions.length < 5 // Số phần tử ít hơn độ dài trang cho phép
                                                }
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                    </div>
                </>)
            default:
                return <div>Welcome to the Admin Dashboard!</div>;
        }
    };
    // Gọi API khi trang thay đổi


    // Xử lý khi người dùng chọn trang
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };
    const formatNumber = (number) => {
        if (number == null || isNaN(number)) return "0"; // Handle invalid numbers
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    // show Detail
    const openDialog = async (transactionCode) => {
        try {
            const response = await getTransactionDetailByAdmin(transactionCode);
            setTransactionDetail(response);
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Error fetching transaction details:", error.message);
            alert("Failed to fetch transaction details. Please try again.");
        }
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };
    return (
        <>
            <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Navbar setActiveContent={setActiveContent} />
      </div>
      <div className="layout-page">
        <Header />
        <div className="content-wrapper">{renderContent()}</div>
        <Footer />
      </div>
    </div>
        </>
    );
}

export default TransactionListAdmin;
