import { useEffect, useState } from "react";
import Footer from "../../../compoment/fragment/Footer";
import Header from "../../../compoment/fragment/Header";
import Navbar from "../../../compoment/fragment/Navbar";
import { useFormik } from "formik";
import axios from "axios";
import Cookies from "js-cookie";
import ConfigService from "./../../../services/CONFIGFE/ConfigService";
import { CiSearch } from "react-icons/ci";
function TransactionListAdmin() {
  const [transactions, setTransactions] = useState([]);
  const [activeContent, setActiveContent] = useState("dashboard"); // State để xác định nội dung hiển thị
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formDataTransasction = useFormik({
    initialValues: {
      transactionId: "",
      walletCode: "",
      status: "",
      fromDate: "",
      toDate: "",
    },
    onSubmit: async (values) => {
      console.log(values);
      const params = new URLSearchParams();
      params.append("transactionId", values.transactionId || "");
      params.append("walletCode", values.walletCode || "");
      params.append("status", values.status || "");
      params.append("fromDate", values.fromDate || "");
      params.append("toDate", values.toDate || "");
      console.log(params);
      axios
        .post(
          "http://localhost:8888/api/v1/transaction/getAllTransaction",
          params, // Không có body
          {
            params: {
              page: currentPage, // Trang hiện tại
              size: 5, // Số lượng bản ghi mỗi trang
            },
            headers: {
              Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
            },
          }
        )
        .then((res) => {
          const { content, totalElements } = res.data;
          setTransactions(content);

          // Tính tổng số trang nếu API không trả về totalPages
          const calculatedTotalPages = Math.ceil(totalElements / 1); // Chia theo `size`
          setTotalPages(calculatedTotalPages);

          console.log("Transactions:", content);
          console.log("Total pages:", calculatedTotalPages);
        })
        .catch((error) => {
          axios
            .get("http://localhost:8888/api/v1/auth/refreshToken", {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
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
      console.log(currentPage);
      const response = await axios.post(
        "http://localhost:8888/api/v1/transaction/getAllTransaction",
        formDataTransasction.values, // Không có body
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
      const { content, totalElements } = response.data;
      setTransactions(content);

      // Tính tổng số trang nếu API không trả về totalPages
      const calculatedTotalPages = Math.ceil(totalElements / 1); // Chia theo `size`
      setTotalPages(calculatedTotalPages);

      console.log("Transactions:", content);
      console.log("Total pages:", calculatedTotalPages);
    } catch (error) {
      axios
        .get("http://localhost:8888/api/v1/auth/refreshToken", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(
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
        });
    }
  };
  const renderContent = () => {
    switch (activeContent) {
      case "configuration":
        return <ConfigService />;
      default:
        return <div>Welcome to the Admin Dashboard!</div>;
    }
  };
  // Gọi API khi trang thay đổi
  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

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
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <>
      <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
          <Navbar setActiveContent={setActiveContent} />
        </div>
        <div class="layout-page">
          <Header></Header>

          <div class="content-wrapper">
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
                      />
                    </div>
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
                <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
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
                          <td style={{ width: "50%", height: "50%" }}>
                            <div onClick={openDialog}>
                              <CiSearch style={{ cursor: "pointer" }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* {information transaction detail} */}
                {isDialogOpen && (
                  <div className="dialog-transaction">
                    <div className="dialog-transaction-information">
                      <h1 style={{ fontSize: "30px" }}>Thông tin giao dịch</h1>
                      <div className="">
                        <div className="">
                          <div className=""></div>
                          <div className=""></div>
                          <div className=""></div>
                        </div>
                        <div className=""></div>
                      </div>
                      <button
                        onClick={closeDialog}
                        style={{ marginTop: "10px" }}
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
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
          </div>
          <Footer></Footer>
        </div>
      </div>
    </>
  );
}
export default TransactionListAdmin;
