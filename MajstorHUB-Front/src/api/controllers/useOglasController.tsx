import UserType from "../../lib/UserType";
import { isAxiosError } from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { CreateOglasDTO, FilterOglasDTO, GetOglasDTO } from "../DTO-s/Oglasi/OglasiDTO";
import { SessionEndedError } from "./useUserControllerAuth";


function useOglasController() {
    const axiosPrivate = useAxiosPrivate(UserType.Firma);

    const OglasController = {
        postavi: async function (oglas: CreateOglasDTO): Promise<boolean> {
            try {
                await axiosPrivate.post('Oglas/Postavi',
                    JSON.stringify(oglas),
                    {headers: { 'Content-Type': 'application/json' }}
                );

                return true;
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
                console.log(response.data);
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
        }
    }

    return OglasController;
}

export default useOglasController;