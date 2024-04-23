import FirstBlock from "./FirstBlock";
import Footer from "./Footer";
import MainBlock from "./MainBlock";
import NavBar from "./NavBar";
import SecondBlock from "./SecondBlock";

function LandingPage() {

    window.onscroll = function() {
        if(document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            document.querySelector("header")!.style.borderBottom = "1px solid black";
        }
        else {
            document.querySelector("header")!.style.borderBottom = "";
        }
    }

    return (
        <>
            <NavBar />
            <MainBlock />
            <SecondBlock /> 
            <FirstBlock />
            <Footer />
        </>
    );
}

export default LandingPage;