import { isAxiosError } from "axios";
import useAuth from "../../hooks/useAuth"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import UserType from "../../lib/UserType";
import { CreatePrijavaDTO, PrijavaWithIzvodjacDTO } from "../DTO-s/Prijave/PrijaveDTO";
import { SessionEndedError } from "./useUserControllerAuth";

export const bidBoostedThreshold: number = 50;
export const goodMatchThreshold: number = 60;
export const bestMatchThreshold: number = 90;

export enum Matching {
    Nothing,
    GoodMatch,
    BestMatch
}

export const minCenaPrijave = 30;

export function checkMatchingScore(matchingScore: number) {
    if(matchingScore >= bestMatchThreshold)
        return Matching.BestMatch;
    if(matchingScore >= goodMatchThreshold)
        return Matching.GoodMatch;
    else
        return Matching.Nothing;
}

export default function usePrijavaController() {
    const { auth: { userType } } = useAuth();
    const axiosPrivate = useAxiosPrivate(userType);
    
    const PrijavaController = {
        getByOglas: async function (oglasId: string, controller: AbortController): Promise<false | PrijavaWithIzvodjacDTO[]> {
            if(userType !== UserType.Korisnik)
                throw new Error("Nemas pravo da zoves getByOglas iz prijava kontroler ako nisi korisnik");
            try {
                const response = await axiosPrivate.get("Prijava/GetByOglas/" + oglasId, {signal: controller.signal});

                let data: PrijavaWithIzvodjacDTO[] = response.data;
                data.forEach(el => el.datumKreiranja = new Date(el.datumKreiranja));

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
        prijaviSe: async function (prijava: CreatePrijavaDTO): Promise<boolean> {
            try {
                await axiosPrivate.post('/Prijava/Prijavi-se',
                    JSON.stringify(prijava),
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
        deleteSelf: async function (oglasId: string): Promise<boolean> {
            try {
                await axiosPrivate.delete('Prijava/DeleteSelf/' + oglasId);
                return true;
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

    return PrijavaController;
}