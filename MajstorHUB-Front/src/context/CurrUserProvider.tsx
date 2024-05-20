import { createContext, useEffect, useState } from "react";
import { GetKorisnikResponse, GetFirmaResponse, GetMajstorResponse } from "../api/DTO-s/responseTypes";
import useAuth from "../hooks/useAuth";
import useUserControllerAuth, { SessionEndedError } from "../api/controllers/useUserControllerAuth";
import { useErrorBoundary } from "react-error-boundary";
import { base64ToUrl } from "../lib/utils";
import useLogout from "../hooks/useLogout";
import { isAxiosError } from "axios";


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
        const controller = new AbortController();

        async function startFetching() {
            try {
                setIsFetching(true);

                const data = await getById(auth.userId, controller);
                if(data === false) {
                    throw Error('Invalid user id sent');
                }
                if(data.slika) {
                    setPictureUrl(base64ToUrl(data.slika));
                }
                
                setUserData(data);
                setIsFetching(false);
            } catch (error) {
                if(isAxiosError(error) && error.name === 'CanceledError') {
                    console.log('GetById zahtev canceled');
                }
                else if(error instanceof SessionEndedError) {
                    console.log('Ode sesija...');
                    logoutUser();
                    setIsFetching(false);
                }
                else {
                    setIsFetching(false);
                    showBoundary(error);
                }

            }
        }
        
        startFetching();

        return () => controller.abort();
    }, []);

    return (
        <CurrUserContext.Provider value={{pictureUrl, userData, isFetching}}>
            {children}
        </CurrUserContext.Provider>
    )

}

export default CurrUserContext;