import classes from './RegisterOptions.module.css';
import { FaHandshake } from "react-icons/fa";
import { MdConstruction } from "react-icons/md";
import { Link } from 'react-router-dom';

function RegisterOptions() {
    return (
        <div className={classes.main}>
            <div className={`container ${classes.kontinjer}`}>
                <Link to='/register-izvodjac' className={classes.option}>
                    <h3 className={classes.naslov}> <MdConstruction size='3rem' />Registrujte se kao Izvođač Radova</h3>
                    <p>Pridružite se našoj platformi kao izvođač radova i pronađite nove poslove u građevinskoj industriji. Predstavite svoje veštine i iskustvo, povežite se sa potencijalnim klijentima i izgradite uspešnu karijeru u građevinarstvu.</p>
                </Link>
                <Link to='/register-korisnik' className={classes.option}>
                    <h3  className={classes.naslov}> <FaHandshake size='3rem' />Registrujte se kao Klijent</h3>
                    <p>Kao klijent naše platforme, pružamo vam mogućnost da pronađete kvalifikovane izvođače radova za svoje građevinske projekte. Registrujte se i postavite svoje zahteve, pregledajte profile izvođača i pronađite savršenog partnera za ostvarenje vaših građevinskih ciljeva.</p>
                </Link>
            </div>
        </div>
    );
}

export default RegisterOptions;