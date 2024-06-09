import { GetZavrseniPosloviDTO } from "../../../../api/DTO-s/Posao/PosloviDTO"
import ModalAnimated from "../../../Theme/Modal/ModalAnimated"
import frClasses from "../../../FormStyles/Form.module.css";
import { IoClose } from "react-icons/io5";
import classes from "./Zavrseni.module.css";
import { Rating } from "@mui/material";
import ShowMore from "../../../Theme/ShowMoreContainer/ShowMore";
import { formatDoubleWithWhite, getProfileUrl } from "../../../../lib/utils";
import { Link } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import UserType from "../../../../lib/UserType";

type PropsValues = {
    posao: GetZavrseniPosloviDTO;
    style: any;
    close: () => void;
}

export default function ZavsenPopUp({ posao, close, style }: PropsValues) {
    const { oglas, korisnik, izvodjac, detaljiPosla: { naslov, cena, opis }, recenzije: { recenzijaIzvodjaca, recenzijaKorisnika} } = posao;
    const { auth } = useAuth();

    return (
        <ModalAnimated onClose={close} style={style}>
            <div className={`${frClasses.form} ${classes.form}`}>
                <section>
                    <div className={frClasses.header}>
                        <h3>{naslov}</h3>
                        <IoClose onClick={close} size='2rem' />
                    </div>
                </section>

                <section style={{overflowY: 'scroll', height: window.innerWidth < 1000 ? '60vh' : '600px'}} className={classes.scroll}>
                    <h4>
                        Recenzije
                    </h4>
                    <div className={classes.recenzija}>
                        <p>Ocena izvođača</p>
                        <div>
                            <Rating
                                name="ocena"
                                size="medium"
                                readOnly={true}
                                precision={0.5}
                                value={recenzijaIzvodjaca.ocena}
                                sx={{ gap: '0' }}
                            />
                            <p>{recenzijaIzvodjaca.ocena}</p>
                        </div>
                        <ShowMore text={recenzijaIzvodjaca.opisRecenzije} />
                    </div>

                    <div className={classes.recenzija}>
                        <p>Ocena klijenta</p>
                        <div>
                            <Rating
                                name="ocena"
                                size="medium"
                                readOnly={true}
                                precision={0.5}
                                value={recenzijaKorisnika.ocena}
                                sx={{ gap: '0' }}
                            />
                            <p>{recenzijaKorisnika.ocena}</p>
                        </div>
                        <ShowMore text={recenzijaKorisnika.opisRecenzije} />
                    </div>

                    <h4>Informacije o poslu</h4>
                    <p className={classes.kaoHeading}>
                        Opis posla
                    </p>
                    <ShowMore text={opis} />
                    <p className={classes.kaoHeading}>Cena Posla</p>
                    <p>{formatDoubleWithWhite(cena)} RSD</p>

                    <Link className="secondLink" to={`/oglasi/${oglas}`}>Pogledajte ceo oglas</Link>
                    
                    <h4>Informacije o izvođaču</h4>
                    <Link className="secondLink" to={getProfileUrl(izvodjac.tipIzvodjaca, izvodjac.izvodjacId)}>Pogledajte profil izvođača</Link>
                    
                    <h4>Informacije o klijentu</h4>
                    <Link className="secondLink" to={getProfileUrl(UserType.Korisnik, korisnik)}>Pogledajte profil klijenta</Link>
                </section>

                <section>
                    <div className={frClasses.btnContainer}>
                        <button onClick={close} className='mainButtonSmall'>
                            Zatvori
                        </button>
                    </div>
                </section>
            </div>
        </ModalAnimated>
    )
}