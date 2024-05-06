
import FirstBlock from "../components/LandingPageComponents/FirstBlock";
import Footer from "../components/LandingPageComponents/Footer";
import MainBlock from "../components/LandingPageComponents/MainBlock";
import NavBar from "../components/LandingPageComponents/NavBar";
import SecondBlock from "../components/LandingPageComponents/SecondBlock";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import UserType from "../lib/UserType";

function LandingPage() {
    const axiosPrivate = useAxiosPrivate(UserType.Firma);

    async function getAllFirma() {
        const response = await axiosPrivate.get('Firma/GetAll');
        console.log(response.data);
    }

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
            <button onClick={() => getAllFirma()}>GetAllFirma</button>
            <SecondBlock /> 
            <FirstBlock />
            <Footer />
        </>
    );
}

export default LandingPage;