import Footer from "../../../compoment/fragment/Footer";
import Header from "../../../compoment/fragment/Header";
import Navbar from "../../../compoment/fragment/Navbar";

function HoneUser() {
  return (
    <>
      <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
          <Navbar></Navbar>
        </div>
        <div class="layout-page">
          <Header></Header>

          <div class="content-wrapper">
            <div className="dasboard">
              <div className="dasboard-item">
                <p>Số tiền có trong ví:</p>
                <span className="item-value">14.000.000 đ</span>
              </div>
              <div className="dasboard-item">
                <p>Tổng số tiền đã gửi trong tuần:</p>
                <span className="item-value">119.900.000 đ</span>
              </div>
              <div className="dasboard-item">
                <p>Tổng số tiền nhận theo tuần:</p>
                <span className="item-value">15.300.000 đ</span>
              </div>
              <div className="dasboard-item">
                <p>Tổng số giao dịch đã thực hiện:</p>
                <span className="item-value">1</span>
              </div>
            </div>
            <div className="content-dashboard">
              <div className="dasboard-table">
                <p>Lịch sử giao dịch đã gửi (10 giao dịch gần nhất) </p>
                <hr className="label-dasboard" />
                <table>
                  <tr>
                    <td>#MGD201001 biên giao dịch ngày 10/11/2024 số tiền 1.500.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD201002 biên giao dịch ngày 11/11/2024 số tiền 2.500.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD201003 biên giao dịch ngày 11/11/2024 số tiền 1.000.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD201004 biên giao dịch ngày 13/11/2024 số tiền 500.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD201005 biên giao dịch ngày 13/11/2024 số tiền 300.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD201006 biên giao dịch ngày 15/11/2024 số tiền 100.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD201007 biên giao dịch ngày 16/11/2024 số tiền 10.500.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD201008 biên giao dịch ngày 17/11/2024 số tiền 100.500.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD201009 biên giao dịch ngày 17/11/2024 số tiền 2.500.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD201010 biên giao dịch ngày 19/11/2024 số tiền 500.000 đ</td>
                  </tr>
                </table>
              </div>
              <div className="dasboard-table">
                <p>Lịch sử giao dịch đã nhận (10 giao dịch gần nhất) </p>
                <hr className="label-dasboard" />
                <table>
                  <tr>
                    <td>#MGD301001 biên giao dịch ngày 09/11/2024 số tiền 500.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD301002 biên giao dịch ngày 11/11/2024 số tiền 500.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD301003 biên giao dịch ngày 11/11/2024 số tiền 100.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD301004 biên giao dịch ngày 20/11/2024 số tiền 200.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD301005 biên giao dịch ngày 25/11/2024 số tiền 100.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD301006 biên giao dịch ngày 25/11/2024 số tiền 200.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD301007 biên giao dịch ngày 26/11/2024 số tiền 1.500.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD301008 biên giao dịch ngày 27/11/2024 số tiền 10.500.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD301009 biên giao dịch ngày 27/11/2024 số tiền 1.500.000 đ</td>
                  </tr>
                  <tr>
                  <td>#MGD301010 biên giao dịch ngày 29/11/2024 số tiền 200.000 đ</td>
                  </tr>
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
