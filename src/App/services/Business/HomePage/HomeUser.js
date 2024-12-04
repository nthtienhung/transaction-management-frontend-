import Footer from "../../../compoment/fragment/Footer";
import Header from "../../../compoment/fragment/Header";
import Navbar from "../../../compoment/fragment/Navbar";

function HoneUser(){
    return(
        <>
        <div class="layout-wrapper layout-content-navbar">
            <div class="layout-container">
             <Navbar></Navbar>
            </div>
            <div class="layout-page">
                <Header></Header>
                <Footer></Footer>
                <div class="content-wrapper">
                
                </div>
                
            </div>
        </div>
        </>
    )
}
export default HoneUser;