import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useOglasController from "../../api/controllers/useOglasController";
import useLogout from "../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";
import { useEffect, useState } from "react";
import { GetOglasDTO } from "../../api/DTO-s/Oglasi/OglasiDTO";
import { isAxiosError } from "axios";
import {
  SessionEndedError,
} from "../../api/controllers/useUserControllerAuth";
import classes from "../../components/AuthorizedComponents/Oglas/Prikaz/Prikaz.module.css";
import Hamster from "../../components/Theme/Loaders/Hamster";
import NotFoundImageUrl from "../../../pictures/not-found.png";
import OglasInfo from "../../components/AuthorizedComponents/Oglas/Prikaz/OglasInfo";
import PregledOglasa from "../../components/AuthorizedComponents/Oglas/Pregled/PregledOglasa";
import { GetKorisnikResponse } from "../../api/DTO-s/responseTypes";
import { PrijavaWithIzvodjacDTO } from "../../api/DTO-s/Prijave/PrijaveDTO";
import PrijaveWithIzv from "../../components/AuthorizedComponents/Prijava/PrijaveNaOglasu/PrijaveWithIzv";

enum NavOptions {
  Prikaz,
  Prijave,
}

export default function OglasPrikaz() {
  const { id } = useParams();

  const [oglas, setOglas] = useState<GetOglasDTO | null>(null);
  const [initialOglas, setInitialOglas] = useState<GetOglasDTO | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [notFound, setNotFound] = useState(id?.length !== 24);

  const [klijent, setKlijent] = useState<GetKorisnikResponse | null>(null);
  const [isFetchingKlijent, setIsFetchingKlijent] = useState<boolean>(true);
  const [notFoundKlijent, setNotFoundKlijent] = useState<boolean>(false);

  const [prijave, setPrijave] = useState<PrijavaWithIzvodjacDTO[] | null>(null);

  const [edit, setEdit] = useState<boolean>(false);
  const [navSelected, setNavSelected] = useState<NavOptions>(NavOptions.Prikaz);

  const {
    auth: { userId },
  } = useAuth();
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
        if (data === false) {
          setIsFetching(false);
          setNotFound(true);
          return;
        }

        setInitialOglas(data);
        setOglas(data);
        setIsOwner(data.korisnikId === userId);
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

    if (!notFound) startFetching();

    return () => controller.abort();
  }, [id]);

  return (
    <main className={`${classes.main}`}>
      {edit && setOglas !== null && (
        <PregledOglasa
          oglasData={oglas!}
          initialOglas={initialOglas!}
          updateOglas={setOglas}
          oglasId={oglas?.id}
          setEdit={setEdit}
        />
      )}
      {!edit && (
        <>
          {notFound ? (
            <div className="container">
              <div className={`${classes.center}`}>
                <img src={NotFoundImageUrl} alt="Not found" />
                <h1>Nismo pronašli oglas koji tražite :(</h1>
              </div>
            </div>
          ) : isFetching ? (
            <div className="container">
              <div className={`${classes.center}`}>
                <Hamster />
              </div>
            </div>
          ) : (
            <>
              {isOwner && <AuthorNavigation oglas={oglas!} navSelected={navSelected} setNavSelected={setNavSelected} />}
              {navSelected === NavOptions.Prikaz && (
                <OglasInfo
                  setEdit={setEdit}
                  oglas={oglas!}
                  isOwner={isOwner}
                  isFetchingKlijent={isFetchingKlijent}
                  klijent={klijent}
                  notFoundKlijent={notFoundKlijent}
                  setIsFetchingKlijent={setIsFetchingKlijent}
                  setKlijent={setKlijent}
                  setNotFoundKlijent={setNotFoundKlijent}
                />
              )}
              {navSelected === NavOptions.Prijave && (
                <PrijaveWithIzv
                  oglasId={oglas!.id}
                  oglasOpis={oglas!.opis}
                  oglasCena={oglas!.cena}
                  prijave={prijave}
                  setPrijave={setPrijave}
                />
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}

type AuthorProps = {
  setNavSelected: React.Dispatch<React.SetStateAction<NavOptions>>;
  navSelected: NavOptions;
  oglas: GetOglasDTO
};

function AuthorNavigation({ navSelected, setNavSelected, oglas: { naslov } }: AuthorProps) {
  return (
    <div className={`container`}>
      <section className={classes.authorNavCont}>
        <h3>{naslov}</h3>
        <div className={classes.authorNav}>
          <div
            className={navSelected === NavOptions.Prikaz ? classes.active : ""}
            onClick={() => setNavSelected(NavOptions.Prikaz)}
          >
            Pregledaj Oglas
          </div>
          <div
            className={navSelected === NavOptions.Prijave ? classes.active : ""}
            onClick={() => setNavSelected(NavOptions.Prijave)}
          >
            Pogledaj Prijave
          </div>
        </div>
      </section>
    </div>
  );
}