import { useNavigate } from "react-router-dom";
import useUserControllerAuth from "../api/controllers/useUserControllerAuth";
import { emptyAuthValue } from "../context/AuthProvider";
import useAuth from "./useAuth.ts";

function useLogout() {
    const { auth, setAuth } = useAuth();
    const { logout } = useUserControllerAuth(auth.userType);
    const navigate = useNavigate();

    const LogoutUser = async function logoutHandler() {
        const data = await logout();
        if(data === null) navigate('/error');
        else if(!data) navigate('/error?message=Pokusavas da se izlogujes a nisi logovan');
        else {

            setAuth(emptyAuthValue);

            setTimeout(() => {
                navigate('/');
            }, 100);
        }
    }

    return LogoutUser;
}

export default useLogout;