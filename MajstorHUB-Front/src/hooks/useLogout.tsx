import { useLocation, useNavigate } from "react-router-dom";
import useUserControllerAuth, { WrongAuthDataError } from "../api/controllers/useUserControllerAuth";
import { emptyAuthValue } from "../context/AuthProvider";
import useAuth from "./useAuth.ts";
import { useErrorBoundary } from "react-error-boundary";

function useLogout() {
    const { auth, setAuth } = useAuth();
    const { logout } = useUserControllerAuth(auth.userType);
    const { showBoundary } = useErrorBoundary();
    const location = useLocation();
    const navigate = useNavigate();

    const LogoutUser = async function logoutHandler() {
        try {
            let msg : string = '';
            console.log(`Logout called, current time: ${new Date()}
                                        refresh token expiry: ${auth.refreshToken.expiry},
                                        jwt token expiry: ${auth.expiration}`);
            if(auth.refreshToken.expiry > new Date()) {
                console.log('Refresh token not expired, calling logout endpoint...');
                await logout();
            }
            else {
                console.log('Refrsh token has expired, no need to call logout endpoint...')
                msg = '?message=Vaša sesija je istekla, ulogujte se ponovo'
            }
            
            setAuth(emptyAuthValue);

            console.log('Url to navigate to: ' + '/login'+msg);
            setTimeout(() => {
                navigate('/login' + msg, { state: { from: location }, replace: true});
            }, 100);
        } catch (error) {
            if(error instanceof WrongAuthDataError) {
                setAuth(emptyAuthValue);
                setTimeout(() => {
                    navigate('/login?message=Ulogovani ste se na drugom mestu, molimo vas da se ponovo ulogujete', {state: { from: location }, replace: true});
                }, 100);
            } else {
                showBoundary(error);
            }
        }
    }

    return LogoutUser;
}

export default useLogout;