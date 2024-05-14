import { useNavigate } from "react-router-dom";
import useUserControllerAuth from "../api/controllers/useUserControllerAuth";
import { emptyAuthValue } from "../context/AuthProvider";
import useAuth from "./useAuth.ts";
import { useErrorBoundary } from "react-error-boundary";

function useLogout() {
    const { auth, setAuth } = useAuth();
    const { logout } = useUserControllerAuth(auth.userType);
    const { showBoundary } = useErrorBoundary();
    const navigate = useNavigate();

    const LogoutUser = async function logoutHandler() {
        try {
            let msg : string = '';
            if(auth.refreshToken.expiry > new Date())
                await logout();
            else
                msg = '?message=Vaša sesija je istekla, ulogujte se ponovo'
            
            setAuth(emptyAuthValue);

            setTimeout(() => {
                navigate('/login' + msg);
            }, 100);
        } catch (error) {
            showBoundary(error);
        }
    }

    return LogoutUser;
}

export default useLogout;