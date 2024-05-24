import classes from './UserMenu.module.css'
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import useAuth from '../../../hooks/useAuth';
import UserType  from '../../../lib/UserType';
import useLogout from '../../../hooks/useLogout';
import { IoSettingsSharp } from "react-icons/io5";
import useCurrUser from '../../../hooks/useCurrUser';
import { Link } from 'react-router-dom';
import { getProfileUrl } from '../../../lib/utils';

type PropsValues = {
    hideMenu: () => void;
}

function UserMenu({ hideMenu } : PropsValues) {
    const { auth } = useAuth();
    const logoutUser = useLogout();
    const { pictureUrl } = useCurrUser();

    return (
        <div className={classes.mainDiv} >
            <ul>

                <div className={classes.userInfo}>
                    { pictureUrl ? 
                        (<img src={pictureUrl} alt='userPicture' />) : 
                        (<FaUser size='3rem' />)
                    }
                    <div>
                        <p className={classes.imePrezime}>{auth.naziv}</p>
                        <p className={classes.role}>{auth.userType != UserType.Nedefinisano ? UserType[auth.userType] : 'Role'}</p>
                    </div>
                </div>

                <span>
                    <Link className={classes.link} onClick={hideMenu} to={getProfileUrl(auth.userType, auth.userId)}>
                        <li className={classes.item}>
                            <FaUser />
                            <span>Vaš Profil</span>
                        </li>
                    </Link>
                    <li className={classes.item}>
                        <IoSettingsSharp />
                        <span>Podešavanja Profila</span>
                    </li>
                </span>

                <span onClick={async () => await logoutUser()}>
                    <li className={classes.item}>
                        <BiLogOut/>
                        <span>Izloguj se</span>
                    </li> 
                </span>

            </ul>
        </div>
    )
}

export default UserMenu;