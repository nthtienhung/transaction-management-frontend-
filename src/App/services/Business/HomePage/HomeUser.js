import { useEffect, useState } from "react";
import Footer from "../../../compoment/fragment/Footer";
import Header from "../../../compoment/fragment/Header";
import Navbar from "../../../compoment/fragment/Navbar";
import {
  getRecentReceivedTransactionList,
  getRecentSentTransactionList,
  getTotalAmountSentTransactionByUser,
  getTotalAmountReceivedTransactionByUser,
  getTotalTransactionByUser,
} from "../../api/transactionServiceApi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function HoneUser() {
  const [wallet, setWallet] = useState(null);
  const [sentTransactions, setSentTransactions] = useState([]);
  const [receivedTransactions, setReceivedTransactions] = useState([]);
  const [totalSent, setTotalSent] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const userId = sessionStorage.getItem("userId");

        // Fetch Wallet Info
        const walletResponse = await axios.get(
            `http://localhost:8888/api/v1/wallet/getWallet/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("its-cms-accessToken")}`,
              },
            }
        );
        const walletData = walletResponse.data;
        setWallet(walletData);

        if (walletData && walletData.walletCode) {
          // Fetch Sent Transactions
          const sentResponse = await getRecentSentTransactionList(walletData.walletCode);
          setSentTransactions(sentResponse.data.content || []);

          // Fetch Received Transactions
          const receivedResponse = await getRecentReceivedTransactionList(walletData.walletCode);
          setReceivedTransactions(receivedResponse.data.content || []);

          // Fetch Total Sent Amount
          const totalSentResponse = await getTotalAmountSentTransactionByUser(walletData.walletCode);
          setTotalSent(totalSentResponse.data);

          // Fetch Total Received Amount
          const totalReceivedResponse = await getTotalAmountReceivedTransactionByUser(walletData.walletCode);
          setTotalReceived(totalReceivedResponse.data);

          // Fetch Total Transactions
          const totalTransactionsResponse = await getTotalTransactionByUser(walletData.walletCode);
          setTotalTransactions(totalTransactionsResponse.data);
        }
      } catch (error) {
        axios.get("http://localhost:8888/api/v1/auth/refreshTokenUser",{
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("its-cms-refreshToken")}`,
          },
        }).then(res =>{
          Cookies.remove("its-cms-accessToken");
          sessionStorage.removeItem("its-cms-refreshToken");
          Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
          sessionStorage.setItem("its-cms-refreshToken",res.data.data.refreshToken);
        })
      }
    };

    fetchWalletData();
  }, []);
  const formatNumber = (number) => {
    if (number == null || isNaN(number)) return "0"; // Handle invalid numbers
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
      <>
        <div className="layout-wrapper layout-content-navbar">
          <div className="layout-container">
            <Navbar></Navbar>
          </div>
          <div className="layout-page">
            <Header></Header>

            <div className="content-wrapper">
              <div className="dasboard">
                <div className="dasboard-item">
                  <p>Số tiền có trong ví:</p>
                  <span className="item-value">
                  {wallet && wallet.balance ? formatNumber(wallet.balance) : "0"} đ
                </span>
                </div>
                <div className="dasboard-item">
                  <p>Tổng số tiền đã gửi trong tuần:</p>
                  <span className="item-value">{formatNumber(totalSent)} đ</span>
                </div>
                <div className="dasboard-item">
                  <p>Tổng số tiền nhận theo tuần:</p>
                  <span className="item-value">{formatNumber(totalReceived)} đ</span>
                </div>
                <div className="dasboard-item">
                  <p>Tổng số giao dịch đã thực hiện:</p>
                  <span className="item-value">{totalTransactions}</span>
                </div>
              </div>
              <div className="content-dashboard">
                <div className="dasboard-table">
                  <p>Lịch sử giao dịch đã gửi (10 giao dịch gần nhất)</p>
                  <hr className="label-dasboard" />
                  <table>
                    {sentTransactions.map((transaction, index) => (
                        <tr key={index}>
                          <td>
                            #{transaction.transactionCode} biên giao dịch ngày {convertToLocalDate(transaction.createdDate)} số tiền {formatNumber(transaction.amount)} đ
                          </td>
                        </tr>
                    ))}
                  </table>
                </div>
                <div className="dasboard-table">
                  <p>Lịch sử giao dịch đã nhận (10 giao dịch gần nhất)</p>
                  <hr className="label-dasboard" />
                  <table>
                    {receivedTransactions.map((transaction, index) => (
                        <tr key={index}>
                          <td>
                            #{transaction.transactionCode} biên giao dịch ngày {transaction.createdDate} số tiền {formatNumber(transaction.amount)} đ
                          </td>
                        </tr>
                    ))}
                  </table>
                </div>
              </div>
            </div>
            <Footer></Footer>
          </div>
        </div>
      </>
  );
}

export default HoneUser;
