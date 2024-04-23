import classes from './NavBar.module.css';

function NavBar() {
    return (
        <header>
            <nav className='container'>
                <p className={classes.dropDown}>Drop Down</p>
                <p className={classes.logo}>MajstorHUB</p>
                <div className={classes.optionsContainer}>
                    <span>
                        <p className="link">Pronađi Posao</p>
                        <p className="link">Pronađi Izvodjače</p>
                    </span>
                    <button className={`secondaryButton ${classes.loginButton}`}>Uloguj se</button>
                    <button className="mainButton">Registruj se</button>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;