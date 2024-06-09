import { useEffect, useState } from "react"
import { GetByZapocetiDTO } from "../../../../api/DTO-s/Posao/PosloviDTO";
import usePosaoController, { NotFoundError } from "../../../../api/controllers/usePosaoController";
import { useErrorBoundary } from "react-error-boundary";
import useLogout from "../../../../hooks/useLogout";
import { SessionEndedError } from "../../../../api/controllers/useUserControllerAuth";
import ZapocetiCard from "./ZapocetiCard";
import classes from './Zapoceti.module.css'
import Lottie from "react-lottie";
import loader from '../../../../../pictures/animations/loaderCircle.json';
import addAnimation from '../../../../../pictures/animations/add.json';
import searchAnimation from '../../../../../pictures/animations/searching.json';
import { Link } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import UserType from "../../../../lib/UserType";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { defaultResponsive } from "../../../Theme/CarouselConfig/CarouselConfig";
import { isAxiosError } from "axios";
import useModalAnimation from "../../../../hooks/useModalAnimation";
import ZavrsiPosaoForm from "../ZavrsiPosao/ZavrsiPosaoForm";
import usePopUpMessage from "../../../../hooks/usePopUpMessage";

export default function ZapocetiPoslovi() {
    const { auth: { userType } } = useAuth();

    const [poslovi, setPoslovi] = useState<GetByZapocetiDTO[] | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [increment, setIncrement] = useState<number>(0);

    const { getByUserZapoceti } = usePosaoController();
    const { showBoundary } = useErrorBoundary();
    const logoutUser = useLogout();

    const { closeModal, openModal, transition } = useModalAnimation();
    const [selectedPosao, setSelectedPosao] = useState<GetByZapocetiDTO | null>(null);

    const loaderOptions = {
        loop: true,
        autoplay: true,
        animationData: loader,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    }
    const addOptions = {
        loop: true,
        autoplay: true,
        animationData: addAnimation,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    }
    const searchOptions = {
        loop: true,
        autoplay: true,
        animationData: searchAnimation,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    }

    function refetchPoslovi() {
        setIncrement(prev => prev + 1);
    }

    useEffect(() => {
        const controller = new AbortController();

        async function startFetching() {
            try {
                setIsFetching(true);

                const data = await getByUserZapoceti(controller);
                setPoslovi(data);

                setIsFetching(false);
            } catch (error) {
                if (error instanceof SessionEndedError) {
                    logoutUser();
                    setIsFetching(false);
                }
                else if (error instanceof NotFoundError) {
                    setIsFetching(false);
                    setNotFound(true);
                }
                else if (isAxiosError(error) && error.name === 'CanceledError') {

                }
                else {
                    setIsFetching(false)
                    showBoundary(error);
                }
            }
        }

        startFetching();

        return () => {
            controller.abort();
        }
    }, [increment]);

    // useEffect(() => console.log(isFetching), [isFetching]);

    function openZavrsi(posao: GetByZapocetiDTO) {
        setSelectedPosao(posao);
        openModal();
    }

    const { PopUpComponent, setPopUpMessage } = usePopUpMessage();

    return (
        <>
            <PopUpComponent />

            {transition((style, show) => {
                return show ? (
                    <ZavrsiPosaoForm setPopUpMessage={setPopUpMessage} style={style} posao={selectedPosao!} close={closeModal} refetchPoslovi={refetchPoslovi} />
                ) : null;
            })}

            {isFetching ? (
                <div className={classes.kontinjer}>
                    <Lottie options={loaderOptions} width='8rem' height='8rem' />
                </div>
            ): (
                <div className={classes.cards}>
                    <Carousel 
                        responsive={defaultResponsive}
                        className={classes.carousel}
                    >
                        {poslovi?.map(posao => {
                            return (
                                <ZapocetiCard key={posao.naslov} posao={posao} openZavrsi={openZavrsi} />
                            )
                        })}

                        {userType === UserType.Korisnik && (
                            <Link to='/postavi-oglas' className={classes.novPosaoCard}>
                                <div>
                                    <Lottie options={addOptions} width='4rem' height='4rem' />
                                    <h4>Kreirajte novi oglas</h4>
                                    <p>Kreirajte novi oglas i dobićete prijave od strane izvođača.</p>
                                </div>
                                <div>
                                    <button className="secondaryButtonSmall">Postavi oglas</button>
                                </div>
                            </Link>
                        )}
                        {(userType === UserType.Majstor || userType === UserType.Firma) && (
                            <Link to='/oglasi' className={classes.novPosaoCard}>
                                <div>
                                    <Lottie options={searchOptions} width='5rem' height='5rem' />
                                    <h4 className={classes.naslov}>Pretražite oglase</h4>
                                    <p>Pretražite oglase kako biste pronašli posao.</p>
                                </div>
                                <div className={classes.izvodjacBtn}>
                                    <button className="secondaryButtonSmall">Pretražite oglase</button>
                                </div>
                            </Link>
                        )}
                    </Carousel>
                </div>
                
            )}
        </>
    )
}