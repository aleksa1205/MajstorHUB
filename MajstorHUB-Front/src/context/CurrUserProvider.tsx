import { createContext, useEffect, useState } from "react";
import { GetKorisnikResponse, GetFirmaResponse, GetMajstorResponse } from "../api/responseTypes";
import useAuth from "../hooks/useAuth";
import useUserControllerAuth, { SessionEndedError } from "../api/controllers/useUserControllerAuth";
import { useErrorBoundary } from "react-error-boundary";
import { base64ToUrl } from "../lib/utils";
import useLogout from "../hooks/useLogout";
import UserType from "../lib/UserType";


type CurrUserContextType = {
    pictureUrl? : string | null;
    userData? : GetKorisnikResponse | GetFirmaResponse | GetMajstorResponse | null;
    isFetching? : boolean | null;
}

const CurrUserContext = createContext<CurrUserContextType>({});

type PropsValue = {
    children : React.ReactNode;
}

export function CurrUserProvider({ children } : PropsValue) {
    const logoutUser = useLogout();

    const [pictureUrl, setPictureUrl] = useState<string | null>(null);
    const [userData, setUserData] = useState<GetKorisnikResponse | GetFirmaResponse | GetMajstorResponse | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    const { auth } = useAuth();
    const { getById }  = useUserControllerAuth(auth.userType);
    const { showBoundary } = useErrorBoundary();


    useEffect(() => {
        async function startFetching() {
            try {
                setIsFetching(true);

                const data = await getById(auth.userId);
                if(data === false) {
                    throw Error('Invalid user id sent');
                }
                if(data.slika) {
                    setPictureUrl(base64ToUrl(data.slika));
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
                if(error instanceof SessionEndedError) {
                    logoutUser();
                }
                else
                    showBoundary(error);

                setIsFetching(false);
            }
        }
        
        startFetching();
    }, []);

    return (
        <CurrUserContext.Provider value={{pictureUrl, userData, isFetching}}>
            {children}
        </CurrUserContext.Provider>
    )

}

export default CurrUserContext;