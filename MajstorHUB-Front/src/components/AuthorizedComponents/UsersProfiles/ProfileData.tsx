import UserType from "../../../lib/UserType";
import { KorisnikDataUpdate, FirmaDataUpdate, MajstorDataUpdate } from "../../../api/DTO-s/updateSelfTypes";
import classes from './ProfileData.module.css'
import { base64ToUrl } from "../../../lib/utils";
import { FaUserAlt } from "react-icons/fa";
import { IoLocationOutline, IoLink  } from "react-icons/io5";
import Tooltip from "../../Theme/Tooltip";
import { MdOutlineVerifiedUser } from "react-icons/md";
import EditButton from "../../Theme/EditButton";
import { Iskustvo, Struka } from "../../../api/DTO-s/responseTypes";
import { IoIosContact } from "react-icons/io";
import { MdConstruction } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";

type PropsValues = {
    userData : KorisnikDataUpdate | MajstorDataUpdate | FirmaDataUpdate
    isCurrUser: boolean;
}

function ProfileData({ userData, isCurrUser } : PropsValues) {
    
    return (
        <div className="container">
            <BasicInfoSection userData={userData} isCurrUser={isCurrUser} />
            <div className={classes.sectionContainer}>
                <UserSpecificDataSection userData={userData} isCurrUser={isCurrUser} />
                <div>
                    <Opis userData={userData} isCurrUser={isCurrUser} />
                    {userData.userType !== UserType.Korisnik && 
                        <Skills userData={userData} isCurrUser={isCurrUser} />
                    }
                    <Poslovi userData={userData} isCurrUser={isCurrUser} />
                </div>
            </div>
        </div>
    )
}

export default ProfileData;




type BasicInforProps = {
    userData: KorisnikDataUpdate | MajstorDataUpdate | FirmaDataUpdate;
    isCurrUser: boolean;
}

function BasicInfoSection({ userData, isCurrUser } : BasicInforProps ) {    
    return (
        <section className={classes.basicInfo}>
            <div className={classes.profileImage}>
                {userData.slika !== '' ?
                    <img src={base64ToUrl(userData.slika)} alt="slika_korisnika" /> :
                    <FaUserAlt size='5rem' />
                }
                {isCurrUser && (
                    <div className={classes.editImage}>
                        <EditButton />
                    </div>
                )}
            </div>

            <div className={classes.imePrezime}>
                <div className={classes.containerWithButton}>
                    {userData.userType === UserType.Firma ? 
                        <p className={classes.naziv}>{userData.naziv}</p> :
                        (<p className={classes.naziv}>{userData.ime} {userData.prezime}</p>)
                    }
                    {isCurrUser && <EditButton />}
                </div>
                
                <p className={`${classes.iconContainer} ${classes.userType}`}><MdOutlineVerifiedUser />{UserType[userData.userType]}</p>
                <div className={classes.containerWithButton}>
                    <p className={classes.iconContainer}><IoLocationOutline /> {userData.adresa}</p>
                    {isCurrUser && <EditButton />}
                </div>
            </div>

            {isCurrUser &&
            <div className={classes.settings}>
                <button className="mainButton">Podešavanja profila</button>
            </div>
            }

        </section>
    )
}

function UserSpecificDataSection({ userData, isCurrUser } : BasicInforProps) {
    return (
        <section className={classes.userSpecificSec}>

            {userData.userType !== UserType.Korisnik && (
                <div>
                    <h4 className={classes.heading}>
                        <MdConstruction size='2rem' />
                        Struka
                    </h4>
                    <div className={classes.containerWithButton}>
                        <p><span className={classes.bold}>Iskustvo: </span> {Iskustvo[userData.iskustvo]}</p>
                        {isCurrUser && <EditButton />}
                    </div>

                    <div className={classes.containerWithButton}>
                        <p><span className={classes.bold}>Cena po satu: </span> {userData.cenaPoSatu} din</p>
                        {isCurrUser && <EditButton />}
                    </div>
                </div>
            )}

            <div>
                <h4 className={classes.heading}>
                    <IoIosContact size='2rem' />
                    Kontakt
                </h4>
                <div className={classes.containerWithButton}>
                    <p><span className={classes.bold}>Email: </span> {userData.email}</p>
                    {isCurrUser && <EditButton />}
                </div>
                {isCurrUser && (
                    <div className={classes.containerWithButton}>
                        <div className={classes.textWithInfo}>
                            <span className={classes.bold}>Broj Telefona:</span>{' '}
                            {userData.brojTelefona}
                            <span className={classes.iconInline}>
                                <Tooltip infoText="Drugi korisnici ne mogu da vide ovo polje" width="250px">
                                    <IoInformationCircleOutline size='1rem' />
                                </Tooltip>
                            </span>
                        </div>
                        {isCurrUser && <EditButton />}
                    </div>
                )}
            </div>

            {userData.userType === UserType.Korisnik || userData.userType === UserType.Majstor && (
                <div>
                    <h4 className={classes.heading}>
                        <CiCalendar size='2rem' />
                        Datum Rođenja
                    </h4>
                    <div className={classes.containerWithButton}>
                        <p>
                            <span className={classes.bold}>
                                {userData.datumRodjenja.getDay()}.
                                {userData.datumRodjenja.getMonth()}.
                                {userData.datumRodjenja.getFullYear()}.
                            </span>
                        </p>
                        {isCurrUser && <EditButton />}
                    </div>
                </div>
            )}
        </section>
    )
}

function Opis({ userData, isCurrUser } : BasicInforProps) {
    function copyToClipboard() {
        alert("Link profila kopiran u clipboard");
        navigator.clipboard.writeText(window.location.href);
    }

    return (
        <section className={classes.opisSec}>
            <div className={classes.opisHeading}>
                <h3>
                    Opis
                </h3>
                <div>
                    {isCurrUser && <EditButton />}
                    <Tooltip width="150px" infoText="Kopiraj Link Profila">
                        <div onClick={copyToClipboard} className={classes.copyProfile}><IoLink size='1rem' /></div>
                    </Tooltip>
                </div>
            </div>
            {userData.opis}
        </section>
    )
}

function Skills({ userData, isCurrUser } : BasicInforProps) {

    let headingText = userData.userType === UserType.Majstor ? 'Vestina' : 'Vestine';

    return (
        <section className={classes.skillsSec}>
            <div className={classes.containerWithButton}>
                <h3>{headingText}</h3>
                {isCurrUser && <EditButton />}
            </div>
            {userData.userType === UserType.Majstor && (
                <div className={classes.vestine}>
                    <div className={classes.vestina}>
                        {Struka[userData.struka]}
                    </div>
                </div>
            )}

            {userData.userType === UserType.Firma && (
                <div className={classes.vestine}>
                    {userData.struke && 
                        userData.struke.map(el => {
                            return (
                            <div key={el} className={classes.vestina}>
                                {Struka[el]}
                            </div>)
                        })
                    }
                </div>
            )}
        </section>
    )
}

function Poslovi({ userData, isCurrUser } : BasicInforProps) {
    return (
        <section>
            <h3>Prethodni Poslovi</h3>
        </section>
    )
}