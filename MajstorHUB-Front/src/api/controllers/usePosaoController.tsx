import { isAxiosError } from "axios";
import useAuth from "../../hooks/useAuth"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { CreatePosaoDTO, GetByZapocetiDTO, GetZavrseniPosloviDTO, ZavrsiPosaoDTO } from "../DTO-s/Posao/PosloviDTO";
import { SessionEndedError } from "./useUserControllerAuth";
import UserType from "../../lib/UserType";

export class NotFoundError extends Error {
    constructor(mess?: string) {
        super(mess || "Not Found")
        this.name = "NotFound";
    }
}

export default function usePosaoController() {
    const { auth: { userType } } = useAuth();
    const axiosPrivate = useAxiosPrivate(userType);

    const PosaoController = {
        zapocniPosao: async function (posaoDto: CreatePosaoDTO): Promise<boolean> {
            try {
                await axiosPrivate.post("/Posao/Zapocni-posao",
                    JSON.stringify(posaoDto),
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
        getByUserZapoceti: async function (controller: AbortController): Promise<GetByZapocetiDTO[]> {
            try {
                const response = await axiosPrivate.get('/Posao/GetByUserZapoceti', { signal: controller.signal });
                const data : GetByZapocetiDTO[] = response.data;
                data.forEach(el => {
                    el.pocetakRadova = new Date(el.pocetakRadova);
                    el.zavrsetakRadova = new Date(el.zavrsetakRadova);
                });

                return data;
            } catch (error) {
                if(isAxiosError(error) && error.name === 'CanceledError') {
                    throw error;
                }
                else if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
                        case 404:
                            throw new NotFoundError();
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
        getByUserZavrseni: async function (userId: string, userType: UserType, controller: AbortController): Promise<GetZavrseniPosloviDTO[]> {
            try {
                const response = await axiosPrivate.get(`/Posao/GetByUserZavrseni/${userId}/${userType}`, { signal: controller.signal });

                const data: GetZavrseniPosloviDTO[] = response.data;
                for (let el of data) {
                    el.pocetakRadova = new Date(el.pocetakRadova);
                    el.zavrsetakRadova = new Date(el.zavrsetakRadova);
                }

                return data;
            } catch (error) {
                if(isAxiosError(error) && error.name === 'CanceledError') {
                    throw error;
                }
                else if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
                        case 401:
                            throw new SessionEndedError();
                        case 404:
                            throw new NotFoundError();
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
        zavrsiByKorisnik: async function (posao: ZavrsiPosaoDTO): Promise<boolean> {
            try {
                await axiosPrivate.patch('/Posao/ZavrsiByKorisnik',
                    JSON.stringify(posao),
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
        zavrsiByIzvodjac: async function (posao: ZavrsiPosaoDTO): Promise<boolean> {
            try {
                await axiosPrivate.patch('/Posao/ZavrsiByIzvodjac',
                    JSON.stringify(posao),
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
    };

    return PosaoController;
}