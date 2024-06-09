import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Forbidden from "../ErrorBoundary/ErrorPages/Forbidden";
import { AdminRoles } from "../../context/AuthProvider";

function SudoAdminRequiredLayout() {
    const { auth } = useAuth();

    if(auth.admin !== AdminRoles.SudoAdmin) {
        return <Forbidden />
    } else {
        return (
            <Outlet />
        )
    }

}

export default SudoAdminRequiredLayout;