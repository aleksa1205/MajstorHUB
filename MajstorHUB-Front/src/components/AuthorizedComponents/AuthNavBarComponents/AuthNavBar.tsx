import {  useEffect, useRef, useState } from 'react';
import classes from './AuthNavBar.module.css'
import { IoClose, IoMenu } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import AuthSidebar from './AuthSidebar';
import { FaUserCircle } from "react-icons/fa";
import UserMenu from './UserMenu';
import useCurrUser from '../../../hooks/useCurrUser';
import DottedLoader from '../../Theme/Loaders/DottedLoader';
import logo from '../../../../pictures/Logo/LogoTransparent2.png';
import useNavSidebarAnim from '../../../hooks/useNavSidebarAnim';
import useAuth from '../../../hooks/useAuth';
import { AdminRoles } from '../../../context/AuthProvider';

function AuthNavBar() {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const { auth: { admin}} = useAuth();

    const { transition, hideSidebar, toggleSidebar,  showSidebar } = useNavSidebarAnim();
    const { pictureUrl, isFetching } = useCurrUser();

    function hideUserMenu() {
        setShowUserMenu(false);
    }

    useEffect(() => {
        function handleResize() {
            window.innerWidth >= 1000
            ? hideSidebar()
            : null;
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    // zatvara menu bar ako se klikne sa strane
    useEffect(() => {
        function handler(e : MouseEvent) {
            if(!menuRef.current?.contains(e.target as Node))
                setShowUserMenu(false);
        }

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        }
    });

    return (
        <header className={classes.header}>
            <nav className={`container ${classes.nav}`}>
                {!showSidebar ? 
                    <IoMenu onClick={toggleSidebar} className={classes.dropDown} size='2rem' /> :
                    <IoClose onClick={toggleSidebar} className={classes.dropDown} size='2rem' />
                }
                <Link to='/' onClick={hideSidebar} className={classes.logo}>
                    <img className={classes.logo} src={logo} alt="MajstorHUB" />
                </Link>
                <div className={classes.optionsContainer}>
                    {admin !== AdminRoles.Nedefinisano && (
                        <Link to='/admin-dashboard' onClick={hideSidebar} className='link'>Admin Dashboard</Link>
                    )}
                    <Link to='/dashboard' onClick={hideSidebar} className='link'>Dashboard</Link>
                    <Link to='/klijenti' onClick={hideSidebar} className='link'>Pretraži Klijente</Link>
                    <Link to='/majstori' onClick={hideSidebar} className='link'>Pretraži Majstore</Link>
                    <Link to='/firme' onClick={hideSidebar} className='link'>Pretraži Firme</Link>
                    <Link to='/oglasi' onClick={hideSidebar} className='link'>Pretraži Oglase</Link>
                    <div ref={menuRef} className={classes.iconContainer}>
                        {isFetching ? 
                            (<DottedLoader size='1.5rem' />) :
                            pictureUrl ? 
                            (<img src={pictureUrl} alt='userPicture' onClick={() => setShowUserMenu(!showUserMenu)} />) :
                            (<FaUserCircle onClick={() => setShowUserMenu(!showUserMenu)} className='iconButton' size='2rem' />)
                        }
                        
                        { showUserMenu && <UserMenu hideMenu={hideUserMenu} /> }
                    </div>
                </div>
            </nav>
            {transition((style, show) => {
                return show ? (
                    <AuthSidebar style={style} hideSidebar={hideSidebar} />
                ) : null;
            })}
        </header>
    )
}

export default AuthNavBar;