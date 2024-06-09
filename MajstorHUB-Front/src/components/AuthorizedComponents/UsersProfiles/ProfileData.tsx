import UserType from "../../../lib/UserType";
import { KorisnikDataUpdate, FirmaDataUpdate, MajstorDataUpdate, userDataUpdateType } from "../../../api/DTO-s/updateSelfTypes";
import classes from './ProfileData.module.css'
import { base64ToUrl, formatDate, formatDouble, formatDoubleWithWhite } from "../../../lib/utils";
import { FaUserAlt } from "react-icons/fa";
import { IoLocationOutline, IoLink  } from "react-icons/io5";
import Tooltip from "../../Theme/Tooltip";
import { MdOutlineVerifiedUser } from "react-icons/md";
import EditButton from "../../Theme/Buttons/EditButton";
import { GetFirmaResponse, Iskustvo, getStrukaDisplayName, userDataType } from "../../../api/DTO-s/responseTypes";
import { IoIosContact } from "react-icons/io";
import { MdConstruction } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import { createContext, useContext, useEffect, useState } from "react";
import EditUserFormContext, { EditUserFormType } from "./EditUserForms/EditUserFormContext"
import { FaEuroSign } from "react-icons/fa";
import AddButton from "../../Theme/Buttons/AddButton";
import useUserControllerAuth, { SessionEndedError } from "../../../api/controllers/useUserControllerAuth";
import InfoBox from "../../Theme/Boxes/InfoBox";
import useLogout from "../../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";
import SuccessBox from "../../Theme/Boxes/SuccessBox";
import useCurrUser from "../../../hooks/useCurrUser";
import useModalAnimation from "../../../hooks/useModalAnimation";
import { Link } from "react-router-dom";
import { requiresRole } from "../../../api/RequiresRole";
import ShowMore from "../../Theme/ShowMoreContainer/ShowMore";
import ZavrseniPoslovi from "../Posao/PrikazZavrsenih/ZavrseniPoslovi";
import { Rating } from "@mui/material";
import ZavsenPopUp from "../Posao/PrikazZavrsenih/ZavrsenPopUp";
import { GetZavrseniPosloviDTO } from "../../../api/DTO-s/Posao/PosloviDTO";
import useAuth from "../../../hooks/useAuth";
import { AdminRoles } from "../../../context/AuthProvider";
import useAdminController from "../../../api/controllers/useAdminController";
import usePopUpMessage from "../../../hooks/usePopUpMessage";
import ConfirmBan from "./EditUserForms/ConfirmBan";
import { NotFoundError } from "../../../api/controllers/usePosaoController";

type PropsValues = {
    userData : KorisnikDataUpdate | MajstorDataUpdate | FirmaDataUpdate;
    userDataPriv: userDataType;
    setUserData : React.Dispatch<React.SetStateAction<userDataUpdateType | null>>;
    isCurrUser: boolean;
    success: boolean;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>
}

type ContextValues = {
    userData: KorisnikDataUpdate | MajstorDataUpdate | FirmaDataUpdate;
    userDataPriv: userDataType;
    isCurrUser: boolean;
    openModal: () => void;
    setFormSelected: React.Dispatch<React.SetStateAction<EditUserFormType>>
}

const SectionContext = createContext<ContextValues | null>(null);

function ProfileData({ userData, isCurrUser, setUserData, userDataPriv, setSuccess, success } : PropsValues) {
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const [initialUserData, _] = useState<userDataUpdateType>(userData);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [firstRun, setFirstRun] = useState<boolean>(true);
    const logoutUser = useLogout();
    const { showBoundary } = useErrorBoundary();
    const { updateSelf } = useUserControllerAuth(userData.userType);

    const {auth} = useAuth();
    
    const { closeModal, openModal, transition } = useModalAnimation();

    const { refetchUser } = useCurrUser();

    const [formSelected, setFormSelected] = useState<EditUserFormType>(EditUserFormType.Nedefinisano);

    const defaultValues : ContextValues = {
        isCurrUser: isCurrUser,
        openModal: openModal,
        userData: userData,
        userDataPriv: userDataPriv,
        setFormSelected: setFormSelected
    }

    const { PopUpComponent, setPopUpMessage } = usePopUpMessage();
    const { blockUser, signUpforAdmin } = useAdminController();

    const { closeModal: closeBan, openModal: openBan, transition: ban } = useModalAnimation();

    async function blockHandler() {
        try {
            await blockUser(userDataPriv.id, userDataPriv.userType);
            setPopUpMessage({
                message: "Uspešno ste blokirali ovog korisnika",
                type: 'success'
            });
        } catch (error) {
            if(error instanceof SessionEndedError) {
                logoutUser();
            }
            else
                showBoundary(error);
        }
    }

    async function prijavaHandler() {
        try {
            await signUpforAdmin();
            setPopUpMessage({
                message: "Uspešno ste poslali prijavu za admina",
                type: 'success'
            })
        } catch (error) {
            if (error instanceof NotFoundError) {
                setPopUpMessage({
                    message: "Već ste poslali prijavu za admina",
                    type: 'error'
                })
            }
            else if(error instanceof SessionEndedError) {
                logoutUser();
            }
            else
                showBoundary(error);
        }
    }

    useEffect(() => {
        if(initialUserData !== null) {
            setIsChanged(JSON.stringify(userData) !== JSON.stringify(initialUserData))
            
            !firstRun ? setSuccess(false) : setFirstRun(false);
        }
    }, [userData, initialUserData])

    async function saveHandler() {
        try {
            setIsUpdating(true);

            await updateSelf(userData);
            setSuccess(true);
            setIsChanged(false);
            refetchUser!();
        } catch (error) {
            if(error instanceof SessionEndedError) {
                console.log('Ode sesija...');
                logoutUser();
            }
            else
                showBoundary(error);
        }
        finally {
            setIsUpdating(false);
        }
    }

    function resetHandler() {
        setUserData(initialUserData);
    }
    
    return (
        <>
            <PopUpComponent />
            {transition((style, showModal) => {
                return showModal ? (
                    <EditUserFormContext style={style} formType={formSelected} close={closeModal} updateUser={setUserData} userData={userData} />
                ) : null;
            })}

            {ban((style, show) => {
                return show ? (
                    <ConfirmBan callback={blockHandler} close={closeBan} style={style} />
                ) : null;
            })}

            <div className="container">
                {isChanged && (
                    <InfoBox>
                        <p>Imate nesačuvane promene</p>
                    </InfoBox>
                )}
                {success && (
                    <SuccessBox>
                        <p>Promene uspešno sačuvane</p>
                    </SuccessBox>
                )}
                <SectionContext.Provider value={defaultValues}>
                    <BasicInfoSection/>
                    <div className={classes.sectionContainer}>
                        <UserSpecificDataSection />
                        <div>
                            <Opis />
                                {userData.userType !== UserType.Korisnik && 
                                    <Skills />
                                }
                            <Poslovi />
                        </div>
                    </div>
                </SectionContext.Provider>
                {(isCurrUser && isChanged) && (
                    <div className={classes.saveContainer}>
                        <button
                            onClick={saveHandler}
                            disabled={isUpdating}
                            className={
                            "mainButtonSmall" + " " + `${isUpdating ? "button--loading" : ""}`
                            }
                        >
                            <span className="button__text">Sačuvaj promene</span>
                        </button>
                        <button onClick={resetHandler} className="secondLink">Vrati Stare Vrednosti</button>
                    </div>
                )}
                {(isCurrUser && auth.admin === AdminRoles.Nedefinisano) && (
                    <div className={classes.saveContainer}>
                        <button onClick={prijavaHandler} className="secondLink">Zahtevaj admin privilegije</button>
                    </div>
                )}
                {(auth.admin !== AdminRoles.Nedefinisano && !isCurrUser) && (
                    <div className={classes.saveContainer}>
                        <button
                            className="mainButtonSmall"
                            onClick={openBan}
                        >
                            Blokiraj Korisnika
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default ProfileData;



function BasicInfoSection() {

    const { isCurrUser, openModal, userData, setFormSelected } = useContext(SectionContext)!;

    function slikaHandler() {
        setFormSelected(EditUserFormType.Slika)
        openModal();
    }

    function imePrezimeHandler() {
        setFormSelected(EditUserFormType.ImePrezime)
        openModal();
    }

    function adresaHandler() {
        setFormSelected(EditUserFormType.Adresa)
        openModal();
    }

    return (
        <section className={classes.basicInfo}>
            <div className={classes.profileImage}>
                {(userData.slika !== '' && userData.slika !== null) ?
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
                    {userData.userType === UserType.Firma ? (
                        <>
                            <p className={classes.naziv}>{userData.naziv}</p>
                            {isCurrUser && <EditButton onClick={() => {
                                setFormSelected(EditUserFormType.ImeFirme);
                                openModal();
                            }} />}
                        </>
                        ) : (
                            <>
                                <p className={classes.naziv}>{userData.ime} {userData.prezime}</p>
                                {isCurrUser && <EditButton onClick={imePrezimeHandler} />}
                            </>
                        )
                    }

                </div>
                
                <p className={`${classes.iconContainer} ${classes.userType}`}><MdOutlineVerifiedUser />{UserType[userData.userType]}</p>
                <div className={classes.containerWithButton}>
                    <p className={classes.iconContainer}><IoLocationOutline /> {userData.adresa}</p>
                    {isCurrUser && <EditButton onClick={adresaHandler} />}
                </div>
            </div>

            {isCurrUser &&
            <div className={classes.settings}>
                <button className="mainButtonSmall">Podešavanja profila</button>
            </div>
            }

        </section>
    )
}

function UserSpecificDataSection() {

    const { isCurrUser, openModal, userData, setFormSelected, userDataPriv } = useContext(SectionContext)!;

    return (
        <section className={classes.userSpecificSec}>

            <div>
                <h4 className={classes.heading}>
                    <FaEuroSign size='2rem' />
                    Finansije
                </h4>

                {isCurrUser && (
                    <div className={classes.containerWithButton}>
                        <div className={classes.textWithInfo}>
                            <span className={classes.bold}>Trenutno Stanje: </span>{' '}
                            {formatDoubleWithWhite(userDataPriv.novacNaSajtu)} RSD
                            <span className={classes.iconInline}>
                                <Tooltip infoText="Drugi korisnici ne mogu da vide ovo polje" width="250px">
                                    <IoInformationCircleOutline size='1rem' />
                                </Tooltip>
                            </span>
                        </div>
                        <Link to={'/novac?tip=uplata'}>
                            <AddButton />
                        </Link>
                    </div>
                )}

                {userDataPriv.userType === UserType.Korisnik && (
                    <div className={classes.containerWithButton}>
                        <p><span className={classes.bold}>Ukupno potrošeno: </span> {' '}
                        { isCurrUser 
                          ? `${formatDoubleWithWhite(userDataPriv.potroseno)} RSD` 
                          : formatDouble(userDataPriv.potroseno, '')}
                        </p>
                    </div>
                )}

                {(userDataPriv.userType === UserType.Majstor || userDataPriv.userType === UserType.Firma) && (
                    <div className={classes.containerWithButton}>
                        <p><span className={classes.bold}>Ukupno zarađeno: </span> {' '}
                         { isCurrUser
                           ? `${formatDoubleWithWhite(userDataPriv.zaradjeno)} RSD`
                           : formatDouble(userDataPriv.zaradjeno, '')}
                        </p>
                    </div>
                )}
            </div>

            {userData.userType !== UserType.Korisnik && (
                <div>
                    <h4 className={classes.heading}>
                        <MdConstruction size='2rem' />
                        Struka
                    </h4>
                    <div className={classes.containerWithButton}>
                        <p><span className={classes.bold}>Iskustvo: </span> {Iskustvo[userData.iskustvo]}</p>
                        {isCurrUser && <EditButton onClick={() => {
                            setFormSelected(EditUserFormType.Iskustvo);
                            openModal();
                        }} />}
                    </div>

                    <div className={classes.containerWithButton}>
                        <p><span className={classes.bold}>Cena po satu: </span> {userData.cenaPoSatu} din</p>
                        {isCurrUser && <EditButton onClick={() => {
                            setFormSelected(EditUserFormType.CenaPoSatu);
                            openModal();
                        }} />}
                    </div>
                </div>
            )}

                {isCurrUser && (
                    <div>
                        <div className={classes.headingWithInfo}>
                            <h4 className={classes.heading}>

                                <IoIosContact size='2rem' />
                                Kontakt
                            <span className={classes.iconInline}>
                                        <Tooltip infoText="Drugi korisnici ne mogu da vide vaš kontakt" width="270px">
                                            <IoInformationCircleOutline size='1rem' />
                                        </Tooltip>
                            </span>

                            </h4>
                        </div>

                        <div className={classes.containerWithButton}>
                            <p>
                                <span className={classes.bold}>Email:</span>{' '}
                                {userData.email}
                            </p>
                            <EditButton />
                        </div>

                        <div className={classes.containerWithButton}>
                            <p>
                                <span className={classes.bold}>Broj Telefona:</span>{' '}
                                {userData.brojTelefona}
                            </p>
                            <EditButton onClick={() => {
                                setFormSelected(EditUserFormType.BrojTelefona)
                                openModal();
                            }} />
                        </div>

                        {(userDataPriv.userType === UserType.Majstor || userDataPriv.userType === UserType.Korisnik) && (
                            <p>
                                <span className={classes.bold}>JMBG:</span>{' '}
                                {userDataPriv.jmbg}
                            </p>
                        )}

                        {requiresRole(userDataPriv.userType, [UserType.Firma]) && (
                            <p>
                                <span className={classes.bold}>PIB:</span>{' '}
                                {(userDataPriv as GetFirmaResponse).pib}
                            </p>
                        )}
                    </div>
                )}

            {(userData.userType === UserType.Korisnik || userData.userType === UserType.Majstor) && (
                <div>
                    <h4 className={classes.heading}>
                        <CiCalendar size='2rem' />
                        Datumi
                    </h4>
                    <div className={classes.containerWithButton}>
                        <p>
                            <span className={classes.bold}>
                                Datum Rođenja:
                            </span> {' '}
                            {formatDate(userData.datumRodjenja)}
                        </p>
                        {isCurrUser && <EditButton onClick={() => {
                            setFormSelected(EditUserFormType.DatumRodjenja)
                            openModal();
                        }} />}
                    </div>
                    <p>
                        <span className={classes.bold}>
                            Član još od:
                        </span> {' '}
                        {formatDate(userDataPriv.datumKreiranjaNaloga)}
                    </p>
                </div>
            )}
        </section>
    )
}

function Opis() {

    const { isCurrUser, openModal, userData, setFormSelected } = useContext(SectionContext)!;

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
                    {isCurrUser && <EditButton onClick={() => {
                            setFormSelected(EditUserFormType.Opis)
                            openModal();
                        }} />}
                    <Tooltip width="150px" infoText="Kopiraj Link Profila">
                        <div onClick={copyToClipboard} className={classes.copyProfile}><IoLink size='1rem' /></div>
                    </Tooltip>
                </div>
            </div>
            <ShowMore text={userData.opis}></ShowMore>
            {/* <div className={classes.divOpis}>
                {userData.opis}
            </div> */}
        </section>
    )
}

function Skills() {

    const { isCurrUser, openModal, userData, setFormSelected } = useContext(SectionContext)!;

    let headingText = userData.userType === UserType.Majstor ? 'Veština' : 'Veštine';

    function strukaHandler() {
        setFormSelected(EditUserFormType.Struka)
        openModal();
    }
    function strukeHandler() {
        setFormSelected(EditUserFormType.Struke)
        openModal();
    }


    return (
        <section className={classes.skillsSec}>
            <div className={classes.containerWithButton}>
                <h3>{headingText}</h3>
                {(userData.userType === UserType.Majstor && isCurrUser) && 
                    <EditButton onClick={strukaHandler} />
                }
                {(userData.userType === UserType.Firma && isCurrUser) && 
                    <EditButton onClick={strukeHandler} />
                }
            </div>
            {userData.userType === UserType.Majstor && (
                <div className={classes.vestine}>
                    <div className={classes.vestina}>
                        {getStrukaDisplayName(userData.struka)}
                    </div>
                </div>
            )}

            {userData.userType === UserType.Firma && (
                <div className={classes.vestine}>
                    {userData.struke && 
                        userData.struke.map(el => {
                            return (
                            <div key={el} className={classes.vestina}>
                                {getStrukaDisplayName(el)}
                            </div>)
                        })
                    }
                </div>
            )}
        </section>
    )
}

function Poslovi() {
    const { userDataPriv: { userType, ocena } } = useContext(SectionContext)!;
    const { closeModal, openModal, transition } = useModalAnimation();
    const [posao, setPosao] = useState<GetZavrseniPosloviDTO | null>(null);

    function openPopUp(posao: GetZavrseniPosloviDTO) {
        setPosao(posao);
        openModal();
    }

    return (
        <>
            {transition((style, show) => {
                return show ? (
                    <ZavsenPopUp close={closeModal} style={style} posao={posao!} />
                ) : null;
            })}
            <section className={classes.posloviSec}>
                <div>
                    <h3>Prethodni Poslovi</h3>
                    <div>
                        <span>Prosečna ocena</span>
                        <Rating
                            name="ocena"
                            size="medium"
                            precision={0.1}
                            value={ocena}
                            readOnly={true}
                            sx={{ gap: '0' }}
                        />
                        <span>{ocena}</span>
                    </div>
                </div>
                <ZavrseniPoslovi userType={userType} openPopUp={openPopUp} />
            </section>
        </>
    )
}