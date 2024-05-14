import { Outlet } from "react-router-dom";
import AuthNavBar from "../AuthorizedComponents/AuthNavBarComponents/AuthNavBar";
import Footer from "../LandingPageComponents/Footer";
import { CurrUserProvider } from "../../context/CurrUserProvider";

function AuthorizedLayout() {

    return (
        <CurrUserProvider>
            <AuthNavBar />
            <Outlet />
        </CurrUserProvider>
    )
}

export default AuthorizedLayout;