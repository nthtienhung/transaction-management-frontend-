import { useFormik } from "formik";
import Footer from "../../../compoment/fragment/Footer";
import Header from "../../../compoment/fragment/Header";
import Navbar from "../../../compoment/fragment/Navbar";
function TransactionListUser() {
  const formDataTransasction = useFormik({
    initialValues: {
      transactionUUID: "",
      wallet: "",
      status: "",
      firtDay: "",
      lastDay: ""
    },
  });


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
                        id="transactionUUID"
                        name="transactionUUID"
                        onChange={formDataTransasction.handleChange}
                      />
                    </div>
                    <div>
                      Wallet{" "}
                      <input
                        type="text"
                        className="input-search"
                        id="wallet"
                        name="wallet"
                        onChange={formDataTransasction.handleChange}
                      />
                    </div>
                    <div>
                      Status{" "}
                      <input
                        type="text"
                        className="input-search"
                        id="status"
                        name="status"
                        onChange={formDataTransasction.handleChange}
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
                        onChange={formDataTransasction.handleChange}
                      />
                    </div>
                    <div>
                      Đến ngày
                      <input
                        type="date"
                        className="input-search"
                        id="lastDay"
                        name="lastDay"
                        onChange={formDataTransasction.handleChange}
                      />
                    </div>
                  </div>
                  <div className="fot-input">
                    <div><button className="button" type="submit">Submit</button></div>
                    <div><button className="button" type="reset">Reset</button></div>
                    <div><button className="button">Create</button></div>
                  </div>
                </form>
              </div>
              <hr></hr>
              <div className="table-transaction-show"></div>
            </div>
          </div>
          <Footer></Footer>
        </div>
      </div>
    </>
  );
}
export default TransactionListUser;
