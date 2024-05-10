import classes from './UserMenu.module.css'
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import useAuth from '../../../hooks/useAuth';
import UserType, { userToPath } from '../../../lib/UserType';
import useLogout from '../../../hooks/useLogout';


function UserMenu() {
    const { auth } = useAuth();
    const logoutUser = useLogout();

    return (
        <div className={classes.mainDiv} >
            <ul>

                <div className={classes.userInfo}>
                    <FaUser size='3rem' />
                    <div>
                        <p className={classes.imePrezime}>{auth.naziv}</p>
                        <p className={classes.role}>{auth.userType != UserType.Nedefinisano ? userToPath(auth.userType) : 'Role'}</p>
                    </div>
                </div>

                <span>
                    <li>
                        <FaUser />
                        <span>Vaš Profil</span>
                    </li>
                </span>

                <span onClick={async () => await logoutUser()}>
                    <li>
                        <BiLogOut/>
                        <span>Izloguj se</span>
                    </li> 
                </span>

            </ul>
        </div>
    )
}

export default UserMenu;