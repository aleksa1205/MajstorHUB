import UserType from "../../../lib/UserType";
import { KorisnikDataUpdate, FirmaDataUpdate, MajstorDataUpdate, userDataUpdateType } from "../../../api/DTO-s/updateSelfTypes";
import classes from './ProfileData.module.css'
import { base64ToUrl, formatDate } from "../../../lib/utils";
import { FaUserAlt } from "react-icons/fa";
import { IoLocationOutline, IoLink  } from "react-icons/io5";
import Tooltip from "../../Theme/Tooltip";
import { MdOutlineVerifiedUser } from "react-icons/md";
import EditButton from "../../Theme/Buttons/EditButton";
import { Iskustvo, Struka } from "../../../api/DTO-s/responseTypes";
import { IoIosContact } from "react-icons/io";
import { MdConstruction } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import EditUserForm from "./EditUserForm";
import { createContext, useContext, useState } from "react";

type PropsValues = {
    userData : KorisnikDataUpdate | MajstorDataUpdate | FirmaDataUpdate
    setUserData : React.Dispatch<React.SetStateAction<userDataUpdateType | null>>;
    isCurrUser: boolean;
}

type ContextValues = {
    userData: KorisnikDataUpdate | MajstorDataUpdate | FirmaDataUpdate;
    isCurrUser: boolean;
    setHeading: React.Dispatch<React.SetStateAction<string>>;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    setFieldName: React.Dispatch<React.SetStateAction<keyof KorisnikDataUpdate | keyof MajstorDataUpdate | keyof FirmaDataUpdate>>
    openModal: () => void;
}

const SectionContext = createContext<ContextValues | null>(null);

function ProfileData({ userData, isCurrUser, setUserData } : PropsValues) {
    const [showModal, setShowModal] = useState(false);

    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [fieldName, setFieldName] = useState<keyof KorisnikDataUpdate | keyof MajstorDataUpdate | keyof FirmaDataUpdate>('ime');

    const defaultValues : ContextValues = {
        isCurrUser: isCurrUser,
        openModal: openModal,
        setDescription: setDescription,
        setFieldName: setFieldName,
        setHeading: setHeading,
        userData: userData
    } 

    function closeModal() {
        setShowModal(false);
    }

    function openModal() {
        setShowModal(true);
    }
    
    return (
        <>
            {showModal && (
                <EditUserForm userData={userData} setUserData={setUserData} description={description} heading={heading} fieldName={fieldName} closeModal={closeModal} />
            )}

            <div className="container">
                <SectionContext.Provider value={defaultValues}>
                    <BasicInfoSection/>
                    <div className={classes.sectionContainer}>
                        <UserSpecificDataSection />
                        <div>
                            <Opis />
                            {userData.userType !== UserType.Korisnik && 
                                <Skills />
                            }
                            {/* <Poslovi userData={userData} isCurrUser={isCurrUser} /> */}
                        </div>
                    </div>
                </SectionContext.Provider>
            </div>
        </>
    )
}

export default ProfileData;





function BasicInfoSection() {

    const { isCurrUser, openModal, setDescription, setFieldName, setHeading, userData } = useContext(SectionContext)!;

    function slikaHandler() {
        setDescription("Promenite sliku na profilu");
        setFieldName("slika");
        setHeading("Promenite sliku");

        openModal();
    }

    function imePrezimeHandler() {
        setDescription("Promenite vase ime i prezime");
        setFieldName("ime");
        setHeading("Promenite ime i prezime");

        openModal();
    }

    function adresaHandler() {
        setDescription("Promenite adresu");
        setFieldName("adresa");
        setHeading("Promenite adresu");

        openModal();
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
                        <EditButton onClick={slikaHandler} />
                    </div>
                )}
            </div>

            <div className={classes.imePrezime}>
                <div className={classes.containerWithButton}>
                    {userData.userType === UserType.Firma ? 
                        <p className={classes.naziv}>{userData.naziv}</p> :
                        (<p className={classes.naziv}>{userData.ime} {userData.prezime}</p>)
                    }
                    {isCurrUser && <EditButton onClick={imePrezimeHandler} />}
                </div>
                
                <p className={`${classes.iconContainer} ${classes.userType}`}><MdOutlineVerifiedUser />{UserType[userData.userType]}</p>
                <div className={classes.containerWithButton}>
                    <p className={classes.iconContainer}><IoLocationOutline /> {userData.adresa}</p>
                    {isCurrUser && <EditButton onClick={adresaHandler} />}
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

function UserSpecificDataSection() {

    const { isCurrUser, openModal, setDescription, setFieldName, setHeading, userData } = useContext(SectionContext)!;

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

            {(userData.userType === UserType.Korisnik || userData.userType === UserType.Majstor) && (
                <div>
                    <h4 className={classes.heading}>
                        <CiCalendar size='2rem' />
                        Datum Rođenja
                    </h4>
                    <div className={classes.containerWithButton}>
                        <p>
                            <span className={classes.bold}>
                                {formatDate(userData.datumRodjenja)}
                            </span>
                        </p>
                        {isCurrUser && <EditButton />}
                    </div>
                </div>
            )}
        </section>
    )
}

function Opis() {

    const { isCurrUser, openModal, setDescription, setFieldName, setHeading, userData } = useContext(SectionContext)!;

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

function Skills() {

    const { isCurrUser, openModal, setDescription, setFieldName, setHeading, userData } = useContext(SectionContext)!;

    let headingText = userData.userType === UserType.Majstor ? 'Veština' : 'Veštine';

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

// function Poslovi({ userData, isCurrUser } : BasicInforProps) {
//     return (
//         <section>
//             <h3>Prethodni Poslovi</h3>
//         </section>
//     )
// }