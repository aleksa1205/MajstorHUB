import { Outlet } from "react-router-dom";
import NavBar from "../LandingPageComponents/NavBar";

function RootLayout() {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    )
}

export default RootLayout;