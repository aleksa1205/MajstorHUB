import {  useParams } from "react-router-dom";
import UserType from "../../../lib/UserType";
import { GetFirmaResponse, GetKorisnikResponse, GetMajstorResponse } from "../../../api/DTO-s/responseTypes";
import useAuth from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import useUserControllerAuth, { SessionEndedError } from "../../../api/controllers/useUserControllerAuth";
import useLogout from "../../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";
import useCurrUser from "../../../hooks/useCurrUser";
import Hamster from "../../Loaders/Hamster";
import { isAxiosError } from "axios";
import classes from './UserProfile.module.css'
import { FirmaDataUpdate, KorisnikDataUpdate, MajstorDataUpdate } from "../../../api/DTO-s/updateSelfTypes";
import { base64ToUrl } from "../../../lib/utils";

type PropsValues = {
    typeFromUrl: UserType;
}

function UserProfile({ typeFromUrl } : PropsValues) {
    const { id } = useParams();

    const { auth } = useAuth();
    const { getById } = useUserControllerAuth(typeFromUrl);

    const logoutUser = useLogout();
    const { showBoundary } = useErrorBoundary();

    const currUserData = useCurrUser();
    const [userData, setUserData] = useState<GetKorisnikResponse | GetFirmaResponse | GetMajstorResponse | null>(null);
    const [userDataUpdate, setUserDataUpdate] = useState<KorisnikDataUpdate | MajstorDataUpdate | FirmaDataUpdate | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [notFound, setNotFound] = useState(id?.length !== 24);


    const isCurrUser = id === auth.userId;

    useEffect(function() {
        const controller = new AbortController();

        async function startFetching() {
            try {
                setIsFetching(true);

                const data = await getById(id!, controller);

                if(data === false) {
                    setIsFetching(false);
                    setNotFound(true);
                    return;
                }
                
                switch (auth.userType) {
                    case UserType.Korisnik:
                        data.userType = UserType.Korisnik
                        break;
                    case UserType.Majstor:
                        data.userType = UserType.Majstor;
                        break;
                    case UserType.Firma:
                        data.userType = UserType.Firma;
                        break
                    default:
                        console.error('Greska pri odredjivanju tipa pri upisu u setData');
                        break;
                }
                
                setUserData(data);
                setIsFetching(false);
            } catch (error) {
                if(isAxiosError(error) && error.name === 'CanceledError') {
                    console.log('GetById zahtev canceled');
                }
                else if(error instanceof SessionEndedError) {
                    logoutUser();
                    setIsFetching(false);
                }
                else {
                    setIsFetching(false);
                    showBoundary(error)
                }
            }
        }

        if(!notFound) {
            if(isCurrUser) {
                if(currUserData.userData)
                    setUserData(currUserData.userData);
                if(currUserData.isFetching !== null && typeof currUserData.isFetching !== 'undefined')
                    setIsFetching(currUserData.isFetching);
    
            } else
                startFetching();
        }

        return function() {
            controller.abort();
        }

    }, [currUserData.isFetching]);

    useEffect(() => console.log(userData), [userData]);

    return (
        <div className="container">
            {notFound ?
             <h1>Nismo pronasli user-a kog trazite :(</h1> : 
             isFetching ? <Hamster /> : 
             (
                <main className={classes.main}>
                    {userData?.userType === UserType.Korisnik && 
                    <}
                </main>
             )
            }
        </div>
    )
}

export default UserProfile;

type BasicInforProps = {
    userData: KorisnikDataUpdate | MajstorDataUpdate | FirmaDataUpdate;
}

export function BasicInfoSection({ userData } : BasicInforProps ) {
    return (
        <section className={classes.basicInfo}>
            <div>
                <img src={base64ToUrl(userData.slika)} alt="slika_korisnika" />
            </div>
            <div>
                {userData.userType === UserType.Firma ? 
                <p>{userData.naziv}</p> :
                (<p>{userData.ime} {userData.prezime}</p>)
                }
                <p>{UserType[userData.userType]}</p>
            </div>
        </section>
    )
}