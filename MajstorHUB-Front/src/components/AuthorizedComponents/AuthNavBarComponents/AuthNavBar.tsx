import { useEffect, useRef, useState } from 'react';
import classes from './AuthNavBar.module.css'
import { IoClose, IoMenu } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import AuthSidebar from './AuthSidebar';
import { FaUserCircle } from "react-icons/fa";
import UserMenu from './UserMenu';
import useUserControllerAuth from '../../../api/controllers/useUserControllerAuth';
import useAuth from '../../../hooks/useAuth';
import { useErrorBoundary } from 'react-error-boundary';
import { base64ToUrl } from '../../../lib/utils';

function AuthNavBar() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [pictureUrl, setPictureUrl] = useState<string>('');
    const menuRef = useRef<HTMLDivElement>(null);

    const { auth } = useAuth();
    const { getById }  = useUserControllerAuth(auth.userType);
    const { showBoundary } = useErrorBoundary()

    useEffect(() => {
        let ignore = false;

        async function startFetching() {
            try {
                const data = await getById(auth.userId);
                if(data === false) console.error('invalid user id sent');
                else if(typeof data.slika !== 'undefined' && !ignore) {
                    setPictureUrl(base64ToUrl(data.slika));
                }
                
            } catch (error) {
                showBoundary(error);
            }
        }

        if(pictureUrl === '') {
            startFetching();
        } 

        return () => {
            ignore = true;
        };
    }, [pictureUrl]);

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
    })

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
                        {pictureUrl !== '' ? 
                            (<img src={pictureUrl} alt='userPicture' onClick={() => setShowUserMenu(!showUserMenu)} />) : 
                            (<FaUserCircle onClick={() => setShowUserMenu(!showUserMenu)} className='iconButton' size='2rem' />)
                        }
                        
                        {showUserMenu && <UserMenu pictureUrl={pictureUrl} />}
                    </div>
                </div>
            </nav>
            { showSidebar && <AuthSidebar hideSidebar={hideSidebar} pictureUrl={pictureUrl} /> }
        </header>
    )
}

export default AuthNavBar;