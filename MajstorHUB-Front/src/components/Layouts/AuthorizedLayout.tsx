import { Outlet, useLocation, Navigate } from "react-router-dom";
import AuthNavBar from "../AuthorizedComponents/AuthNavBarComponents/AuthNavBar";
import Footer from "../LandingPageComponents/Footer";
import { CurrUserProvider } from "../../context/CurrUserProvider";
import useAuth from "../../hooks/useAuth";

function AuthorizedLayout() {
    const { auth } = useAuth();
    const location = useLocation();

    if(auth.userId === '') {
        return <Navigate to='/login?message=Morate prvo da se ulogujete' state={{from: location}} replace />
    } else {
        return (
            <CurrUserProvider>
                <AuthNavBar />
                <Outlet />
                <Footer />
            </CurrUserProvider>
        )
    }

}

export default AuthorizedLayout;