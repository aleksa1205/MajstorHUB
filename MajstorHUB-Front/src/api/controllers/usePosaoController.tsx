import { isAxiosError } from "axios";
import useAuth from "../../hooks/useAuth"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { CreatePosaoDTO } from "../DTO-s/Posao/PosloviDTO";
import { SessionEndedError } from "./useUserControllerAuth";

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
    };

    return PosaoController;
}