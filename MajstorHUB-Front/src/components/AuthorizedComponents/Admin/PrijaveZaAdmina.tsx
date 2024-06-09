import { useEffect, useState } from "react"
import { PrijavaZaAdminaDTO } from "../../../api/DTO-s/Admin/AdminDTOs";
import useAdminController from "../../../api/controllers/useAdminController";
import useLogout from "../../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";
import { SessionEndedError } from "../../../api/controllers/useUserControllerAuth";
import { NotFoundError } from "../../../api/controllers/usePosaoController";
import Cog from "../../Theme/Loaders/Cog";
import PrijavaCard from "./PrijavaCard";
import { PopUpMessage } from "../../../hooks/usePopUpMessage";

type PropsValues = {
    setPopUpMessage: React.Dispatch<React.SetStateAction<PopUpMessage | null>>;
}

export default function PrijaveZaAdmina({ setPopUpMessage }: PropsValues) {
    const [prijave, setPrijave] = useState<PrijavaZaAdminaDTO[] | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [notFound, setNotFound] = useState<boolean>(false);

    const { getPrijaveZaAdmina } = useAdminController();
    const logoutUser = useLogout();
    const { showBoundary } = useErrorBoundary();

    const [increment, setIncrement] = useState<number>(0);
    function refetch() {
        setIncrement(prev => prev + 1);
    }

    useEffect(() => {
        async function start() {
            try {
                setIsFetching(true);

                const data = await getPrijaveZaAdmina();
                setPrijave(data);
            } catch (error) {
                if(error instanceof NotFoundError)
                    setNotFound(true);
                else if(error instanceof SessionEndedError) {
                    logoutUser();
                }
                else
                    showBoundary(error);
            }
            finally {
                setIsFetching(false);
            }
        }

        start();
    }, [increment]);

    return (
        <>
            <h3>Prijave za admina</h3>
            {notFound ? (
                <div>
                    <p>Nema prijava za admina</p>
                </div>
            ) : isFetching ? (
                <div>
                    <Cog />
                </div>
            ): (
                <div>
                    {prijave?.map(el => {
                        return (
                            <PrijavaCard key={el.userId} prijava={el} setPopUpMessage={setPopUpMessage} refetch={refetch} />
                        )
                    })}
                </div>
            )}
        </>
    )
}