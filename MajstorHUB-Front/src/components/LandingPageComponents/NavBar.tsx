import classes from './NavBar.module.css';

function NavBar() {
    return (
        <header>
            <nav className='mainContainer'>
                <p className={classes.dropDown}>Drop Down</p>
                <p className={classes.logo}>MajstorHUB</p>
                <div className={classes.optionsContainer}>
                    <span>
                        <p className="link">Pronađi Posao</p>
                        <p className="link">Pronađi Izvodjače</p>
                    </span>
                    <p className="link">Uloguj se</p>
                    <button className="mainButton">Registruj se</button>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;