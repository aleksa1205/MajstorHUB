import { useState } from "react";
import classes from "../components/AuthorizedComponents/Novac/Novac.module.css";
import formCl from "../components/FormStyles/Form.module.css";
import Hamster from "../components/Theme/Loaders/Hamster";
import RadioCard from "../components/Theme/RadioCard/RadioCard";
import useCurrUser from "../hooks/useCurrUser";
import { useLoaderData } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import { CiMoneyBill } from "react-icons/ci";
import useUserControllerAuth, { SessionEndedError } from "../api/controllers/useUserControllerAuth";
import useAuth from "../hooks/useAuth";
import { useErrorBoundary } from "react-error-boundary";
import useLogout from "../hooks/useLogout";

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

  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.currentTarget.value);

    setSelected(value);
  }

  return (
    <div className="container">
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
          <p className={classes.gray}>{Math.round(userData!.novacNaSajtu)} dinara</p>

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
            <UplatiNovac currAmount={userData!.novacNaSajtu} refetch={refetchUser!} />
          )}
          {selected === 1 && (
            <IsplatiNovac currAmount={userData!.novacNaSajtu} refetch={refetchUser!} />
          )}
        </main>
      )}
    </div>
  );
}

export default Novac;

type FormValues = {
  value: number;
};

type PropsValues = {
  currAmount: number;
  refetch: (() => void)
};

function UplatiNovac({ currAmount, refetch }: PropsValues) {
  const form = useForm<FormValues>({mode: 'onChange'});
  const { register, formState, handleSubmit, watch, setValue, clearErrors } = form;
  const { errors, isValid } = formState;

  const logoutUser = useLogout();
  const { auth } = useAuth();
  const { deposit } = useUserControllerAuth(auth.userType);
  const { showBoundary } = useErrorBoundary();

  const amount = watch("value");

  async function onSubmit(values: FormValues) {
    const { value } = values;
    try {
        await deposit(value);
        refetch();
    } catch (error) {
        if(error instanceof SessionEndedError)
            logoutUser();
        else
            showBoundary(error);
    }
  }

  return (
    <section className={classes.section2}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={formCl.form}
        noValidate
      >
        <h3>Uplata novca na platformu</h3>
        <p>
          <span className={classes.bold}>Unesite Iznos</span>
        </p>
        <div
          className={
            formCl.inputGroup + " " + `${errors.value ? `${formCl.error}` : ""}`
          }
        >
          <CiMoneyBill size="2rem" className={formCl.inputIcon} />
          <input
            type="text"
            id="uplata"
            placeholder="5000"
            {...register("value", {
              required: "Ovo polje je obavezno",
              valueAsNumber: true,
              validate: (fieldValue) => {
                let msg : string = '';
                let valid = false;

                if(fieldValue < 500 || fieldValue > 200000) 
                    msg = "Iznos mora da bude između 500 i 200 000 dinara";
                else if(Number.isNaN(fieldValue)) 
                    msg = "Dozvoljeni su samo brojevi"
                else
                    valid = true;

              return (
                valid || msg
              );
            },
            })}
          />
        </div>
        <p className={formCl.pError}>
          {errors.value?.message && <MdErrorOutline />}
          {errors.value?.message}
        </p>

        <p>
          <span className={classes.bold}>Biće vam naplaćeno</span>
        </p>
        <p className={classes.gray}>
            {isValid 
            ? `${Math.round(amount)} dinara + Taksa`
            : '0 dinara'}
        </p>

        <p>
          <span className={classes.bold}>Vaše novo stanje na profilu biće</span>
        </p>
        <p className={classes.gray}>
            {isValid 
            ? `${Math.round(amount + currAmount)} dinara`
            : `${Math.round(currAmount)} dinara`}
        </p>
        
        <div className={formCl.btnContainer}>
            <button className="mainButtonSmall">Uplati</button>
            <button onClick={() => {
                setValue('value', 0);
                clearErrors();
            }} type="reset" className="secondLink">Poništi</button>
        </div>
      </form>
    </section>
  );
}

function IsplatiNovac({ currAmount, refetch }: PropsValues) {
    const form = useForm<FormValues>({mode: 'onChange'});
    const { register, formState, handleSubmit, watch, setValue, clearErrors } = form;
    const { errors, isValid } = formState;
  
    const amount = watch("value");

    const logoutUser = useLogout();
    const { auth } = useAuth();
    const { withdraw } = useUserControllerAuth(auth.userType);
    const { showBoundary } = useErrorBoundary();
  
    async function onSubmit(values: FormValues) {
      const { value } = values;
      try {
          await withdraw(value);
          refetch();
      } catch (error) {
          if(error instanceof SessionEndedError)
            logoutUser();
          else
              showBoundary(error);
      }
    }
  
  
    return (
      <section className={classes.section2}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={formCl.form}
          noValidate
        >
            <h3>Podizanje novca sa platforme</h3>
          <p>
            <span className={classes.bold}>Unesite Iznos</span>
          </p>
          <div
            className={
              formCl.inputGroup + " " + `${errors.value ? `${formCl.error}` : ""}`
            }
          >
            <CiMoneyBill size="2rem" className={formCl.inputIcon} />
            <input
              type="text"
              id="isplata"
              placeholder="5000"
              {...register("value", {
                required: "Ovo polje je obavezno",
                valueAsNumber: true,
                validate: (fieldValue) => {
                    let msg : string = '';
                    let valid = false;

                    if(fieldValue < 1000 || fieldValue > 200000) 
                        msg = "Iznos mora da bude između 1000 i 200 000 dinara";
                    else if(Number.isNaN(fieldValue)) 
                        msg = "Dozvoljeni su samo brojevi"
                    else if((currAmount - fieldValue) < 0) 
                        msg = "Ne mozete da skinete vise novca nego sto imate na profilu"
                    else
                        valid = true;

                  return (
                    valid || msg
                  );
                },
              })}
            />
          </div>
          <p className={formCl.pError}>
            {errors.value?.message && <MdErrorOutline />}
            {errors.value?.message}
          </p>
  
          {/* <p>
            <span className={classes.bold}>Biće vam naplaćeno</span>
          </p>
          <p className={classes.gray}>
              {isValid 
              ? `${amount} dinara + Taksa`
              : '0 dinara'}
          </p> */}
  
          <p>
            <span className={classes.bold}>Vaše novo stanje na profilu biće</span>
          </p>
          <p className={classes.gray}>
              {isValid 
              ? `${Math.round(currAmount - amount)} dinara`
              : `${Math.round(currAmount)} dinara`}
          </p>
          
          <div className={formCl.btnContainer}>
              <button className="mainButtonSmall">Isplati</button>
              <button onClick={() => {
                  setValue('value', 0);
                  clearErrors();
              }} type="reset" className="secondLink">Poništi</button>
          </div>
        </form>
      </section>
    );
}
