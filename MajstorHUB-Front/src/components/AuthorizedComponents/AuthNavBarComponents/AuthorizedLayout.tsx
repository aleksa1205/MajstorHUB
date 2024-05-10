import { Outlet } from "react-router-dom";
import AuthNavBar from "./AuthNavBar";

function AuthorizedLayout() {
    return (
        <>
            <AuthNavBar />
            <Outlet />
        </>
    )
}

export default AuthorizedLayout;