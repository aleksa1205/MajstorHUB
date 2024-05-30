import { createContext, useContext } from 'react';
import { GetFirmaResponse, GetMajstorResponse, Iskustvo, Struka, getStrukaDisplayName, userDataType } from '../../../api/DTO-s/responseTypes';
import classes from './UserCard.module.css'
import { base64ToUrl, formatDouble, getProfileUrl } from '../../../lib/utils';
import {  FaUserCircle } from 'react-icons/fa';
import UserType from '../../../lib/UserType';
import { Link } from 'react-router-dom';
import { IoLocationOutline } from 'react-icons/io5';
import { GiRank1, GiRank2, GiRank3 } from "react-icons/gi";

type PropsValues = {
    userData: userDataType;
    currUserId: string;
}

type ContextType = {
    userData: userDataType;

}
const CardContext = createContext<ContextType | null>(null);

function UserCard({ userData, currUserId }: PropsValues) {
    const isCurrUser = userData.id === currUserId;

    const styles : React.CSSProperties = {
        backgroundColor: '#efded3',
    }

    return (
        <section 
            className={classes.section}
            style={isCurrUser ? styles : {}}
        >
            <CardContext.Provider value={{userData}}>
                <Link to={getProfileUrl(userData.userType, userData.id)} >
                    <FirstRow />
                    <SecondRow />
                    <IskustvoRow />
                    {userData.userType === UserType.Majstor && <StrukaRow />}
                    {userData.userType === UserType.Firma && <StrukeRow />}
                    <OpisRow />
                </Link>
            </CardContext.Provider>
        </section>
    )
}

export default UserCard;

function FirstRow() {
    const { userData } = useContext(CardContext)!;

    return (
        <div className={`${classes.firstRow} ${classes.row}`}>
            {userData.slika ? (
                <img src={base64ToUrl(userData.slika)} alt="User Image" />
            ) : (
                <FaUserCircle size='4rem' />
            )}
            <div>
                {userData.userType !== UserType.Firma && (
                    <p>{userData.ime} {userData.prezime}</p>
                )}

                {userData.userType === UserType.Firma && (
                    <p>{userData.naziv}</p>
                )}

                {userData.adresa && (
                    <div className={classes.iconContainer}>
                        <IoLocationOutline />
                        <p>{userData.adresa}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function SecondRow() {
    const { userData } = useContext(CardContext)!;



    return (
        <div className={`${classes.secRow} ${classes.row}`}>
            {userData.userType === UserType.Korisnik && (
                <p>{formatDouble(userData.potroseno, 'potrošeno')}</p>
            )}

            {userData.userType !== UserType.Korisnik && (
                <>
                    {userData.cenaPoSatu ? (
                        <p>{Math.floor(userData.cenaPoSatu)} din cena/sat</p>
                    ) : <></>}
                    <p>{formatDouble(userData.zaradjeno, 'zarađeno')}</p>
                </>
            )}
        </div>
    )
}


function IskustvoRow() {
    const { userData } = useContext(CardContext)!;

    let icon;
    if(userData.userType !== UserType.Korisnik) {
        if(userData.iskustvo === Iskustvo.Nedefinisano)
            icon = <></>;
        else if(userData.iskustvo === Iskustvo.Pocetnik)
            icon = <GiRank1 size='1.5rem' />
        else if(userData.iskustvo === Iskustvo.Iskusan)
            icon = <GiRank2 size='1.5rem' />
        else
            icon = <GiRank3 size='1.5rem' />
    }

    if (userData.userType !== UserType.Korisnik && userData.iskustvo !== Iskustvo.Nedefinisano) {
        return (
            <div className={`${classes.iskustvoRow} ${classes.row}`}>
                {icon}
                <p>{Iskustvo[userData.iskustvo]}</p>
            </div>
        )
    }
    else return <></>;
}

function StrukaRow() {
    const { userData : data } = useContext(CardContext)!;

    let userData = data as GetMajstorResponse;

    return (
        <div className={`${classes.strukeRow} ${classes.row}`}>
            <div>{getStrukaDisplayName(userData.struka)}</div>
        </div>
    );
}

function StrukeRow() {
    const { userData: data } = useContext(CardContext)!;
    const userData = data as GetFirmaResponse;

    const maxVisibleItems = 7;
    const struke = userData.struke.filter(struka => struka !== Struka.Nedefinisano);
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

function OpisRow() {
    const { userData } = useContext(CardContext)!;

    return (
        <div className={`${classes.opisRow} ${classes.row}`}>
            <p>{userData.opis}</p>
        </div>
    )
}