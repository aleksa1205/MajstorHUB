import { Outlet } from "react-router-dom";
import classes from './AsudeLayout.module.css'
import UserInfoAside from "../AuthorizedComponents/AsideComponents/UserInfoAside";
import { useEffect, useState } from "react";

function AsideLayout() {

    const [showAside, setShowAside] = useState<boolean>(window.innerWidth >= 1000);

    useEffect(() => {
        function resizeHandler() {
            setShowAside(window.innerWidth >= 1000);
        }

        window.addEventListener('resize', resizeHandler);

        return () => window.removeEventListener('resize', resizeHandler);
    })

    return (
        <div className="container">
            <div className={classes.main}>
                <Outlet />
                {showAside && <UserInfoAside />}
            </div>
        </div>
    )
}

export default AsideLayout;