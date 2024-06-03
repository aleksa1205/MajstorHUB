import UserType from "../../lib/UserType";
import { isAxiosError } from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { CreateOglasDTO, FilterOglasDTO, GetOglasDTO, OglasUpdateSelfDTO } from "../DTO-s/Oglasi/OglasiDTO";
import { SessionEndedError } from "./useUserControllerAuth";
import useAuth from "../../hooks/useAuth";

export class ForbiddenError extends Error {
    constructor(message?: string) {
        super(message || 'Forbidden');
        this.name = 'ForbiddenError';
    }
}

function useOglasController() {
    const { auth: { userType } } = useAuth();
    const axiosPrivate = useAxiosPrivate(userType);

    const OglasController = {
        postavi: async function (oglas: CreateOglasDTO): Promise<string> {
            if(userType !== UserType.Korisnik)
                throw new Error("Nemas pravo da zoves funkciju PostaviOglas ako nisi klijent");
            try {
                const result = await axiosPrivate.post('Oglas/Postavi',
                    JSON.stringify(oglas),
                    {headers: { 'Content-Type': 'application/json' }}
                );

                return result.data as string;
            } catch (error) {
                console.error(error);

                if(isAxiosError(error) && error.name === 'CanceledError') {
                    throw error;
                }
                else if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
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
        },
        filter: async function (filter: FilterOglasDTO): Promise<false | GetOglasDTO[]> {
            try {
                const response = await axiosPrivate.post('Oglas/Filter',
                    JSON.stringify(filter),
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const data : GetOglasDTO[] = response.data;
                data.forEach(oglas => oglas.datumKreiranja = new Date(oglas.datumKreiranja));

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
        },
        getByIdDto: async function (id: string, abortController : AbortController): Promise<false | GetOglasDTO> {
            try {
                const response = await axiosPrivate.get('/Oglas/GetByIdDto/' + id, { signal: abortController.signal });
                
                const data: GetOglasDTO = response.data;
                data.datumKreiranja = new Date(data.datumKreiranja);
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
        },
        deleteSelf: async function (id: string): Promise<true> {
            try {
                await axiosPrivate.delete('Oglas/DeleteSelf/' + id);
                return true;
            } catch (error) {
                if(isAxiosError(error) && error.name === 'CanceledError') {
                    throw error;
                }
                else if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
                        case 403:
                            throw new ForbiddenError();
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
        },
        updateSelf: async function (oglas: OglasUpdateSelfDTO): Promise<true> {
            try {
                await axiosPrivate.patch('Oglas/UpdateSelf',
                    JSON.stringify(oglas),
                    { headers: { 'Content-Type': 'application/json' } }
                );
                
                return true;
            } catch (error) {
                if(isAxiosError(error) && error.name === 'CanceledError') {
                    throw error;
                }
                else if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
                        case 403:
                            throw new ForbiddenError();
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

    return OglasController;
}

export default useOglasController;