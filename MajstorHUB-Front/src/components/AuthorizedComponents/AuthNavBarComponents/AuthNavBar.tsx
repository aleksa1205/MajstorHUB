import {  useEffect, useRef, useState } from 'react';
import classes from './AuthNavBar.module.css'
import { IoClose, IoMenu } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import AuthSidebar from './AuthSidebar';
import { FaUserCircle } from "react-icons/fa";
import UserMenu from './UserMenu';
import useCurrUser from '../../../hooks/useCurrUser';
import DottedLoader from '../../Loaders/DottedLoader';

function AuthNavBar() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const { pictureUrl, isFetching } = useCurrUser();

    function hideSidebar() {
        setShowSidebar(false);
    }

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
                    <IoMenu onClick={() => setShowSidebar(!showSidebar)} className={classes.dropDown} size='2rem' /> :
                    <IoClose  onClick={() => setShowSidebar(!showSidebar)} className={classes.dropDown} size='2rem' />
                }
                <Link to='/' onClick={hideSidebar} className={classes.logo}>MajstorHUB</Link>
                <div className={classes.optionsContainer}>
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
                        
                        { showUserMenu && <UserMenu /> }
                    </div>
                </div>
            </nav>
            { showSidebar && <AuthSidebar hideSidebar={hideSidebar} /> }
        </header>
    )
}

export default AuthNavBar;