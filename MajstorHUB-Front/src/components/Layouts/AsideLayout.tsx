import { Outlet } from "react-router-dom";
import classes from './AsudeLayout.module.css'
import UserInfoAside from "../AuthorizedComponents/AsideComponents/UserInfoAside";

function AsideLayout() {
    return (
        <div className="container">
            <div className={classes.main}>
                <Outlet />
                <UserInfoAside />
            </div>
        </div>
    )
}

export default AsideLayout;