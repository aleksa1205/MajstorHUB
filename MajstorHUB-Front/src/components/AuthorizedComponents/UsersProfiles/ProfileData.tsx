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

type PropsValues = {
    userData : KorisnikDataUpdate | MajstorDataUpdate | FirmaDataUpdate
    isCurrUser: boolean;
}

function ProfileData({ userData, isCurrUser } : PropsValues) {
    
    return (
        <>
            <BasicInfoSection userData={userData} isCurrUser={isCurrUser} />
            <UserSpecificDataSection userData={userData} isCurrUser={isCurrUser} />
        </>
    )
}

export default ProfileData;




type BasicInforProps = {
    userData: KorisnikDataUpdate | MajstorDataUpdate | FirmaDataUpdate;
    isCurrUser: boolean;
}

function BasicInfoSection({ userData, isCurrUser } : BasicInforProps ) {    
    function copyToClipboard() {
        alert("Link profila kopiran u clipboard");
        navigator.clipboard.writeText(window.location.href);
    }
    
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
            <div>
                {userData.userType === UserType.Firma ? 
                    <p className={classes.naziv}>{userData.naziv}</p> :
                    (<p className={classes.naziv}>{userData.ime} {userData.prezime}</p>)
                }
                
                <p className={classes.iconContainer}><MdOutlineVerifiedUser />{UserType[userData.userType]}</p>
                <p className={classes.iconContainer}><IoLocationOutline /> {userData.adresa}</p>
            </div>

            <div className={classes.copyProfileContainer}>
                <Tooltip width="150px" infoText="Kopiraj Link Profila">
                    <div onClick={copyToClipboard} className={classes.copyProfile}><IoLink /></div>
                </Tooltip>
            </div>
        </section>
    )
}

function UserSpecificDataSection({ userData, isCurrUser } : BasicInforProps) {
    return (
        <section>

            {userData.userType !== UserType.Korisnik && (
                <div>
                    <h4>Struka</h4>
                    {userData.userType === UserType.Majstor && 
                    <div className={classes.containerWithButton}>
                        <p>{Struka[userData.struka]}</p>
                        {isCurrUser && <EditButton />}
                    </div>
                    }
                    <div className={classes.containerWithButton}>
                        <p>Iskustvo: {Iskustvo[userData.iskustvo]}</p>
                        {isCurrUser && <EditButton />}
                    </div>

                    <div className={classes.containerWithButton}>
                        <p>Cena Po Satu: {userData.cenaPoSatu} din</p>
                        {isCurrUser && <EditButton />}
                    </div>
                </div>
            )}

            <div>
                <h4>Kontakt</h4>
                <div className={classes.containerWithButton}>
                    <p>{userData.email}</p>
                    {isCurrUser && <EditButton />}
                </div>
                <div className={classes.containerWithButton}>
                    <p>{userData.brojTelefona}</p>
                    {isCurrUser && <EditButton />}
                </div>
            </div>

            {userData.userType === UserType.Korisnik || userData.userType === UserType.Majstor && (
                <div>
                    <h4>Datum Rođenja</h4>
                    <div className={classes.containerWithButton}>
                        <p>
                            {userData.datumRodjenja.getDay()}.
                            {userData.datumRodjenja.getMonth()}.
                            {userData.datumRodjenja.getFullYear()}.
                        </p>
                        {isCurrUser && <EditButton />}
                    </div>
                </div>
            )}
        </section>
    )
}