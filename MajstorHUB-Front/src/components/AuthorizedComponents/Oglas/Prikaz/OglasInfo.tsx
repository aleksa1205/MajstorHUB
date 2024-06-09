import { IoLocationOutline, IoPricetagOutline } from "react-icons/io5";
import {
  GetOglasDTO,
  StatusOglasa,
  getDuzinaPoslaDisplayName,
} from "../../../../api/DTO-s/Oglasi/OglasiDTO";
import {
  formatDate,
  formatDateBefore,
  formatDoubleWithWhite,
} from "../../../../lib/utils";
import classes from "./OglasInfo.module.css";
import formClasses from "../../../FormStyles/Form.module.css";
import {
  GetKorisnikResponse,
  Iskustvo,
  getStrukaDisplayName,
} from "../../../../api/DTO-s/responseTypes";
import { GiRank1, GiRank2, GiRank3 } from "react-icons/gi";
import { LuCalendarCheck2, LuPencil } from "react-icons/lu";
import useCurrUser from "../../../../hooks/useCurrUser";
import usePopUpAnimation from "../../../../hooks/usePopUpAnimation";
import InfoBoxAnimated from "../../../Theme/Boxes/InfoBoxAnimated";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserControllerAuth, {
  SessionEndedError,
} from "../../../../api/controllers/useUserControllerAuth";
import UserType from "../../../../lib/UserType";
import { isAxiosError } from "axios";
import useLogout from "../../../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";
import Cog from "../../../Theme/Loaders/Cog";
import useAuth from "../../../../hooks/useAuth";
import { MdDeleteOutline } from "react-icons/md";
import useModalAnimation from "../../../../hooks/useModalAnimation";
import DeleteForm from "./DeleteForm";
import { TransitionFn } from "@react-spring/web";
import PrijaviSeForm from "../../Prijava/PrijaviSe/PrijaviSeForm";
import SuccessBoxAnimated from "../../../Theme/Boxes/SuccessBoxAnimated";
import ObrisiPrijavuForm from "../../Prijava/ObrisiPrijavu/ObrisiPrijavuForm";

type PropsValues = {
  oglas: GetOglasDTO;
  isOwner: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setKlijent: React.Dispatch<React.SetStateAction<GetKorisnikResponse | null>>;
  klijent: GetKorisnikResponse | null;
  isFetchingKlijent: boolean;
  setIsFetchingKlijent: React.Dispatch<React.SetStateAction<boolean>>;
  notFoundKlijent: boolean;
  setNotFoundKlijent: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function OglasInfo({
  oglas,
  isOwner,
  setEdit,
  isFetchingKlijent,
  klijent,
  setIsFetchingKlijent,
  setKlijent,
  notFoundKlijent,
  setNotFoundKlijent,
}: PropsValues) {
  const navigate = useNavigate();
  const {
    auth: { userType },
  } = useAuth();

  const {
    closeModal,
    openModal,
    transition: transition2,
  } = useModalAnimation();

  const { transition: prijavaDelTrans, closeModal: zatvoriPrijavu, openModal: openDelPrijava } = useModalAnimation();
  const { closeModal: closeModal2, transition, openModal: openPrijava } = useModalAnimation();
  const { transition: popUp, openMessage, closeMessage } = usePopUpAnimation();
  const [successMessage, setSuccessMessage] = useState<string>('');

  const { id } = useParams();
  const oglasId = id ?? '';
  const { userData } = useCurrUser();
  const [oglasi, setOglasi] = useState<string[]>(userData ? userData.oglasi : []);

  const [isPrijavljen, setIsPrijavljen] = useState<boolean>(oglasi.includes(oglasId));

  useEffect(() => {
    setOglasi(userData ? userData.oglasi : []);
  }, [userData])
  useEffect(() => {
    setIsPrijavljen(oglasi.includes(oglasId));
  }, [oglasi])

  function goBackHandler() {
    navigate(-1);
  }

  useEffect(() => {
    if(successMessage === '')
      return;
    openMessage();
  }, [successMessage])

  return (
    <>
      {prijavaDelTrans((style, show) => {
        return show ? (
          <ObrisiPrijavuForm setSuccessMessage={setSuccessMessage} close={zatvoriPrijavu} style={style} oglasId={oglas.id} />
        ) : null;
      })}

      {popUp((style, show) => {
        return show ? (
          <>
            <SuccessBoxAnimated closeMessage={closeMessage} style={style}>
              <p>{successMessage}</p>
            </SuccessBoxAnimated>
          </>
        ) : null;
      })}

      {transition2((style, show) => {
        return show ? (
          <DeleteForm oglasId={oglas.id} style={style} close={closeModal} />
        ) : null;
      })}

      {transition((style, show) => {
        return show ? (
          <PrijaviSeForm setSuccessMessage={setSuccessMessage} close={closeModal2} style={style} />
        ) : null;
      })}

      <div className={`container`}>
          <div className={classes.main}>
            <div>

              <FirstSection oglas={oglas} isOwner={isOwner} />
              <OpisSection oglas={oglas} />
              <SpecificationSection oglas={oglas} />
              <VestineSection oglas={oglas} />
            </div>
            <AsideSection
              isFetchingKlijent={isFetchingKlijent}
              klijent={klijent}
              notFoundKlijent={notFoundKlijent}
              setIsFetchingKlijent={setIsFetchingKlijent}
              setKlijent={setKlijent}
              setNotFoundKlijent={setNotFoundKlijent}
              closeModal={closeModal}
              openModal={openModal}
              transition2={transition2}
              setEdit={setEdit}
              oglas={oglas}
              isOwner={isOwner}
              openPrijava={openPrijava}
              isPrijavljen={isPrijavljen}
              openDelPrijava={openDelPrijava}
            />
          </div>
      </div>

      {(userType !== UserType.Korisnik && oglas.status === StatusOglasa.Otvoren) && (
        <footer className={classes.footer}>
          <button onClick={goBackHandler} className="secondaryButtonSmall">
            Nazad
          </button>
          {!isPrijavljen && (
            <button onClick={openPrijava} className="mainButtonSmall">Prijavi Se</button>
          )}
          {isPrijavljen && (
            <button onClick={openDelPrijava} className="mainButtonSmall">Obriši prijavu</button>
          )}
        </footer>
      )}
      {(userType === UserType.Korisnik && isOwner && oglas.status === StatusOglasa.Otvoren) && (
        <footer className={classes.footer}>
          <button onClick={openModal} className="secondaryButtonSmall">
            Zatvori Oglas
          </button>
          <button onClick={() => setEdit(true)} className="mainButtonSmall">
            Izmeni Oglas
          </button>
        </footer>
      )}
      {userType === UserType.Korisnik && !isOwner && (
        <footer className={classes.footer}>
          <button onClick={goBackHandler} className="secondaryButtonSmall">
            Nazad
          </button>
          <button className={`mainButtonSmall`}>
            <Link to="/postavi-oglas">Postavite Oglas</Link>
          </button>
        </footer>
      )}
    </>
  );
}

type SectionProps = {
  oglas: GetOglasDTO;
  isOwner?: boolean;
  setEdit?: React.Dispatch<React.SetStateAction<boolean>>;
};

type AsideProps = {
  oglas: GetOglasDTO;
  isOwner: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  closeModal: () => void;
  openModal: () => void;
  transition2: TransitionFn<
    boolean,
    {
      t: number;
      bot: string;
      scale: number;
      botSmall: string;
    }
  >;
  setKlijent: React.Dispatch<React.SetStateAction<GetKorisnikResponse | null>>;
  klijent: GetKorisnikResponse | null;
  isFetchingKlijent: boolean;
  setIsFetchingKlijent: React.Dispatch<React.SetStateAction<boolean>>;
  notFoundKlijent: boolean;
  setNotFoundKlijent: React.Dispatch<React.SetStateAction<boolean>>;
  openPrijava: () => void;
  isPrijavljen: boolean;
  openDelPrijava: () => void
};

function AsideSection({
  oglas: { korisnikId, status },
  isOwner,
  setEdit,
  openModal,
  isFetchingKlijent: isFetching,
  klijent,
  notFoundKlijent: notFound,
  setIsFetchingKlijent: setIsFetching,
  setKlijent,
  setNotFoundKlijent: setNotFound,
  openPrijava,
  isPrijavljen,
  openDelPrijava
}: AsideProps) {
  const { userData } = useCurrUser();
  const { openMessage, closeMessage, transition } = usePopUpAnimation();
  const currUrl = window.location.href;

  const { getById } = useUserControllerAuth(UserType.Korisnik);

  const logoutUser = useLogout();
  const { showBoundary } = useErrorBoundary();
  const { auth } = useAuth();

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const data = await getById(korisnikId, controller);
        if (data === false) {
          setNotFound(true);
          setIsFetching(false);
          return;
        }

        setKlijent(data as GetKorisnikResponse);
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

    if(!klijent)
        fetchData();

    return () => controller.abort();
  }, []);

  const { ime, prezime, datumKreiranjaNaloga, potroseno, adresa } =
    klijent ?? {};

  function copyToClipboard() {
    openMessage();
    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <>
      {transition((style, show) => {
        return show ? (
          <InfoBoxAnimated style={style} closeMessage={closeMessage}>
            <p>Link oglasa kopiran u clipboard</p>
          </InfoBoxAnimated>
        ) : null;
      })}

      <section className={classes.asideSec}>
        {!isOwner && auth.userType !== UserType.Korisnik && (
          <>
            {(!isPrijavljen && status === StatusOglasa.Otvoren) && (
              <>
                <button onClick={openPrijava} className={`mainButtonSmall ${classes.prijaviBtn}`}>
                  Prijavi se na oglas
                </button>
                <div className={classes.small}>
                  <p>Minimalno potrebno za prijavu: 30 RSD</p>
                  <p>
                    Vaše stanje:{" "}
                    {userData ? formatDoubleWithWhite(userData?.novacNaSajtu) : 0}{" "}
                    RSD
                  </p>
                </div>
              </>
            )}
            {(isPrijavljen && status === StatusOglasa.Otvoren) && (
              <>
                <div className={classes.smallNoMargin}>
                  <p>Već ste se prijavili na ovaj oglas</p>
                </div>
                <button onClick={openDelPrijava} className={`mainButtonSmall ${classes.prijaviBtn}`}>
                  Obriši prijavu
                </button>
              </>
            )}
            
          </>
        )}
        {!isOwner && auth.userType === UserType.Korisnik && (
          <div className={classes.notOwnerOptions}>
            <div className={classes.smallNoMargin}>
              <p>Sviđa vam se ovakav oglas?</p>
            </div>
            <button className={`mainButtonSmall ${classes.prijaviBtn}`}>
              <Link to="/postavi-oglas">Postavite i Vi ovakav oglas</Link>
            </button>
          </div>
        )}
        {(isOwner && status === StatusOglasa.Otvoren) && (
          <div className={classes.ownerOptions}>
            <div className={classes.btnContainer}>
              <LuPencil />
              <button onClick={() => setEdit!(true)} className="secondLink">
                Izmeni oglas
              </button>
            </div>
            <div
              className={`${classes.btnContainer} ${classes.btnContainerLast}`}
            >
              <MdDeleteOutline size="1.1rem" />
              <button onClick={openModal} className="secondLink">
                Zatvori oglas
              </button>
            </div>
          </div>
        )}
        <h4>Više o klijentu</h4>
        {notFound ? (
          <p>
            Nismo pronašli klijenta vezanog za ovaj oglas, pokušajte ponovo ili
            kontaktirajte korisnički servis
          </p>
        ) : isFetching ? (
          <Cog />
        ) : (
          <>
            <div className={classes.small}>
              <p>
                {ime} {prezime}
              </p>
              <p>{formatDoubleWithWhite(potroseno!)} RSD Potrošeno</p>
              <p>Član još od: {formatDate(datumKreiranjaNaloga!)}</p>
              <div>
                <IoLocationOutline />
                <p>{adresa}</p>
              </div>
            </div>
          </>
        )}

        <div className={classes.oglasLink}>
          <h4>Link ovog posla</h4>
          <input
            className={formClasses.input}
            type="text"
            disabled={true}
            value={currUrl}
          />
          <div onClick={copyToClipboard} className="secondLink">
            Kopiraj Link
          </div>
        </div>
      </section>
    </>
  );
}

function FirstSection({
  oglas: { datumKreiranja, naslov, lokacija }, isOwner
}: SectionProps) {
  return (
    <section className={`${classes.firstSec} ${classes.section}`}>
      {!isOwner && <h3>{naslov}</h3>}
      <div>
        <p>Postavljeno {formatDateBefore(datumKreiranja)}</p>
        {lokacija && (
          <div>
            <IoLocationOutline />
            <p>{lokacija}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function OpisSection({ oglas: { opis } }: SectionProps) {
  return (
    <section className={`${classes.opisSec} ${classes.section}`}>
      <div>{opis}</div>
    </section>
  );
}

function SpecificationSection({
  oglas: { iskustvo, duzinaPosla, cena },
}: SectionProps) {
  let icon = <></>;
  let msg = "";
  const size = "1.6rem";
  switch (iskustvo) {
    case Iskustvo.Pocetnik:
      icon = <GiRank1 size={size} />;
      msg = "Tražim nekog ko je relativno nov u ovoj oblasti";
      break;
    case Iskustvo.Iskusan:
      icon = <GiRank2 size={size} />;
      msg = "Tražim nekog ko ima značajno iskustvo u ovoj oblasti";
      break;
    case Iskustvo.Profesionalac:
      icon = <GiRank3 size={size} />;
      msg = "Tražim nekog ko ima duboko znanje iz ove oblasti";
      break;
  }

  return (
    <section className={`${classes.specSec} ${classes.section}`}>
      <div>
        <IoPricetagOutline size="1.5rem" />
        <div>
          <span>{formatDoubleWithWhite(cena)} RSD</span>
          <span>Cena</span>
        </div>
      </div>
      <div>
        {icon}
        <div>
          <span>{Iskustvo[iskustvo]}</span>
          <span>{msg}</span>
        </div>
      </div>
      <div>
        <LuCalendarCheck2 size="1.5rem" />
        <div>
          <span>{getDuzinaPoslaDisplayName(duzinaPosla)}</span>
          <span>Dužina posla</span>
        </div>
      </div>
    </section>
  );
}

function VestineSection({ oglas: { struke } }: SectionProps) {
  return (
    <section className={`${classes.vestineSec} ${classes.section}`}>
      <h4>Veštine i Stručnost</h4>
      <div className={formClasses.vestine}>
        {struke.map((struka) => {
          return (
            <div key={struka} className={formClasses.vestina}>
              {getStrukaDisplayName(struka)}
            </div>
          );
        })}
      </div>
    </section>
  );
}
