import { useEffect, useState } from "react";
import { PrijavaWithIzvodjacDTO } from "../../../../api/DTO-s/Prijave/PrijaveDTO";
import { SessionEndedError } from "../../../../api/controllers/useUserControllerAuth";
import { useErrorBoundary } from "react-error-boundary";
import useLogout from "../../../../hooks/useLogout";
import usePrijavaController from "../../../../api/controllers/usePrijavaController";
import { CanceledError } from "axios";
import NoDataImgUrl from '../../../../../pictures/nodata.png';
import PrijavaWIthIzvCard from "./PrijavaWithIzvCard";
import classes from './PrijaveWithIzv.module.css'
import Planet from "../../../Theme/Loaders/Planet";

type PropsValues = {
    oglasId: string;
    prijave: PrijavaWithIzvodjacDTO[] | null;
    setPrijave: React.Dispatch<React.SetStateAction<PrijavaWithIzvodjacDTO[] | null>>;
}


export default function PrijaveWithIzv(props: PropsValues) {
    const { oglasId, setPrijave, prijave} = props;

    const [isFetching, setIsFetching] = useState<boolean>(prijave === null);
    const [notFound, setNotFound] = useState<boolean>(false)
    
    const { showBoundary } = useErrorBoundary();
    const logoutUser = useLogout();
    const { getByOglas } = usePrijavaController();

    useEffect(() => {
        const controller = new AbortController();

        async function startFetching() {
            try {
                setIsFetching(true);

                const data = await getByOglas(oglasId, controller)
                if(data === false) {
                    setNotFound(true);
                    setIsFetching(false);
                    return;
                }

                setPrijave(data);
                setIsFetching(false);
                
            } catch (error) {
                if(error instanceof CanceledError)
                    null;
                else if(error instanceof SessionEndedError) {
                    logoutUser();
                    setIsFetching(false);
                }
                else {
                    showBoundary(error);
                    setIsFetching(false);
                }
            }
        }

        if(!prijave)
            startFetching();

        return () => {
            controller.abort();
        };
    }, []);

    // useEffect(() => console.log(isFetching), [isFetching])

    return (
        <div className="container">
            <div className={classes.main}>
                {notFound ? (
                    <div className={classes.centerMax}>
                        <img src={NoDataImgUrl} alt="No Data" />
                        <h3>Još nemate nijednu prijavu</h3>
                        <p>Budite strpljivi i neko će se prijaviti na vaš oglas, ali ukoliko je prošlo nedelju dana bez prijave, promenite vaš oglas.</p>
                    </div>
                ) : isFetching ? (
                    <div className={classes.center}>
                        <Planet />
                    </div>
                ) : (
                    <>
                        <p>Broj Prijava: <span className={classes.bold}>{prijave?.length}</span></p>
                        {prijave?.map(prijava => {
                            return (
                                <PrijavaWIthIzvCard key={prijava.id} prijava={prijava} />
                            )
                        })}                
                    </>
                )}
            </div>
        </div>
    )
}