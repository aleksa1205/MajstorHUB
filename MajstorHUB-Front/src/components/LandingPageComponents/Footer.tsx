import classes from './Footer.module.css'

function Footer() {
    return (
        <footer>
            <ul>
                <li>Home</li>
                <li>Prijava</li>
                <li>Registracija</li>
            </ul>
            <ul className={classes.contact}>
                <li>Instagram</li>
                <li>LinkedIn</li>
                <li>+381 61 2345678</li>
                <li>+381 18 1235647</li>
            </ul>
        </footer>
    );
}

export default Footer;