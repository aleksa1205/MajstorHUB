import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormReset,
  UseFormSetError,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import { CreateOglasDTO } from "../../api/DTO-s/Oglasi/OglasiDTO";
import { createContext, useEffect, useState } from "react";
import NaslovForm from "../../components/AuthorizedComponents/Oglas/PostaviOglas/NaslovForm";
import classes from "../../components/AuthorizedComponents/Oglas/PostaviOglas/PostaviOglas.module.css";
import { useNavigate } from "react-router-dom";
import StrukeForm from "../../components/AuthorizedComponents/Oglas/PostaviOglas/StrukeForm";
import { Struka } from "../../api/DTO-s/responseTypes";
import IskustvoForm from "../../components/AuthorizedComponents/Oglas/PostaviOglas/IskustvoForm";
import CenaForm from "../../components/AuthorizedComponents/Oglas/PostaviOglas/CenaForm";
import OpisForm from "../../components/AuthorizedComponents/Oglas/PostaviOglas/OpisForm";
import PregledOglasa from "../../components/AuthorizedComponents/Oglas/Pregled/PregledOglasa";

export enum Steps {
  Naslov,
  Vestine,
  Iskustvo,
  Budžet,
  Opis,
  Pregled,
}
export const stepsLength = Object.keys(Steps).length / 2 - 1;

export type FormContextType = {
  currentStep: Steps;
  register: UseFormRegister<CreateOglasFormValues>;
  errors: FieldErrors<CreateOglasFormValues>;
  watch: UseFormWatch<CreateOglasFormValues>;
  clearErrors: UseFormClearErrors<CreateOglasFormValues>;
  setError: UseFormSetError<CreateOglasFormValues>;
  struke: Struka[];
  setStruke: React.Dispatch<React.SetStateAction<Struka[]>>;
  reset: UseFormReset<CreateOglasFormValues>
};

export type CreateOglasFormValues = {
  naslov: string;
  iskustvo: string;
  struke: Struka[];
  opis: string;
  cena: number;
  duzinaPosla: string;
  lokacija?: string;
  value: number;
};

export const FormContext = createContext<FormContextType | null>(null);

export default function PostaviOglas() {
  const navigate = useNavigate();
  const {
    register,
    formState,
    handleSubmit,
    watch,
    clearErrors,
    setError,
    setValue,
    reset
  } = useForm<CreateOglasFormValues>();
  const { errors } = formState;
  const [oglas, setOglas] = useState<CreateOglasDTO>();

  const [currentStep, setCurrentStep] = useState<Steps>(Steps.Naslov);

  const [struke, setStruke] = useState<Array<Struka>>([]);

  function next() {
    setCurrentStep((prev) => prev + 1);
  }
  function prev() {
    currentStep === 0 ? navigate(-1) : setCurrentStep((prev) => prev - 1);
  }

  useEffect(() => {
    document.body.querySelector("footer")!.style.display = "none";

    return () => {
      const footer = document.body.querySelector("footer");
      if(footer)
        footer.style.display = "block";
    };
  }, []);

  async function onSubmit(oglas: CreateOglasFormValues) {
    const { cena, duzinaPosla, iskustvo, naslov, opis, struke : oglasStruke, lokacija } =
      oglas;

      console.log(oglas);

    if (currentStep === Steps.Vestine) {
      if (struke.length === 0) {
        setError("value", {
          type: "manual",
          message: "Molimo vas izaberite struku",
        });
      } else {
        setValue("struke", struke);
      }
    }

    if (currentStep == Steps.Opis) {
      setOglas({
        cena,
        duzinaPosla: parseInt(duzinaPosla),
        iskustvo: parseInt(iskustvo),
        opis,
        naslov,
        lokacija,
        struke: oglasStruke,
      });
    }

    next();
  }

  return (
    <main className={classes.main}>
      {currentStep !== Steps.Pregled && (
        <main className="container">
          <form
            className={`${classes.formMain}`}
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormContext.Provider
              value={{
                currentStep,
                register,
                errors,
                watch,
                clearErrors,
                setError,
                setStruke,
                struke,
                reset
              }}
            >
              {currentStep === Steps.Naslov && <NaslovForm />}
              {currentStep === Steps.Vestine && <StrukeForm />}
              {currentStep === Steps.Iskustvo && <IskustvoForm />}
              {currentStep === Steps.Budžet && <CenaForm />}
              {currentStep === Steps.Opis && <OpisForm />}
            </FormContext.Provider>

            <div className={classes.bottomContainer}>
              <div className={classes.progressBar}>
                <div
                  style={{
                    width: `${(100 / stepsLength) * (currentStep + 1)}%`,
                  }}
                ></div>
              </div>
              <div>
                <button
                  onClick={prev}
                  type="button"
                  className="secondaryButtonSmall"
                >
                  Nazad
                </button>
                <button className="mainButtonSmall">
                  {currentStep !== Steps.Opis
                    ? `Sledeće: ${Steps[currentStep + 1]}`
                    : "Pregledaj Oglas"}
                </button>
              </div>
            </div>
          </form>
        </main>
      )}

      {currentStep === Steps.Pregled && <PregledOglasa preview={true} oglasData={oglas!} setOglas={setOglas} prev={prev} setValue={setValue} struke={struke} setStruke={setStruke} />}
    </main>
  );
}
