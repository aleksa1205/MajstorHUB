import classes from './AuthSidebar.module.css'
import { Link } from "react-router-dom";
import useLogout from "../../../hooks/useLogout";
import { FaUser } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import UserType, { userToPath } from '../../../lib/UserType';
import { useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { IoSettingsSharp } from 'react-icons/io5';
import useCurrUser from '../../../hooks/useCurrUser';
import DottedLoader from '../../Theme/Loaders/DottedLoader';
import { getProfileUrl } from '../../../lib/utils';

type PropsValue = {
    hideSidebar(): void
}

function AuthSidebar({ hideSidebar } : PropsValue) {
    const [showUserInfo, setShowUserInfo] = useState(false)
    const logoutUser = useLogout();
    const { auth } = useAuth();
    const { pictureUrl, isFetching } = useCurrUser();

    return (
        <nav className="sidebar">
            <div>
                <div onClick={() => setShowUserInfo(!showUserInfo)} className={`${classes.userInfo} sidebar-item`}>
                    <div className={classes.info}>
                        {isFetching ?
                            (<DottedLoader size='3rem' />) :
                            pictureUrl ?
                            (<img src={pictureUrl} alt='User Picture' />) : 
                            (<FaUser size='2rem' />)
                        }

                        <div>
                            <p className={classes.imePrezime}>{auth.naziv}</p>
                            <p className={classes.role}>{auth.userType != UserType.Nedefinisano ? UserType[auth.userType] : 'Role'}</p>
                        </div>
                    </div>
                    <MdOutlineKeyboardArrowUp size='2rem' className={`${classes.arrow}  ${showUserInfo && classes.arrowDown}`} />
                </div>
                {showUserInfo && (
                    <ul className={classes.userInfoOptions}>
                        <Link className={classes.link} onClick={hideSidebar} to={getProfileUrl(auth.userType, auth.userId)}>
                        <li>
                            <div>
                                    <FaUser />
                                    <p>Vaš Profil</p>
                            </div>
                        </li>
                        </Link>
                        <li>
                            <div>
                                <IoSettingsSharp />
                                <p>Podešavanja Profila</p>
                            </div>
                        </li>

                        <li onClick={async () => await logoutUser()}>
                            <div>
                                <BiLogOut/>
                                <p>Izloguj se</p>
                            </div> 
                        </li>
                    </ul>
                )}
                <Link to='/klijenti' onClick={hideSidebar} className='link sidebar-item'>Pretraži Klijente</Link>
                <Link to='/majstori' onClick={hideSidebar} className='link sidebar-item'>Pretraži Majstore</Link>
                <Link to='/firme' onClick={hideSidebar} className='link sidebar-item'>Pretraži Firme</Link>
                <Link to='/oglasi' onClick={hideSidebar} className='link sidebar-item'>Pretraži Oglase</Link>
            </div>
      </nav>
    )
}

export default AuthSidebar;