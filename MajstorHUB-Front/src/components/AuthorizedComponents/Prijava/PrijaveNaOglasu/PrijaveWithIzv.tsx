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
import ZapocniPosaoForm from "../../Posao/ZapocniPosao/ZapocniPosaoForm";
import useModalAnimation from "../../../../hooks/useModalAnimation";
import UserType from "../../../../lib/UserType";
import usePopUpAnimation from "../../../../hooks/usePopUpAnimation";
import SuccessBoxAnimated from "../../../Theme/Boxes/SuccessBoxAnimated";

type PropsValues = {
    oglasId: string;
    oglasOpis: string;
    prijave: PrijavaWithIzvodjacDTO[] | null;
    setPrijave: React.Dispatch<React.SetStateAction<PrijavaWithIzvodjacDTO[] | null>>;
    oglasCena: number
}

export type IzvodjacOnPrijava = {
    izvodjacId: string;
    tipIzvodjaca: UserType;
    naziv: string;
    ponuda: number;
    prijava: string;
}

export default function PrijaveWithIzv(props: PropsValues) {
    const { oglasId, setPrijave, prijave, oglasOpis, oglasCena } = props;

    const [isFetching, setIsFetching] = useState<boolean>(prijave === null);
    const [notFound, setNotFound] = useState<boolean>(false)
    
    const { showBoundary } = useErrorBoundary();
    const logoutUser = useLogout();
    const { getByOglas } = usePrijavaController();

    const { closeModal, openModal, transition } = useModalAnimation();
    const { openMessage, closeMessage, transition: popUpTransition } = usePopUpAnimation();
    const [successMess, setSuccessMess] = useState<string>('');
    const [ izvodjac, setIzvodjac ] = useState<IzvodjacOnPrijava | null>(null)

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

    function setSuccess(message: string) {
        setSuccessMess(message)
        openMessage();
    }

    return (
        <>
            {popUpTransition((style, show) => {
                return show ? (
                    <SuccessBoxAnimated closeMessage={closeMessage} style={style}>
                        <p>{successMess}</p>
                    </SuccessBoxAnimated>
                ) : null
            })}

            {transition((style, show) => {
                return show ? (
                    <ZapocniPosaoForm close={closeModal} style={style} izvodjac={izvodjac!} oglasId={oglasId} oglasOpis={oglasOpis} cenaOglasa={oglasCena} setSuccess={setSuccess} />
                ) : null;
            })}

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
                                    <PrijavaWIthIzvCard key={prijava.id} prijava={prijava} openModal={openModal} setIzvodjac={setIzvodjac} />
                                )
                            })}                
                        </>
                    )}
                </div>
            </div>
        </>
    )
}