
import Footer from "../../../compoment/fragment/Footer";
import Header from "../../../compoment/fragment/Header";
import Navbar from "../../../compoment/fragment/Navbar";

function HomeAdmin(){
  
    return(
        <>
         <div class="layout-wrapper layout-content-navbar">
            <div class="layout-container">
             <Navbar></Navbar>
            </div>
            <div class="layout-page">
                <Header></Header>
                <div class="content-wrapper">
                    
                </div>
                <Footer></Footer>
            </div>
        </div>
        </>
    )
}
export default HomeAdmin;