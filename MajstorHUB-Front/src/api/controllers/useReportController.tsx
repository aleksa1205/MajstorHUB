import { isAxiosError } from "axios";
import useAuth from "../../hooks/useAuth"
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { CreateReportDTO, ReportDto } from "../DTO-s/Report/ReportDTOs";
import { NotFoundError } from "./usePosaoController";

export default function useReportController() {
    const { auth: { userType } } = useAuth();
    const axiosPrivate = useAxiosPrivate(userType);

    const ReportController = {
        report: async function (report: CreateReportDTO): Promise<boolean> {
            try {
                await axiosPrivate.post('Report/Report',
                    JSON.stringify(report),
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
        getAll: async function (): Promise<ReportDto[]> {
            try {
                const response = await axiosPrivate.get("Report/GetAll");
                const data: ReportDto[] = response.data;

                for(let el of data) {
                    el.datumPrijave = new Date(el.datumPrijave);
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
        deleteReport: async function (id: string): Promise<boolean> {
            try {
                await axiosPrivate.delete("Report/DeleteReport/" + id);
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
        }
    }

    return ReportController;
}