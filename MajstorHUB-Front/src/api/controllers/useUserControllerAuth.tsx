import UserType, { userToPath } from "../../lib/UserType";
import { isAxiosError } from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useUserControllerAuth(type : UserType) {
    const axiosPrivate = useAxiosPrivate(type);

    const UserControllerAuth = {
        logout: async function() : Promise<Boolean | null> {
            try {
                await axiosPrivate.delete(`${userToPath(type)}/Logout`);
                return true;
            } catch (error) {
                if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
                        case 401:
                            console.error('Pokusavas da se izlogujes a nemas token');
                            return false;
                        default:
                            console.error('Unexpected error ' + error.message);
                            return null;
                    }
                }
                else if(error instanceof Error) {
                    console.error(error.message);
                    return null;
                }
                else {
                    console.error(error);
                    return null;
                }
            }
        },

        getAll: async function() {
            const response = await axiosPrivate.get(`${userToPath(type)}/GetAll`);
            console.log(response.data);
        }
    }

    return UserControllerAuth;
}

export default useUserControllerAuth;