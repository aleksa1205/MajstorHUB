import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormReset,
  UseFormSetError,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import {
  DuzinaPosla,
  FilterOglasDTO,
  GetOglasDTO,
} from "../../../../api/DTO-s/Oglasi/OglasiDTO";
import { useErrorBoundary } from "react-error-boundary";
import useLogout from "../../../../hooks/useLogout";
import useOglasController from "../../../../api/controllers/useOglasController";
import { createContext, useContext, useEffect, useState } from "react";
import { SessionEndedError } from "../../../../api/controllers/useUserControllerAuth";
import classes from "../../FilterUsers/FilterForm.module.css";
import { IoIosSearch } from "react-icons/io";
import {
  CenaInputOglas,
  DuzinaPoslaInputOglas,
  IskustvoInputOglas,
  OpisInputOglas,
  QueryInputOglas,
} from "./FilterOglasFilters";
import useModalAnimation from "../../../../hooks/useModalAnimation";
import { IoClose, IoOptions } from "react-icons/io5";
import ModalAnimated from "../../../Theme/Modal/ModalAnimated";
import { MdErrorOutline } from "react-icons/md";
import { Iskustvo } from "../../../../api/DTO-s/responseTypes";

type FormValues = {
  cena?: string;
  customOd?: string;
  customDo?: string;
  duzinePosla?: string[];
  iskustva?: string[];
  opis?: string;
  query?: string;
};

const formDefaultValues: FormValues = {
  cena: JSON.stringify({ od: 0, do: Number.MAX_VALUE }),
  customDo: "0",
  customOd: "0",
};

type ContextValues = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  watch: UseFormWatch<FormValues>;
  isCustom: boolean;
  setIsCustom: React.Dispatch<React.SetStateAction<boolean>>;
  isValid: boolean;
  reset: UseFormReset<FormValues>;
  setError: UseFormSetError<FormValues>;
  clearErrors: UseFormClearErrors<FormValues>;
};

export const FormContext = createContext<ContextValues | null>(null);

type PropsValues = {
  setOglasi: React.Dispatch<React.SetStateAction<GetOglasDTO[]>>;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FilerOglasForm({
  setIsFetching,
  setOglasi,
}: PropsValues) {
  const form = useForm<FormValues>({
    defaultValues: formDefaultValues,
    mode: "onChange",
  });
  const {
    register,
    formState,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
  } = form;
  const { errors, isValid } = formState;
  const { showBoundary } = useErrorBoundary();

  const [isCustom, setIsCustom] = useState(false);

  const logoutUser = useLogout();
  const { filter } = useOglasController();

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1200);
  const [isReallySmall, setIsReallySmall] = useState(window.innerWidth < 550);

  useEffect(() => {
    async function fetchDefault() {
      await onSubmit(formDefaultValues);
    }
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
      setIsReallySmall(window.innerWidth < 550);
    };
    window.addEventListener("resize", handleResize);

    fetchDefault();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function onSubmit(values: FormValues) {
    const {
      query,
      opis,
      cena: cenaString,
      duzinePosla: duzinePoslaStrings,
      iskustva: iskustvaStrings,
      customDo,
      customOd,
    } = values;

    let cena;
    if (cenaString === "custom") {
      if (customDo !== "" && customOd !== "") {
        cena = {
          od: customOd,
          do: customDo,
        };
      }
    } else if (cenaString) cena = JSON.parse(cenaString);

    let iskustva: Iskustvo[] = [];
    if (iskustvaStrings)
      iskustvaStrings.forEach((el) => iskustva.push(parseInt(el)));

    let duzinePosla: DuzinaPosla[] = [];
    if (duzinePoslaStrings)
      duzinePoslaStrings.forEach((el) => duzinePosla.push(parseInt(el)));

    let request: FilterOglasDTO = {
      cena,
      iskustva,
      duzinePosla,
      query,
      opis,
    };

    try {
      setIsFetching(true);

      const data = await filter(request!);
      if (data === false) setOglasi(new Array());
      else setOglasi(data);

      // console.log(data);
      setIsFetching(false);
    } catch (error) {
      if (error instanceof SessionEndedError) logoutUser();
      else showBoundary(error);
    }
  }

  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormContext.Provider
        value={{
          clearErrors,
          setError,
          register,
          errors,
          setValue,
          watch,
          setIsCustom,
          isCustom,
          isValid,
          reset,
        }}
      >
        <div className={classes.searchContainer}>
          <QueryInputOglas />

          {isSmallScreen && <FilterOptionsSmall />}
          {isReallySmall && <div className={classes.break} />}
          <button className={`mainButtonSmall ${classes.btnContainer}`}>
            <IoIosSearch />
            Pretraži
          </button>
        </div>

        {!isSmallScreen && <FilterOptionsLarge />}
      </FormContext.Provider>
      {errors.query && (
        <p className={classes.pError}>
          <MdErrorOutline />
          Naslov: {errors.query?.message}
        </p>
      )}
      {(errors.customDo || errors.customOd) && isCustom && (
        <p className={classes.pError}>
          <MdErrorOutline />
          Niste lepo uneli cenu
        </p>
      )}
      {errors.opis && (
        <p className={classes.pError}>
          <MdErrorOutline />
          Niste lepo uneli opis
        </p>
      )}
    </form>
  );
}

function FilterOptionsSmall() {
  const { isValid, setIsCustom, reset } = useContext(FormContext)!;
  const { closeModal, openModal, transition } = useModalAnimation();

  function clearHandler() {
    reset();
    setIsCustom(false);
  }

  function closeHandler() {
    if (!isValid) return;
    closeModal();
  }

  return (
    <>
      <button className={classes.showButton} type="button" onClick={openModal}>
        <IoOptions size="1.65rem" />
      </button>
      {transition((style, showModal) => {
        return showModal ? (
          <ModalAnimated style={style} onClose={closeHandler}>
            <main className={classes.containerSmall}>
              <div>
                <h2 className={classes.h2}>Filteri</h2>
                <IoClose onClick={closeHandler} size="2rem" />
              </div>
              <div className={classes.filterContent}>
                <CenaInputOglas tip="DropDownSlider" />
                <IskustvoInputOglas tip="DropDownSlider" />
                <DuzinaPoslaInputOglas tip="DropDownSlider" />
                <OpisInputOglas tip="DropDownSlider" />
              </div>
              <div className={classes.smallButtonContainer}>
                <button
                  onClick={closeHandler}
                  className="mainButtonSmall"
                  type="button"
                >
                  Sačuvaj
                </button>
                <button
                  onClick={clearHandler}
                  className="secondLink"
                  type="button"
                >
                  Obriši filtere
                </button>
              </div>
            </main>
          </ModalAnimated>
        ) : null;
      })}
    </>
  );
}

function FilterOptionsLarge() {
  return (
    <div className={classes.categoryContainer}>
      <CenaInputOglas tip="DropDown" />
      <IskustvoInputOglas tip="DropDown" />
      <DuzinaPoslaInputOglas tip="DropDown" />
      <OpisInputOglas tip="DropDown" />
    </div>
  );
}
