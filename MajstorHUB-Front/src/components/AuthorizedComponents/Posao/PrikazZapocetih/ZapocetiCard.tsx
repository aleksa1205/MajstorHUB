import { Link } from "react-router-dom";
import { GetByZapocetiDTO } from "../../../../api/DTO-s/Posao/PosloviDTO";
import useAuth from "../../../../hooks/useAuth";
import UserType from "../../../../lib/UserType";
import { formatDate, formatDoubleWithWhite, getProfileUrl } from "../../../../lib/utils";
import classes from './Zapoceti.module.css';
import BrickLaying from '../../../../../pictures/animations/suitCase.json';
import Lottie from "react-lottie";
import InfoMessage from "../../../Theme/Messages/InfoMessage";
import { useEffect, useState } from "react";
import InfoBox from "../../../Theme/Boxes/InfoBox";

type PropsTypes = {
    posao: GetByZapocetiDTO;
    openZavrsi(posao: GetByZapocetiDTO): void;
}

export default function ZapocetiCard({ posao, openZavrsi }: PropsTypes) {
    const { naslov, pocetakRadova, zavrsetakRadova, cena, izvodjacNaziv, korisnikNaziv, izvodjac, korisnik, tipIzvodjaca, oglas, recenzije } = posao;
    const { auth: { userType }} = useAuth();
    
    const animOptions = {
        loop: true,
        autoplay: true,
        animationData: BrickLaying,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    }
    
    const [message, setMessage] = useState<string>('');
    const [showButton, setShowButton] = useState<boolean>(true);
    useEffect(() => {
        if (userType === UserType.Korisnik && recenzije.recenzijaIzvodjaca !== null) {
            setMessage("Izvođač je završio posao, završite ga i vi.");
        } else if (userType === UserType.Korisnik && recenzije.recenzijaKorisnika !== null) {
            setMessage("Sačekajte da izvođač vama ostavi recenziju kako bi se posao završio.");
            setShowButton(false);
        } else if (userType !== UserType.Korisnik && recenzije.recenzijaKorisnika !== null) {
            setMessage("Klijent je završio posao, završite ga i vi.");
        } else if (userType !== UserType.Korisnik && recenzije.recenzijaIzvodjaca !== null) {
            setMessage("Sačekajte da klijent vama ostavi recenziju kako bi se posao završio.");
            setShowButton(false);
        } else if (new Date(zavrsetakRadova) < new Date()) {
            setMessage("Posao je završen. Ostavite recenziju kako biste završili posao do kraja.");
        }
    }, []);

    return (
        <section className={classes.card}>
            <div>
            {message && (
                <InfoMessage text={message} />
            )}
                <Lottie options={animOptions} width='4rem' height='4rem' />
                <h4>
                    <Link className="secondLink" to={`/oglasi/${oglas}`}>
                            {naslov}
                    </Link>
                </h4>
                <p className={classes.date}>{formatDate(pocetakRadova)} - {formatDate(zavrsetakRadova)}</p>
            </div>
            <div>
                {formatDoubleWithWhite(cena)} RSD - {' '}
                {userType === UserType.Korisnik && (
                    <Link className="secondLink" to={getProfileUrl(tipIzvodjaca, izvodjac)}>
                        {izvodjacNaziv}
                    </Link>
                )}
                {(userType === UserType.Majstor || userType === UserType.Firma) && (
                    <Link className="secondLink" to={getProfileUrl(UserType.Korisnik, korisnik)}>
                        {korisnikNaziv}
                    </Link>
                )}
            </div>
            {showButton && (
                <button onClick={() => openZavrsi(posao)} className="mainButtonSmall">Završi posao</button>
            )}
        </section>
    )
}