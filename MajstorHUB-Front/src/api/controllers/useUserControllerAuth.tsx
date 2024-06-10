import UserType, { userToPath } from "../../lib/UserType";
import { isAxiosError } from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { GetFirmaResponse, GetKorisnikResponse, GetMajstorResponse, userDataType } from '../DTO-s/responseTypes';
import { userDataUpdateType } from "../DTO-s/updateSelfTypes";
import { FilterDTO } from "../DTO-s/FilterRequest";
import { ForbiddenError } from "./useOglasController";

export class SessionEndedError extends Error {
    constructor(message?: string) {
        super(message || 'Unauthorized');
        this.name = 'UnauthorizedError';
    }
}

export class WrongAuthDataError extends Error {
    constructor(message?: string) {
        super(message || 'Auth data od server and client are not the same');
        this.name = 'WrongAuthDataError'
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
                            throw new WrongAuthDataError();
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
        getById: async function(userId : string, abortController : AbortController) : Promise<false | GetKorisnikResponse | GetFirmaResponse | GetMajstorResponse> {
            try {
                const response = await axiosPrivate.get(`${userToPath(type)}/GetById/${userId}`, {signal: abortController.signal});
                let data: GetKorisnikResponse | GetFirmaResponse | GetMajstorResponse = response.data;
                
                switch (type) {
                    case UserType.Korisnik:
                        data.userType = UserType.Korisnik
                        break;
                    case UserType.Majstor:
                        data.userType = UserType.Majstor;
                        break
                    case UserType.Firma:
                        data.userType = UserType.Firma;
                        break
                }
                data.datumKreiranjaNaloga = new Date(data.datumKreiranjaNaloga);

                if('jmbg' in data) {
                    if(data.datumRodjenja)
                        data.datumRodjenja = new Date(data.datumRodjenja);
                }

                return data;

            } catch (error) {
                if(isAxiosError(error) && error.name === 'CanceledError') {
                    throw error;
                }
                else if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
                        case 404:
                            return false;
                        case 403:
                            throw new ForbiddenError();
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
        updateSelf: async function(userData : userDataUpdateType) : Promise<true> {
            try {
                await axiosPrivate.put(`${userToPath(type)}/UpdateSelf`,
                    JSON.stringify(userData),
                    { headers: {'Content-Type': 'application/json'} }
                );

                return true;

            } catch (error) {

                if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
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
        filter: async function(filter : FilterDTO) : Promise<false | userDataType[]>  {
            try {
                const response = await axiosPrivate.post(`${UserType[type]}/Filter`,
                    JSON.stringify(filter),
                    { headers: {'Content-Type': 'application/json'} }
                );

                const data : userDataType[] = response.data;
                data.forEach(el => {
                    switch (type) {
                        case UserType.Korisnik:
                            el.userType = UserType.Korisnik
                            break;
                        case UserType.Majstor:
                            el.userType = UserType.Majstor;
                            break
                        case UserType.Firma:
                            el.userType = UserType.Firma;
                            break
                    }
                })
                return data;
            } catch (error) {
                if(isAxiosError(error) && error.name === 'CanceledError') {
                    throw error;
                }
                else if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
                        case 404:
                            return false;
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
        deposit: async function(amount : number) : Promise<boolean> {
            try {
                await axiosPrivate.patch(`${UserType[type]}/Deposit`,
                    JSON.stringify(amount),
                    {headers: {'Content-Type': 'application/json'}}
                );

                return true;
            } catch (error) {
                if(isAxiosError(error) && error.name === 'CanceledError') {
                    throw error;
                }
                else if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
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
        withdraw: async function(amount : number) : Promise<boolean> {
            try {
                await axiosPrivate.patch(`${UserType[type]}/Withdraw`,
                    JSON.stringify(amount),
                    {headers: {'Content-Type': 'application/json'}}
                );

                return true;
            } catch (error) {
                if(isAxiosError(error) && error.name === 'CanceledError') {
                    throw error;
                }
                else if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
                        case 406:
                            throw new Error('Nemate pravo da skinete vise novca sa racuna nego sto imate');
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