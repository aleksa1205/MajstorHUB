import UserType, { userToPath } from "../../lib/UserType";
import { isAxiosError } from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { GetFirmaResponse, GetKorisnikResponse, GetMajstorResponse } from '../responseTypes';

export class SessionEndedError  extends Error {
    constructor(message?: string) {
        super(message || 'Unauthorized');
        this.name = 'UnauthorizedError';
    }
}

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

        getById: async function(userId : string) : Promise<false | GetKorisnikResponse | GetFirmaResponse | GetMajstorResponse> {
            try {
                const response = await axiosPrivate.get(`${userToPath(type)}/GetById/${userId}`);
                let data: GetKorisnikResponse | GetFirmaResponse | GetMajstorResponse = response.data;
                data.datumKreiranjaNaloga = new Date(data.datumKreiranjaNaloga);

                if('jmbg' in data) {
                    if(data.datumRodjenja)
                        data.datumRodjenja = new Date(data.datumRodjenja);
                }

                return data;

            } catch (error) {
                if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
                        case 404:
                            return false;
                        case 401:
                            throw new SessionEndedError();
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
        }
    }

    return UserControllerAuth;
}

export default useUserControllerAuth;