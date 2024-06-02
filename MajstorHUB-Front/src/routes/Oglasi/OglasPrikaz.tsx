import { useParams } from "react-router-dom"
import useAuth from "../../hooks/useAuth";
import useOglasController from "../../api/controllers/useOglasController";
import useLogout from "../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";
import { useEffect, useState } from "react";
import { GetOglasDTO } from "../../api/DTO-s/Oglasi/OglasiDTO";
import { isAxiosError } from "axios";
import { SessionEndedError } from "../../api/controllers/useUserControllerAuth";
import classes from '../../components/AuthorizedComponents/Oglas/Prikaz/Prikaz.module.css';
import Hamster from "../../components/Theme/Loaders/Hamster";
import NotFoundImageUrl from '../../../pictures/not-found.png';
import OglasInfo from "../../components/AuthorizedComponents/Oglas/Prikaz/OglasInfo";
import PregledOglasa from "../../components/AuthorizedComponents/Oglas/Pregled/PregledOglasa";

export default function OglasPrikaz() {
    const { id } = useParams();

    const [oglas, setOglas] = useState<GetOglasDTO | null>(null);
    const [initialOglas, setInitialOglas] = useState<GetOglasDTO | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [notFound, setNotFound] = useState(id?.length !== 24);

    const [edit, setEdit] = useState<boolean>(false);

    const { auth: { userId }} = useAuth();
    const { getByIdDto } = useOglasController();
    const logoutUser = useLogout();
    const { showBoundary } = useErrorBoundary();
    
    const [isOwner, setIsOwner] = useState<boolean>(false);

    useEffect(() => {
        const controller = new AbortController();

        async function startFetching() {
            try {
                setIsFetching(true);

                const data = await getByIdDto(id!, controller);
                if(data === false) {
                    setIsFetching(false);
                    setNotFound(true);
                    return;
                }

                setInitialOglas(data);
                setOglas(data);
                setIsOwner(data.korisnikId === userId)
                setIsFetching(false);
            } catch (error) {
                if (isAxiosError(error) && error.name === "CanceledError") {
                    console.log("GetById zahtev canceled");
                  } else if (error instanceof SessionEndedError) {
                    logoutUser();
                    setIsFetching(false);
                  } else {
                    setIsFetching(false);
                    showBoundary(error);
                  }
            }
        }

        if(!notFound)
            startFetching();

        return () => controller.abort();
    }, [id]);

    return (
      <main className={`${classes.main}`}>
          {(edit && setOglas !== null) && (
            <PregledOglasa oglasData={oglas!} initialOglas={initialOglas!} updateOglas={setOglas} oglasId={oglas?.id} setEdit={setEdit} />
          )}
        {!edit && (
          <>
            {notFound ? (
              <div className='container'>
                  <div className={`${classes.center}`}>
                    <img src={NotFoundImageUrl} alt="Not found" />
                  <h1>Nismo pronašli oglas koji tražite :(</h1>
                  </div>
              </div>
            ) : isFetching ? (
              <div className='container'>
                  <div className={`${classes.center}`}>
                      <Hamster />
                  </div>
              </div>
            ) : (
              <>
                <OglasInfo setEdit={setEdit} oglas={oglas!} isOwner={isOwner} />
              </>
            )}
          </>
        )}
      </main>
    )
}