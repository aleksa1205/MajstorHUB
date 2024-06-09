import { useEffect, useState } from "react";
import useAdminController from "../../../api/controllers/useAdminController";
import useLogout from "../../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";
import { NotFoundError } from "../../../api/controllers/usePosaoController";
import { SessionEndedError } from "../../../api/controllers/useUserControllerAuth";
import Cog from "../../Theme/Loaders/Cog";
import BlokiranCard from "./BlokiranCard";
import { PrijavaZaAdminaDTO } from "../../../api/DTO-s/Admin/AdminDTOs";

export default function Blokirani() {
    const [blokirani, setBlokirani] = useState<PrijavaZaAdminaDTO[] | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [notFound, setNotFound] = useState<boolean>(false);

    const { getAllBlockedUsers } = useAdminController();
    const logoutUser = useLogout();
    const { showBoundary } = useErrorBoundary();

    useEffect(() => {
        async function start() {
            try {
                setIsFetching(true);

                const data = await getAllBlockedUsers();
                setBlokirani(data);
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
    }, []);

    useEffect(() => console.log(blokirani), [blokirani]);

    return (
        <>
            <h3>Blokirani korisnici</h3>
            {notFound ? (
                <div>
                    <p>Nema blokiranih korisnika</p>
                </div>
            ) : isFetching ? (
                <div>
                    <Cog />
                </div>
            ): (
                <div>
                    {blokirani?.map(el => {
                        return (
                            <BlokiranCard key={el.userId} user={el} />
                        )
                    })}
                </div>
            )}
        </>
    )
}