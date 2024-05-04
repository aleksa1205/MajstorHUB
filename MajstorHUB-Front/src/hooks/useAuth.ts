import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

// Radi lepseg koda ovo je samo util
// Ovo samo vraca AuthContext, znaci auth i setAuth
// Mislim da i react preporucuje da se ovo radi

const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;