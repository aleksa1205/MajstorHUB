import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import UserType from "../lib/UserType";


// Ovo je react hook, kada se pozove on procita context iz auth i na osnovu njega 
// konfigurise axiosPrivate instancu
function useAxiosPrivate(type : UserType) {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {

        // Inicijalni request, on treba da jwt (koji se nalazi u authContext) upise u secure
        // cookie i tako ga posalje serveru, jer server jedino tako proverava tokene
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth.jwtToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        // Intrceptor za refreshovanje tokena, znaci ako request ne uspe i vrati nam nazad
        // 401 (Unauthorized) onda pozivamo refresh funkciju koja zove refresh endpoint
        // E sad verovatno moze da dodje do problema jer 401 kod moze da se vrati ako 
        // uopste nemamo token
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if(error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const { jwtToken }= await refresh(type);
                    prevRequest.headers['Authorization'] = `Bearer ${jwtToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    },[auth, refresh]);

    return axiosPrivate;
}

export default useAxiosPrivate;