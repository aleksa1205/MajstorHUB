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

        let data;
        try {
            data = await logout();
            
        } catch (error) {
            showBoundary(error);
        }
        
        setAuth(emptyAuthValue);

        setTimeout(() => {
            navigate('/');
        }, 100);
        
    }

    return LogoutUser;
}

export default useLogout;