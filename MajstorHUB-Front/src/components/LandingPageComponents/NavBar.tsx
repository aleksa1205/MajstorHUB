import classes from './NavBar.module.css';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <header>
            <nav className='container'>
                <p className={classes.dropDown}>Drop Down</p>
                <Link to='/' className={classes.logo}>MajstorHUB</Link>
                <div className={classes.optionsContainer}>
                    <span>
                        <Link to='/login' className="link">Pronađi Posao</Link>
                        <Link to='/login' className="link">Pronađi Izvodjače</Link>
                    </span>
                    <Link to='/login' className={`secondaryButton ${classes.loginButton}`}>Uloguj se</Link>
                    <Link to='/register' className="mainButton">Registruj se</Link>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;