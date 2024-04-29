import FirstBlock from "../components/LandingPageComponents/FirstBlock";
import Footer from "../components/LandingPageComponents/Footer";
import MainBlock from "../components/LandingPageComponents/MainBlock";
import NavBar from "../components/LandingPageComponents/NavBar";
import SecondBlock from "../components/LandingPageComponents/SecondBlock";

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