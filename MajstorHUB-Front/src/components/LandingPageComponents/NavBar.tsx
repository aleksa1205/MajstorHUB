import classes from './NavBar.module.css';
import { Link } from 'react-router-dom';
import { IoMenu, IoClose } from "react-icons/io5";
import BasicSidebar from './BasicSiderbar';
import { useState } from 'react';
import { isLoggedIn } from '../../lib/utils';
import useLogout from '../../hooks/useLogout';

function NavBar() {
    const [showSidebar, setShowSidebar] = useState(false);
    const logoutUser = useLogout();

    function hideSidebar() {
        setShowSidebar(false);
    }

    return (
        <header>
            <nav className={`container ${classes.nav}`}>
                {!showSidebar ? 
                    <IoMenu onClick={() => setShowSidebar(true)} className={classes.dropDown} size='2rem' /> :
                    <IoClose  onClick={() => setShowSidebar(false)} className={classes.dropDown} size='2rem' />
                }
                <Link to='/' onClick={hideSidebar} className={classes.logo}>MajstorHUB</Link>
                <Link to='/register' onClick={hideSidebar} className={`${classes.register} link`}>Registruj Se</Link>
                <div className={classes.optionsContainer}>
                    <span>
                        <Link to='/login' className="link">Pronađi Posao</Link>
                        <Link to='/login' className="link">Pronađi Izvodjače</Link>
                    </span>
                    {isLoggedIn() ? 
                        <>
                            <Link to='/dashboard' className={`link ${classes.dashboard}`}>Dashboard</Link>
                            <button onClick={() => {
                                hideSidebar();
                                logoutUser();
                            }} className='link'>Izloguj se</button>
                        </> :
                            <Link to='/login' className={`secondaryButton ${classes.loginButton}`}>Uloguj se</Link>
                    }
                    <Link to='/register' className="mainButton">Registruj se</Link>
                </div>
            </nav>
            { showSidebar && <BasicSidebar setShowSidebar={setShowSidebar} /> }
        </header>
    );
}

export default NavBar;