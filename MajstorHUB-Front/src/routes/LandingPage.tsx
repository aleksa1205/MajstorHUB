
import FirstBlock from "../components/LandingPageComponents/FirstBlock";
import Footer from "../components/LandingPageComponents/Footer";
import MainBlock from "../components/LandingPageComponents/MainBlock";
import NavBar from "../components/LandingPageComponents/NavBar";
import SecondBlock from "../components/LandingPageComponents/SecondBlock";

function LandingPage() {
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