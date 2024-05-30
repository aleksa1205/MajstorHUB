import classes from './Footer.module.css'

function Footer() {
    return (
        <footer>
            <div className='container'>
                <div className={classes.kontinjer}>
                    <div>
                        <h3 className={classes.logo}>MajstorHUB</h3>
                        <ul>
                            <li>Sa nama ste sigurni</li>
                        </ul>
                    </div>

                    <div>
                        <h3>Navigacija</h3>
                        <ul> 
                            <li className='linkLight'>Home</li>
                            <li className='linkLight'>Prijava</li>
                            <li className='linkLight'>Registracija</li>
                        </ul>
                    </div>

                    <div>
                        <h3>Kontakt</h3>
                        <ul className={classes.contact}>
                            <li className='linkLight'>Instagram</li>
                            <li className='linkLight'>LinkedIn</li>
                            <li className='linkLight'>+381 61 2345678</li>
                            <li className='linkLight'>+381 18 1235647</li>
                        </ul>
                    </div>
                </div>

                <hr />
                <p>Copyright © MajstorHUB 2024 - Perić Aleksa 18826, Cvetković Jovan 18981</p>
            </div>
        </footer>
    );
}

export default Footer;