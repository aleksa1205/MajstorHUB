import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import classes from '../../components/AuthorizedComponents/FilterUsers/FilterUser.module.css';
import Hand from "../../components/Theme/Loaders/Hand";
import NotFound from '../../../pictures/serach no data.jpg';
import { GetOglasDTO } from "../../api/DTO-s/Oglasi/OglasiDTO";
import FilerOglasForm from "../../components/AuthorizedComponents/Oglas/Filter/FilterOglasForm";
import OglasCard from "../../components/AuthorizedComponents/Oglas/Filter/OglasCard";

export default function Oglasi() {
    const [oglasi, setOglasi] = useState<GetOglasDTO[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const { auth } = useAuth();


    return (
        <main className={`${classes.main} container`}>
            <FilerOglasForm isFetching={isFetching} setIsFetching={setIsFetching} setOglasi={setOglasi} />
            {isFetching && (
                <div className={classes.center}>
                    <Hand />
                </div>
            )}
            {(oglasi.length === 0 && !isFetching) && (
                <div className={classes.notFoundCont}>
                    <img src={NotFound} alt="Not Found" />
                    <h3>Nema rezultata koji odgovaraju vašem pretraživanju.</h3>
                    <p>Molimo pokušajte da modifikujete svoje pretraživanje kako biste dobili više rezultata.</p>
                </div>
            )}
            <div className={classes.userCards}>
                {!isFetching && oglasi.map(oglas => {
                    return <OglasCard key={oglas.id} oglasData={oglas} currUserId={auth.userId} />
                })}
            </div>
        </main>
    )
}