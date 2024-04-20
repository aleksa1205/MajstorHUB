import FirstBlock from "./FirstBlock";
import Footer from "./Footer";
import MainBlock from "./MainBlock";
import NavBar from "./NavBar";
import SecondBlock from "./SecondBlock";

function LandingPage() {
    return (
        <>
            <NavBar />
            <MainBlock />
            <FirstBlock />
            <SecondBlock />
            <Footer />
        </>
    );
}

export default LandingPage;