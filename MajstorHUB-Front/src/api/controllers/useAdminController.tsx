import { isAxiosError } from "axios";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import UserType from "../../lib/UserType";
import { SessionEndedError } from "./useUserControllerAuth";
import { NotFoundError } from "./usePosaoController";
import { PrijavaZaAdminaDTO } from "../DTO-s/Admin/AdminDTOs";
import { GetUserResponse } from "../DTO-s/responseTypes";

export default function useAdminController() {
    const { auth: { userType}} = useAuth();
    const axiosPrivate = useAxiosPrivate(userType);

    const AdminController = {
        blockUser: async function(userId: string, role: UserType): Promise<boolean> {
            try {
                await axiosPrivate.patch(`/Admin/BlockUser/${userId}/${role}`);
                return true;
            } catch (error) {
                if(isAxiosError(error) && error.name === 'CanceledError') {
                    throw error;
                }
                else if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.res.status) {
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
        signUpforAdmin: async function(): Promise<boolean> {
            try {
                await axiosPrivate.post("/Admin/SignUpForAdmin");
                return true;
            } catch (error) {
                if(isAxiosError(error) && error.name === 'CanceledError') {
                    throw error;
                }
                else if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
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
        getPrijaveZaAdmina: async function(): Promise<PrijavaZaAdminaDTO[]> {
            try {
                const response = await axiosPrivate.get("/Admin/GetPrijaveZaAdmina");
                const data: PrijavaZaAdminaDTO[] = response.data;
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
        enrolAsAdmin: async function(userId: string, role: UserType): Promise<boolean> {
            try {
                await axiosPrivate.patch(`/Admin/EnrolAsAdmin/${userId}/${role}`);
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
        rejectAdmin: async function(userId: string): Promise<boolean> {
            try {
                await axiosPrivate.patch(`/Admin/RejectAdmin/${userId}`);
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
        getAllBlockedUsers: async function(): Promise<PrijavaZaAdminaDTO[]> {
            try {
                const response = await axiosPrivate.get("/Admin/GetAllBlockedUsers");
                const data: PrijavaZaAdminaDTO[] = response.data;

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

    return AdminController;
}