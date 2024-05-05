import UserType, { userToPath } from "../../lib/UserType";
import { isAxiosError } from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function useUserControllerAuth(type : UserType) {
    const axiosPrivate = useAxiosPrivate(type);

    const UserControllerAuth = {
        getAll: async function() {
            const response = await axiosPrivate.get(`${userToPath(type)}/GetAll`);
            console.log(response.data);
        }
    }

    return UserControllerAuth;
}

export default useUserControllerAuth;