import UserType, { userToPath } from "../../lib/UserType";
import { isAxiosError } from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useUserControllerAuth(type : UserType) {
    const axiosPrivate = useAxiosPrivate(type);

    const UserControllerAuth = {
        logout: async function() : Promise<true> {
            try {
                await axiosPrivate.delete(`${userToPath(type)}/Logout`);
                return true;
            } catch (error) {
                if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
                        case 401:
                            throw Error('Pokusavas da se izlogujes a nemas token');
                        default:
                            throw Error('Axios Error - ' + error.message);
                    }
                }
                else if(error instanceof Error) {
                    throw Error('General Error - ' + error.message);
                }
                else {
                    throw Error('Unexpected Error - ' + error);
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