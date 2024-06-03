import axios from "../api/axios";
import { LoginResponse } from "../api/controllers/useUserController"; 
import UserType, { userToPath } from "../lib/UserType";
import useAuth from "./useAuth";

function useRefreshToken() {
    const { auth, setAuth } = useAuth();

    async function refresh(type : UserType) {
        console.log('Refreshing...');
        const response = await axios.post(`${userToPath(type)}/Refresh`, 
        JSON.stringify({jwtToken: auth.jwtToken, refreshToken: auth.refreshToken.tokenValue}),
        {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
        });
        const data : LoginResponse = response.data;
        data.expiration = new Date(data.expiration);
        data.refreshToken.expiry = new Date(data.refreshToken.expiry);

        setAuth(prev => {
            // console.log(JSON.stringify(prev.jwtToken));
            // console.log(data.jwtToken);
            return {...prev, jwtToken: data.jwtToken, refreshToken: data.refreshToken, expiration: data.expiration}
        });

        return data;
    }

    return refresh;
}

export default useRefreshToken;