import { Outlet } from "react-router-dom";
import NavBar from "../LandingPageComponents/NavBar";

function RootLayout() {
    
    window.onscroll = function() {
        if(document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            document.querySelector("header")!.style.borderBottom = "1px solid #c2c8d2";
        }
        else {
            document.querySelector("header")!.style.borderBottom = "";
        }
    }

    return (
        <>
            <NavBar />
            <Outlet />
        </>
    )
}

export default RootLayout;