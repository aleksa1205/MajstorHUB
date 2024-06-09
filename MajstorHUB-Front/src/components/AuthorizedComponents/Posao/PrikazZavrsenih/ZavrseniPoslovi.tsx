import { useEffect, useState } from "react";
import classes from "./Zavrseni.module.css";
import { GetZavrseniPosloviDTO } from "../../../../api/DTO-s/Posao/PosloviDTO";
import usePosaoController, { NotFoundError } from "../../../../api/controllers/usePosaoController";
import useLogout from "../../../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";
import UserType from "../../../../lib/UserType";
import { SessionEndedError } from "../../../../api/controllers/useUserControllerAuth";
import { isAxiosError } from "axios";
import Cog from "../../../Theme/Loaders/Cog";
import { useParams } from "react-router-dom";
import ZavrsenCard from "./ZavrsenCard";

type PropsValues = {
    userType: UserType;
    openPopUp(posao: GetZavrseniPosloviDTO): void
}

export default function ZavrseniPoslovi({  userType, openPopUp }: PropsValues) {
    const { id } = useParams();
    const [poslovi, setPoslovi] = useState<GetZavrseniPosloviDTO[] | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [notFound, setNotFound] = useState<boolean>(false);

    const { getByUserZavrseni } = usePosaoController();
    const logoutUser = useLogout();
    const { showBoundary } = useErrorBoundary();

    useEffect(() => {
        const controller = new AbortController();

        async function StartFetching() {
            try {
                setIsFetching(true);

                if(!id)
                    throw new Error("Neuspesno citanje userId is params");
    
                const data = await getByUserZavrseni(id, userType, controller);
    
                setPoslovi(data);
                setIsFetching(false);
                
            } catch (error) {
                if (error instanceof SessionEndedError) {
                    logoutUser();
                    setIsFetching(false);
                }
                else if (error instanceof NotFoundError) {
                    setNotFound(true);
                    setIsFetching(false);
                }
                else if (isAxiosError(error) && error.name === 'CanceledError') {

                }
                else {
                    showBoundary(error);
                    setIsFetching(false);
                }
            }
        }

        StartFetching();

        return () => controller.abort();
    }, []);

    // useEffect(() => console.log(poslovi), [poslovi]);

    return (
        <>
            {notFound ? (
                <div style={{paddingInline: '2rem'}}>
                    Nema poslova
                </div>
            ) : isFetching ? (
                <>
                    <Cog />
                </>
            ) : (
                <>
                    {poslovi?.map(el => {
                        return (
                            <ZavrsenCard key={el.detaljiPosla.naslov} posao={el} openPopUp={openPopUp} userType={userType} />
                        )
                    })}
                </>
            )}
        </>
    )
}