import classes from  './OglasCard.module.css';
import { createContext, useContext } from "react";
import { GetOglasDTO, getDuzinaPoslaDisplayName } from "../../../../api/DTO-s/Oglasi/OglasiDTO";
import { formatDate, formatDateBefore, getOglasUrl } from '../../../../lib/utils';
import { Link } from 'react-router-dom';
import { IoLocationOutline } from 'react-icons/io5';
import { Iskustvo, Struka, getStrukaDisplayName } from '../../../../api/DTO-s/responseTypes';
import InfoBox from '../../../Theme/Boxes/InfoBox';
import { FaCircleInfo } from 'react-icons/fa6';

type PropsValues = {
    oglasData: GetOglasDTO;
    currUserId: string;
}

type ContextType = {
    oglasData: GetOglasDTO;
    isOwner: boolean;
}

const CardContext = createContext<ContextType | null>(null);

export default function OglasCard({ currUserId, oglasData }: PropsValues) {
    const isOwner = oglasData.korisnikId === currUserId;

    return (
        <section className={classes.section} >
            <CardContext.Provider value={{oglasData, isOwner}}>
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
    const { oglasData: { lokacija } } = useContext(CardContext)!;
    return (
        <div className={`${classes.secRow} ${classes.row}`}>
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
            <p>Budžet: {cena} RSD - {Iskustvo[iskustvo]} - Procenjeno Vreme: {getDuzinaPoslaDisplayName(duzinaPosla)}</p>
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
    const { oglasData } = useContext(CardContext)!;

    return (
        <div className={`${classes.lastRow} ${classes.row}`}>
            <p>Broj prijava: <span>0</span></p>
        </div>
    )
}