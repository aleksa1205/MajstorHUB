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
                            <li className='link'>Home</li>
                            <li className='link'>Prijava</li>
                            <li className='link'>Registracija</li>
                        </ul>
                    </div>

                    <div>
                        <h3>Kontakt</h3>
                        <ul className={classes.contact}>
                            <li className='link'>Instagram</li>
                            <li className='link'>LinkedIn</li>
                            <li className='link'>+381 61 2345678</li>
                            <li className='link'>+381 18 1235647</li>
                        </ul>
                    </div>
                </div>

                <hr />
                <p>Copyright © MajstorHUB 2024 - Perić Aleksa 18000, Cvetković Jovan 18981</p>
            </div>
        </footer>
    );
}

export default Footer;