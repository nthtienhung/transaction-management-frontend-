import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Footer from "../../../compoment/fragment/Footer";
import Header from "../../../compoment/fragment/Header";
import Navbar from "../../../compoment/fragment/Navbar";

function TransactionListUser() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  const formDataTransaction = useFormik({
    initialValues: {
      transactionUUID: "",
      wallet: "",
      status: "",
      firstDay: "",
      lastDay: ""
    },
    onSubmit: (values) => {
      // Logic search transaction
      console.log("Search values:", values);
      // Call API to fetch transactions based on search criteria
    }
  });

  const handleCreateTransaction = () => {
    navigate("/create-transaction");
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
            <div className="table-transaction">
              <p>Transaction Manager</p>
              <hr />
              <div className="table-transaction-form-input">
                <form onSubmit={formDataTransaction.handleSubmit}>
                  <div className="top-form-input">
                    <div>
                      Transaction UUID{" "}
                      <input
                        type="text"
                        className="input-search"
                        id="transactionUUID"
                        name="transactionUUID"
                        onChange={formDataTransaction.handleChange}
                      />
                    </div>
                    <div>
                      Wallet{" "}
                      <input
                        type="text"
                        className="input-search"
                        id="wallet"
                        name="wallet"
                        onChange={formDataTransaction.handleChange}
                      />
                    </div>
                    <div>
                      Status{" "}
                      <input
                        type="text"
                        className="input-search"
                        id="status"
                        name="status"
                        onChange={formDataTransaction.handleChange}
                      />
                    </div>
                  </div>
                  <div className="bot-form-input">
                    <div>
                      Từ ngày
                      <input
                        type="date"
                        className="input-search"
                        id="firstDay"
                        name="firstDay"
                        onChange={formDataTransaction.handleChange}
                      />
                    </div>
                    <div>
                      Đến ngày
                      <input
                        type="date"
                        className="input-search"
                        id="lastDay"
                        name="lastDay"
                        onChange={formDataTransaction.handleChange}
                      />
                    </div>
                  </div>
                  <div className="fot-input">
                    <div>
                      <button className="button" type="submit">
                        Search
                      </button>
                    </div>
                    <div>
                      <button 
                        className="button" 
                        type="reset"
                        onClick={() => formDataTransaction.resetForm()}
                      >
                        Reset
                      </button>
                    </div>
                    <div>
                      <button 
                        className="button" 
                        type="button"
                        onClick={handleCreateTransaction}
                      >
                        Create Transaction
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <hr />
              <div className="table-transaction-show">
                {/* Hiển thị danh sách giao dịch */}
                {transactions.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Wallet</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>{transaction.id}</td>
                          <td>{transaction.wallet}</td>
                          <td>{transaction.status}</td>
                          <td>{transaction.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No transactions found</p>
                )}
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