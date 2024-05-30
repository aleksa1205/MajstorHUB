import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import UserType from "../../lib/UserType";
import Forbidden from "../ErrorPages/Forbidden";

function FirmaRequiredLayout() {
    const { auth } = useAuth();

    if(auth.userType !== UserType.Korisnik) {
        return <Forbidden />
    } else {
        return (
            <Outlet />
        )
    }

}

export default FirmaRequiredLayout;