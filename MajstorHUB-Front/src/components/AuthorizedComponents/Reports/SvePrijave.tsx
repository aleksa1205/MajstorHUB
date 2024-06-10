import { useEffect, useState } from "react";
import useReportController from "../../../api/controllers/useReportController";
import { useErrorBoundary } from "react-error-boundary";
import { ReportDto } from "../../../api/DTO-s/Report/ReportDTOs";
import { NotFoundError } from "../../../api/controllers/usePosaoController";
import Cog from "../../Theme/Loaders/Cog";
import PrijavaCard from "./PrijavaCard";
import usePopUpMessage from "../../../hooks/usePopUpMessage";

export default function SvePrijave() {
    const [reports, setReports] = useState<ReportDto[] | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [increment, setIncrement] = useState<number>(0);

    function refetch() {
        setIncrement(prev => prev + 1);
    }

    const { getAll } = useReportController();
    const { showBoundary } = useErrorBoundary();

    useEffect(() => {
        async function start() {
            try {
                setIsFetching(true);

                const data = await getAll();
                setReports(data);
            } catch (error) {
                if(error instanceof NotFoundError)
                    setNotFound(true);
                else
                    showBoundary(error);
            }
            finally {
                setIsFetching(false);
            }
        }

        start();
    }, [increment]);

    const { PopUpComponent, setPopUpMessage } = usePopUpMessage();

    return (
        <>
            <PopUpComponent />
            <h3>Prijava korisnika</h3>
            {notFound ? (
                <div>
                    <p>Nema prijava</p>
                </div>
            ) : isFetching ? (
                <div>
                    <Cog />
                </div>
            ): (
                <div>
                    {reports?.map(el => {
                        return (
                            <PrijavaCard key={el.inicijator + el.prijavljeni + el.opis} refetch={refetch} prijava={el} setPopUpMessage={setPopUpMessage} />
                        )
                    })}
                </div>
            )}
        </>
    )
}