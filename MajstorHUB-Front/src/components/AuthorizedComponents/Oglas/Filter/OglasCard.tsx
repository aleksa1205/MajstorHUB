import classes from  './OglasCard.module.css';
import { createContext, useContext, useEffect, useState } from "react";
import { GetOglasDTO, getDuzinaPoslaDisplayName } from "../../../../api/DTO-s/Oglasi/OglasiDTO";
import { formatDateBefore, formatDouble, formatDoubleWithWhite, getOglasUrl } from '../../../../lib/utils';
import { Link } from 'react-router-dom';
import { IoLocationOutline } from 'react-icons/io5';
import { Iskustvo, Struka, getStrukaDisplayName } from '../../../../api/DTO-s/responseTypes';
import { FaCircleInfo } from 'react-icons/fa6';
import useAuth from '../../../../hooks/useAuth';
import UserType from '../../../../lib/UserType';
import { Rating } from '@mui/material';

type PropsValues = {
    oglasData: GetOglasDTO;
    currUserId: string;
    userOglasi: string[];
}

type ContextType = {
    oglasData: GetOglasDTO;
    isOwner: boolean;
    isPrijavljen: boolean;
}

const CardContext = createContext<ContextType | null>(null);

export default function OglasCard({ currUserId, oglasData, userOglasi }: PropsValues) {
    const isOwner = oglasData.korisnikId === currUserId;
    const [isPrijavljen, setIsPrijavljen] = useState<boolean>(userOglasi.includes(oglasData.id));
    useEffect(() => {
        setIsPrijavljen(userOglasi.includes(oglasData.id));
    }, [userOglasi]);

    const { auth: { userType } } = useAuth();

    return (
        <section className={classes.section} >
            <CardContext.Provider value={{oglasData, isOwner, isPrijavljen}}>
                <Link to={getOglasUrl(oglasData.id)}>
                    <FirstRow />
                    <SecondRow />
                    <ThirdRow />
                    <OpisRow />
                    <StrukeRow />
                    <LastRow />
                    {isOwner && (
                        <div className={classes.owner}>
                            <FaCircleInfo />
                            <p>Ovo je vaš oglas</p>
                        </div>
                    )}
                    {(isPrijavljen && userType !== UserType.Korisnik) && (
                        <div className={classes.owner}>
                            <FaCircleInfo />
                            <p>Prijavljeni ste na ovaj oglas</p>
                        </div>
                    )}
                </Link>
            </CardContext.Provider>
        </section>
    );
}

function FirstRow() {
    const { oglasData: { naslov, datumKreiranja } } = useContext(CardContext)!;
    return (
        <div className={`${classes.firstRow} ${classes.row}`}>
            <p>Postavljeno {formatDateBefore(datumKreiranja)}</p>
            <h4>{naslov}</h4>
        </div>
    )
}

function SecondRow() {
    const { oglasData: { lokacija, ime, prezime, potroseno, ocena } } = useContext(CardContext)!;
    return (
        <div className={`${classes.secRow} ${classes.row}`}>
            <Rating
                name="ocena"
                size="small"
                precision={0.2}
                value={ocena}
                readOnly={true}
                sx={{ gap: '0'}}
            />
            <p>{ime} {prezime}</p>
            <p>{formatDouble(potroseno, 'potrošeno')}</p>
            {lokacija && (
                <div className={classes.iconContainer}>
                    <IoLocationOutline />
                    <p>{lokacija}</p>
                </div>
            )}
        </div>
    )
}

function ThirdRow() {
    const { oglasData: { cena, iskustvo, duzinaPosla } } = useContext(CardContext)!;

    return (
        <div className={`${classes.thirdRow} ${classes.row}`}>
            <p>Budžet: {formatDoubleWithWhite(cena)} RSD - {Iskustvo[iskustvo]} - Procenjeno Vreme: {getDuzinaPoslaDisplayName(duzinaPosla)}</p>
        </div>
    )
}

function OpisRow() {
    const { oglasData: { opis } } = useContext(CardContext)!;

    return (
        <div className={`${classes.opisRow} ${classes.row}`}>
            <p>{opis}</p>
        </div>
    )
}

function StrukeRow() {
    const { oglasData: {struke: oglasStruke} } = useContext(CardContext)!;

    const maxVisibleItems = 7;
    const struke = oglasStruke.filter(struka => struka !== Struka.Nedefinisano);
    const visibleStruke = struke.slice(0, maxVisibleItems - 1);
    const remainingCount = struke.length - visibleStruke.length;

    return (
        <div className={`${classes.strukeRow} ${classes.row}`}>
            {visibleStruke.map(struka => (
                <div key={struka} className={classes.struka}>
                    {getStrukaDisplayName(struka)}
                </div>
            ))}
            {remainingCount > 0 && (
                <div className={classes.remainingCount}>+{remainingCount}</div>
            )}
        </div>
    );
}

function LastRow() {
    const { oglasData: { brojPrijava } } = useContext(CardContext)!;

    return (
        <div className={`${classes.lastRow} ${classes.row}`}>
            <p>Broj prijava: <span>{brojPrijava}</span></p>
        </div>
    )
}