import classes from './NavBar.module.css';
import { Link } from 'react-router-dom';
import { IoMenu, IoClose } from "react-icons/io5";
import BasicSidebar from './BasicSiderbar';
import useLogout from '../../hooks/useLogout';
import useAuth from '../../hooks/useAuth';
import logo from '../../../pictures/Logo/LogoTransparent2.png'
import useNavSidebarAnim from '../../hooks/useNavSidebarAnim';

function NavBar() {
    const logoutUser = useLogout();
    const { auth } = useAuth();
    const isLoggedIn = auth.userId !== '';

    const { showSidebar, transition, toggleSidebar, hideSidebar } = useNavSidebarAnim();


    return (
        <header>
            <nav className={`container ${classes.nav}`}>
                {!showSidebar ? 
                    <IoMenu onClick={toggleSidebar} className={classes.dropDown} size='2rem' /> :
                    <IoClose  onClick={toggleSidebar} className={classes.dropDown} size='2rem' />
                }
                <Link to='/' onClick={hideSidebar} className={classes.logo}>
                    <img className={classes.logo} src={logo} alt="MajstorHUB" />
                </Link>
                <Link to='/register' onClick={hideSidebar} className={`${classes.register} link`}>Registruj Se</Link>
                <div className={classes.optionsContainer}>
                    <span>
                        <Link to='/login' onClick={hideSidebar} className="link">Pronađi Posao</Link>
                        <Link to='/login' onClick={hideSidebar} className="link">Pronađi Izvodjače</Link>
                    </span>
                    {isLoggedIn ? 
                        <>
                            <Link onClick={hideSidebar} to='/dashboard' className={`link ${classes.dashboard}`}>Dashboard</Link>
                            <button onClick={async () => {
                                hideSidebar();
                                await logoutUser();
                            }} className='link'>Izloguj se</button>
                        </> :
                            <Link onClick={hideSidebar} to='/login' className={`secondaryButton ${classes.loginButton}`}>Uloguj se</Link>
                    }
                    <Link to='/register' onClick={hideSidebar} className="mainButton">Registruj se</Link>
                </div>
            </nav>
            {transition((style, show) => {
                return show ? (
                    <BasicSidebar style={style} hideSidebar={hideSidebar} />
                ) : null;
            })}
        </header>
    );
}

export default NavBar;