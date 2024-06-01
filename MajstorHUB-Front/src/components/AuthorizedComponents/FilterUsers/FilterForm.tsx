import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  useForm,
} from "react-hook-form";
import UserType from "../../../lib/UserType";
import classes from "./FilterForm.module.css";
import { MdErrorOutline } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { createContext, useContext, useEffect, useState } from "react";
import { userDataType } from "../../../api/DTO-s/responseTypes";
import useUserControllerAuth, {
  SessionEndedError,
} from "../../../api/controllers/useUserControllerAuth";
import useLogout from "../../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";
import { FilterDTO } from "../../../api/DTO-s/FilterRequest";
import useModalAnimation from "../../../hooks/useModalAnimation";
import ModalAnimated from "../../Theme/Modal/ModalAnimated";
import { IoClose, IoOptions } from "react-icons/io5";
import {
  CenaPoSatuInputDD,
  IskustvoInputDD,
  OpisInputDD,
  PotrosenoInputDD,
  ZaradjenoInputDD,
} from "./FilterFormFIltersDD";
import {
  CenaPoSatuInput,
  IskustvoInput,
  OpisInput,
  PotrosenoInput,
  ZaradjenoInput,
} from "./FilterFormFilters";

type FormValues = {
  query: string;
  opis: string;
  potroseno: string;
  iskustva: string[];
  cenaPoSatu: string;
  zaradjeno: string;
};

type PropsValues = {
  type: UserType;
  setUsers: React.Dispatch<React.SetStateAction<userDataType[]>>;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
};

type ContextValues = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
};

export const FormContext = createContext<ContextValues | null>(null);
const formDefaultValues: FormValues = {
  query: "",
  opis: "",
  potroseno: "0",
  iskustva: [],
  cenaPoSatu: "0",
  zaradjeno: "0",
};

function FilterForm({ type, setUsers, setIsFetching }: PropsValues) {
  const form = useForm<FormValues>({
    defaultValues: formDefaultValues,
  });
  const { register, formState, handleSubmit, setValue } = form;
  const { errors } = formState;
  const { showBoundary } = useErrorBoundary();

  const logoutUser = useLogout();
  const { filter } = useUserControllerAuth(type);

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
      potroseno: potrosenoString,
      zaradjeno: zaradjenoSring,
      iskustva: iskustvaStrings,
      cenaPoSatu: cenaPoSatuString,
    } = values;

    const zaradjeno = parseInt(zaradjenoSring);
    const potroseno = parseInt(potrosenoString);
    const cenaPoSatu = parseInt(cenaPoSatuString);
    let iskustva: number[] = [];
    iskustvaStrings.forEach((el) => iskustva.push(parseInt(el)));

    let request: FilterDTO;
    switch (type) {
      case UserType.Korisnik:
        request = {
          query,
          opis,
          potroseno: potroseno,
          type: UserType.Korisnik,
        };
        break;
      case UserType.Majstor:
        request = {
          query,
          opis,
          cenaPoSatu,
          zaradjeno,
          iskustva,
          type: UserType.Majstor,
        };
        break;
      case UserType.Firma:
        request = {
          query,
          opis,
          cenaPoSatu,
          zaradjeno,
          iskustva,
          type: UserType.Firma,
        };
        break;
    }

    try {
      setIsFetching(true);

      const data = await filter(request!);
      if (data === false) setUsers(new Array());
      else setUsers(data);

      setIsFetching(false);
    } catch (error) {
      if (error instanceof SessionEndedError) logoutUser();
      else showBoundary(error);
    }
  }

  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormContext.Provider value={{ register, errors, setValue }}>
        <div className={classes.searchContainer}>
          <QueryInput type={type} />

          {isSmallScreen && <FilterOptionsSmall type={type} />}
          {isReallySmall && <div className={classes.break} />}
          <button className={`mainButtonSmall ${classes.btnContainer}`}>
            <IoIosSearch />
            Pretraži
          </button>
        </div>

        {errors.query && (
          <p className={classes.pError}>
            <MdErrorOutline />
            Naslov: {errors.query?.message}
          </p>
        )}
        {errors.opis && (
          <p className={classes.pError}>
            <MdErrorOutline />
            Niste lepo uneli opis
          </p>
        )}

        {!isSmallScreen && <FilterOptionsLarge type={type} />}
      </FormContext.Provider>
    </form>
  );
}

export default FilterForm;

function FilterOptionsLarge({ type }: { type: UserType }) {
  return (
    <div className={classes.categoryContainer}>
      {type === UserType.Korisnik && <PotrosenoInputDD />}
      {type !== UserType.Korisnik && (
        <>
          <ZaradjenoInputDD />
          <CenaPoSatuInputDD />
          <IskustvoInputDD />
        </>
      )}
      <OpisInputDD />
    </div>
  );
}

function FilterOptionsSmall({ type }: { type: UserType }) {
  const { setValue } = useContext(FormContext)!;
  const { closeModal, openModal, transition } = useModalAnimation();

  function clearHandler() {
    setValue("cenaPoSatu", "0");
    setValue("opis", "");
    setValue("potroseno", "0");
    setValue("zaradjeno", "0");
    setValue("iskustva", []);
  }

  return (
    <>
      <button className={classes.showButton} type="button" onClick={openModal}>
        <IoOptions size="1.65rem" />
      </button>
      {transition((style, showModal) => {
        return showModal ? (
          <ModalAnimated style={style} onClose={closeModal}>
            <main className={classes.containerSmall}>
              <div>
                <h2 className={classes.h2}>Filteri</h2>
                <IoClose onClick={closeModal} size="2rem" />
              </div>
              <div className={classes.filterContent}>
                <OpisInput isOpen={true} />
                {type === UserType.Korisnik && <PotrosenoInput isOpen={true} />}
                {type !== UserType.Korisnik && (
                  <>
                    <ZaradjenoInput isOpen={true} />
                    <CenaPoSatuInput isOpen={true} />
                    <IskustvoInput isOpen={true} />
                  </>
                )}
              </div>
              <div className={classes.smallButtonContainer}>
                <button
                  onClick={closeModal}
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

export function QueryInput({ type }: { type: UserType }) {
  const { register, errors } = useContext(FormContext)!;

  let placeholderMessage: string = "";
  switch (type) {
    case UserType.Firma:
      placeholderMessage = "PVC Stolarija Stanišić";
      break;
    case UserType.Majstor:
      placeholderMessage = "Majstor Bob";
      break;
    case UserType.Korisnik:
      placeholderMessage = "Milos Nis";
      break;
  }

  return (
    <>
      <div
        className={
          classes.inputGroup + " " + `${errors.query ? `${classes.error}` : ""}`
        }
      >
        <IoIosSearch size="2rem" className={classes.inputIcon} />
        <input
          type="text"
          id="query"
          placeholder={placeholderMessage}
          {...register("query", {
            minLength: {
              value: 3,
              message: "Minimalno 3 karaktera",
            },
            maxLength: {
              value: 50,
              message: "Maksimalno 50 karaktera",
            },
          })}
        />
      </div>
    </>
  );
}
