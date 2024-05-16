import {  useParams } from "react-router-dom";
import UserType from "../../../lib/UserType";
import { GetFirmaResponse, GetKorisnikResponse, GetMajstorResponse } from "../../../api/responseTypes";
import useAuth from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import useUserControllerAuth, { SessionEndedError } from "../../../api/controllers/useUserControllerAuth";
import useLogout from "../../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";
import useCurrUser from "../../../hooks/useCurrUser";
import Hamster from "../../Loaders/Hamster";

type PropsValues = {
    typeFromUrl: UserType;
    // isCurrUser: boolean;
    // userData: GetKorisnikResponse | GetMajstorResponse | GetFirmaResponse; 
}

function UserProfile({ typeFromUrl } : PropsValues) {
    const { id } = useParams();

    const { auth } = useAuth();
    const { getById } = useUserControllerAuth(typeFromUrl);

    const logoutUser = useLogout();
    const { showBoundary } = useErrorBoundary();

    const currUserData = useCurrUser();
    const [userData, setUserData] = useState<GetKorisnikResponse | GetFirmaResponse | GetMajstorResponse | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [notFound, setNotFound] = useState(id?.length !== 24);

    const isCurrUser = id === auth.userId;

    useEffect(function() {
        async function startFetching() {
            try {
                setIsFetching(true);

                const data = await getById(id!);
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
            } catch (error) {
                if(error instanceof SessionEndedError) {
                    logoutUser();
                }
                else
                    showBoundary(error);

            } finally {
                setIsFetching(false);
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

    }, [currUserData.isFetching]);

    useEffect(() => console.log(userData), [userData])

    return (
        <div>
            {notFound && <h1>Nismo pronasli user-a kog trazite :(</h1>}
            {isFetching && <Hamster />}
            <Hamster />
        </div>
    )
}

export default UserProfile;