import { useState } from "react";
import classes from "../components/AuthorizedComponents/Novac/Novac.module.css";
import Hamster from "../components/Theme/Loaders/Hamster";
import RadioCard from "../components/Theme/RadioCard/RadioCard";
import useCurrUser from "../hooks/useCurrUser";
import { useLoaderData } from "react-router-dom";
import UplatiNovac from "../components/AuthorizedComponents/Novac/UplatiNovac";
import IsplatiNovac from "../components/AuthorizedComponents/Novac/IsplatiNovac";
import SuccessBox from "../components/Theme/Boxes/SuccessBox";
import { formatDoubleWithWhite } from "../lib/utils";

export function loader({ request }: any) {
  const url = new URL(request.url);
  return url.searchParams.get("tip");
}

function Novac() {
  const { isFetching, userData, refetchUser } = useCurrUser();
  const izborString = useLoaderData();
  let izbor: number = -1;
  if (izborString === "uplata") izbor = 0;
  else if (izborString === "podizanje") izbor = 1;
  const [selected, setSelected] = useState<number>(izbor);
  const [succMessage, setSuccMessage] = useState<string>('');

  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.currentTarget.value);

    setSelected(value);
    setSuccMessage('')
  }

  return (
    <div className="container">
      {succMessage !== '' && (
        <SuccessBox >
          <p>{succMessage}</p>
        </SuccessBox>
      )}

      {isFetching && (
        <div className={classes.center}>
          <Hamster />
        </div>
      )}

      {!isFetching && (
        <main className={`${classes.main}`}>

          <h3>Trenutno Stanje na Profilu</h3>

          <p>
            <span className={classes.bold}>Trenutno novca</span>
          </p>
          <p className={classes.gray}>
            {formatDoubleWithWhite(userData!.novacNaSajtu)} dinara
          </p>

          <div className={classes.section}>
            <p>
              <span className={classes.bold}>Izaberite Opciju</span>
            </p>
            <div className={classes.options}>
              <RadioCard
                naslov="Uplati Novac"
                opis="Uplata je brza i jednostavna."
              >
                <input
                  name="izbor"
                  value={0}
                  type="radio"
                  onChange={changeHandler}
                  checked={selected === 0}
                />
              </RadioCard>
              <RadioCard
                naslov="Podigni Novac"
                opis="Isplata je sigurna i brza."
              >
                <input
                  name="izbor"
                  value={1}
                  type="radio"
                  onChange={changeHandler}
                  checked={selected === 1}
                />
              </RadioCard>
            </div>
          </div>

          {selected === 0 && (
            <UplatiNovac
              currAmount={userData!.novacNaSajtu}
              refetch={refetchUser!}
              setSuccMessage={setSuccMessage}
            />
          )}
          {selected === 1 && (
            <IsplatiNovac
              currAmount={userData!.novacNaSajtu}
              refetch={refetchUser!}
              setSuccMessage={setSuccMessage}
            />
          )}
        </main>
      )}
    </div>
  );
}

export default Novac;