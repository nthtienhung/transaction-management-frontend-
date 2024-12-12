import { useEffect, useState } from "react";
import Footer from "../../../compoment/fragment/Footer";
import Header from "../../../compoment/fragment/Header";
import Navbar from "../../../compoment/fragment/Navbar";
import { useFormik } from "formik";
import axios from "axios";
import Cookies from 'js-cookie';
function TransactionListAdmin(){
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const formDataTransasction = useFormik({
    initialValues: {
      transactionId: "",
      walletCode: "",
      status: "SUCCESS",
      fromDate: "",
      toDate: "",
    },
    onSubmit : async (values) =>{
     axios.post(
        "http://localhost:8888/api/v1/transaction/getAllTransaction",
        null, // Không có body
        {
          params: {
            transactionId: formDataTransasction.values.transactionId,
            wallet: formDataTransasction.values.wallet,
            status: formDataTransasction.values.status,
            firtDay: formDataTransasction.values.firtDay,
            lastDay: formDataTransasction.values.lastDay,
            page: 0, // Trang hiện tại
            size: 10, // Số lượng bản ghi mỗi trang
          },
          headers: {
            Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
          },
        }
      ).then(res =>{
        setTransactions(res.data.content); // Lấy dữ liệu trang hiện tại
        setTotalPages(res.data.totalPages); // Tổng số trang
        console.log(transactions);
      }).catch ((error) =>{
        axios.get("http://localhost:8081/auth/refreshToken",{
          headers: {
            Authorization: `Bearer ${Cookies.get("its-cms-refreshToken")}`,
          },
        }).then(res =>{
          Cookies.remove("its-cms-accessToken");
          Cookies.remove("its-cms-refreshToken");
          Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
          Cookies.set("its-cms-refreshToken",res.data.data.refreshToken);
        })
      }) 
  }
  });

  const fetchTransactions = async (page) => {
    try {
      console.log(Cookies.get("its-cms-accessToken"))
      console.log(formDataTransasction.values);
      const response = await axios.post(
        "http://localhost:8888/api/v1/transaction/getAllTransaction",
        null, // Không có body
        {
          params: {
            transactionId: formDataTransasction.values.transactionId,
            wallet: formDataTransasction.values.wallet,
            status: formDataTransasction.values.status,
            firtDay: formDataTransasction.values.firtDay,
            lastDay: formDataTransasction.values.lastDay,
            page: 0, // Trang hiện tại
            size: 10, // Số lượng bản ghi mỗi trang
          },
          headers: {
            Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
          },
        }
      );
      setTransactions(response.data.content); // Lấy dữ liệu trang hiện tại
      setTotalPages(response.data.totalPages); // Tổng số trang
      console.log(transactions)
    } catch (error) {
      console.error("Error fetching transactions:", error);
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
    
    
      return (
        <>
          <div class="layout-wrapper layout-content-navbar">
            <div class="layout-container">
              <Navbar></Navbar>
            </div>
            <div class="layout-page">
              <Header></Header>
    
              <div class="content-wrapper">
                <div className="talbe-transaction">
                  <p>Transaction Manager</p>
                  <hr></hr>
                  <div className="table-transaction-form-input">
                    <form onClick={formDataTransasction.handleSubmit}>
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
                            <option value={"SUCCESS"}>SUCCESS</option>
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
                        <div><button className="button" type="submit">Submit</button></div>
                        <div><button className="button" type="reset">Reset</button></div>
                      </div>
                    </form>
                  </div>
                  <hr></hr>
                  <div className="table-transaction-show">
                  <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Transaction UUID</th>
            <th>From Wallet</th>
            <th>From User</th>
            <th>To Wallet</th>
            <th>Amount</th>
            <th>Descripsion</th>
            <th>Status</th>
            <th>Operator</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction,index) => (
            <tr key={transaction.id}>
              <td>{index}</td>
              <td>{transaction.transactionCode}</td>
              <td>{transaction.senderWalletCode}</td>
              <td>{transaction.fromUser}</td>
              <td>{transaction.receiverWalletCode}</td>
              <td>{formatNumber(transaction.amount)}</td>
              <td>{transaction.description}</td>
              <td>{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
                     {/* Thanh phân trang */}
      <div className="footer-transaction-page">
        <button className="button-page" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
          Previous
        </button>
        <span className="button-page">Page {currentPage + 1} of {totalPages}</span>
        <button className="button-page" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>
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
    )
}
export default TransactionListAdmin;