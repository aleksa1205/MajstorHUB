import { FieldErrors, UseFormRegister, UseFormSetValue, useForm } from "react-hook-form";
import UserType from "../../../lib/UserType";
import classes from "./FilterForm.module.css";
import { MdErrorOutline } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import RadioButton from "../../Theme/RadioButton/RadioButton";
import DropDownSlider, {
  DDSliderItem,
} from "../../Theme/DropDown/DropDownSlider";
import { createContext, useContext, useEffect, useState } from "react";
import { Iskustvo, userDataType } from "../../../api/DTO-s/responseTypes";
import Checkbox from "../../Theme/Checkbox/Checkbox";
import useUserControllerAuth, {
  SessionEndedError,
} from "../../../api/controllers/useUserControllerAuth";
import useLogout from "../../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";
import { FilterDTO } from "../../../api/DTO-s/FilterRequest";
import useModalAnimation from "../../../hooks/useModalAnimation";
import ModalAnimated from "../../Theme/Modal/ModalAnimated";
import { IoClose, IoOptions } from "react-icons/io5";

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
  setValue: UseFormSetValue<FormValues>
};

const FormContext = createContext<ContextValues | null>(null);
const formDefaultValues : FormValues = {
    query: "",
    opis: "",
    potroseno: "0",
    iskustva: [],
    cenaPoSatu: "0",
    zaradjeno: "0",
}

function FilterForm({ type, setUsers, setIsFetching }: PropsValues) {
  const form = useForm<FormValues>({
    defaultValues: formDefaultValues
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
      if(data === false)
        setUsers(new Array())
      else
        setUsers(data);

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
          <QueryInput />

          {isSmallScreen && <FilterOptionsSmall type={type} />}
          {isReallySmall && <div className={classes.break}/>}
          <button className={`mainButtonSmall ${classes.btnContainer}`}>
            <IoIosSearch />
            Pretraži
          </button>
        </div>

        {!isSmallScreen && <FilterOptionsLarge type={type} />}
      </FormContext.Provider>
    </form>
  );
}

export default FilterForm;

function FilterOptionsLarge({ type }: { type: UserType }) {
  return (
    <div className={classes.categoryContainer}>
      {type === UserType.Korisnik && <PotrosenoInput isOpen={true} />}
      {type !== UserType.Korisnik && (
          <>
          <ZaradjenoInput isOpen={true} />
          <CenaPoSatuInput isOpen={true} />
          <IskustvoInput isOpen={true} />
        </>
      )}
      <OpisInput isOpen={true} />
    </div>
  );
}

function FilterOptionsSmall({ type }: { type: UserType }) {
  const { setValue } = useContext(FormContext)!;
  const { closeModal, openModal, transition } = useModalAnimation();

  function clearHandler() {
    setValue('cenaPoSatu', '0');
    setValue('opis', '');
    setValue('potroseno', '0');
    setValue('zaradjeno', '0');
    setValue('iskustva', []);
  }

  return (
    <>
      <button className={classes.showButton} type="button" onClick={openModal}>
        <IoOptions size='1.65rem'/>
      </button>
      {transition((style, showModal) => {
        return showModal ? (
            <ModalAnimated style={style} onClose={closeModal}>
              <main className={classes.containerSmall}>
                <div>
                    <h2 className={classes.h2}>Filteri</h2>
                    <IoClose onClick={closeModal} size='2rem' />
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
                  <button onClick={closeModal} className="mainButtonSmall" type="button">
                    Sačuvaj
                  </button>
                  <button onClick={clearHandler} className="secondLink" type="button">
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

type InputProps = {
    isOpen?: boolean;
}

function QueryInput() {
  const { register, errors } = useContext(FormContext)!;
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
          placeholder="Primer: milos nis moleraj"
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
      <p className={classes.pError}>
        {errors.query?.message && <MdErrorOutline />}
        {errors.query?.message}
      </p>
    </>
  );
}

function OpisInput({ isOpen }: InputProps) {
  const { register, errors } = useContext(FormContext)!;
  return (
    <>
      <DropDownSlider text="Pretraga po opisu" isOpen={isOpen}>
        <DDSliderItem>
          <div
            className={
              classes.inputGroup +
              " " +
              `${errors.opis ? `${classes.error}` : ""}`
            }
          >
            <IoIosSearch size="2rem" className={classes.inputIcon} />
            <input
              type="text"
              id="opis"
              placeholder="primer: Imam iskustvo sa fasadama vec 15 godina"
              {...register("opis", {
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
          <p className={classes.pError}>
            {errors.opis?.message && <MdErrorOutline />}
            {errors.opis?.message}
          </p>
        </DDSliderItem>
      </DropDownSlider>
    </>
  );
}

function PotrosenoInput({ isOpen }: InputProps) {
  const { register } = useContext(FormContext)!;

  return (
    <>
      <DropDownSlider text="Potrošeno" isOpen={isOpen}>
        <DDSliderItem>
          <RadioButton htmlFor="potroseno0" tekst="Bilo koji iznos potrošen" >
            <input
              type="radio"
              id="potroseno0"
              value={0}
              {...register("potroseno")}
            />
          </RadioButton>
        </DDSliderItem>
        <DDSliderItem>
          <RadioButton htmlFor="potroseno1" tekst="Preko 1 din potrošeno">
            <input
              type="radio"
              id="potroseno1"
              value={1}
              {...register("potroseno")}
            />
          </RadioButton>
        </DDSliderItem>
        <DDSliderItem>
          <RadioButton htmlFor="potroseno1000" tekst="Preko 1000 din potrošeno">
            <input
              type="radio"
              id="potroseno1000"
              value={1000}
              {...register("potroseno")}
            />
          </RadioButton>
        </DDSliderItem>
        <DDSliderItem>
          <RadioButton
            htmlFor="potroseno10000"
            tekst="Preko 10 000 din potrošeno"
          >
            <input
              type="radio"
              id="potroseno10000"
              value={10000}
              {...register("potroseno")}
            />
          </RadioButton>
        </DDSliderItem>
        <DDSliderItem>
          <RadioButton
            htmlFor="potroseno100000"
            tekst="Preko 100 000 din potrošeno"
          >
            <input
              type="radio"
              id="potroseno100000"
              value={100000}
              {...register("potroseno")}
            />
          </RadioButton>
        </DDSliderItem>
        <DDSliderItem>
          <RadioButton
            htmlFor="potroseno-1"
            tekst="Klijent nije potrošio ništa"
          >
            <input
              type="radio"
              id="potroseno-1"
              value={-1}
              {...register("potroseno")}
            />
          </RadioButton>
        </DDSliderItem>
      </DropDownSlider>
    </>
  );
}

function ZaradjenoInput({ isOpen }: InputProps) {
  const { register } = useContext(FormContext)!;

  return (
    <>
      <DropDownSlider text="Ukupno zarađeno" isOpen={isOpen}>
        <DDSliderItem>
          <RadioButton htmlFor="zaradjeno0" tekst="Bilo koji iznos zarađen">
            <input
              type="radio"
              id="zaradjeno0"
              value={0}
              {...register("zaradjeno")}
            />
          </RadioButton>
        </DDSliderItem>
        <DDSliderItem>
          <RadioButton htmlFor="zaradjeno1" tekst="Preko 1 din zarađeno">
            <input
              type="radio"
              id="zaradjeno1"
              value={1}
              {...register("zaradjeno")}
            />
          </RadioButton>
        </DDSliderItem>
        <DDSliderItem>
          <RadioButton htmlFor="zaradjeno1000" tekst="Preko 1000 din zarađeno">
            <input
              type="radio"
              id="zaradjeno1000"
              value={1000}
              {...register("zaradjeno")}
            />
          </RadioButton>
        </DDSliderItem>
        <DDSliderItem>
          <RadioButton
            htmlFor="zaradjeno10000"
            tekst="Preko 10000 din zarađeno"
          >
            <input
              type="radio"
              id="zaradjeno10000"
              value={10000}
              {...register("zaradjeno")}
            />
          </RadioButton>
        </DDSliderItem>
        <DDSliderItem>
          <RadioButton
            htmlFor="zaradjeno100000"
            tekst="Preko 100000 din zarađeno"
          >
            <input
              type="radio"
              id="zaradjeno100000"
              value={100000}
              {...register("zaradjeno")}
            />
          </RadioButton>
        </DDSliderItem>
      </DropDownSlider>
    </>
  );
}

function CenaPoSatuInput({ isOpen }: InputProps) {
  const { register } = useContext(FormContext)!;

  return (
    <>
      <DropDownSlider text="Cena po satu" isOpen={isOpen}>
        <DDSliderItem>
          <RadioButton htmlFor="cena0" tekst="Bilo koja cena">
            <input
              type="radio"
              id="cena0"
              value={0}
              {...register("cenaPoSatu")}
            />
          </RadioButton>
        </DDSliderItem>
        <DDSliderItem>
          <RadioButton htmlFor="cena1" tekst="Preko 1 din cena po satu">
            <input
              type="radio"
              id="cena1"
              value={1}
              {...register("cenaPoSatu")}
            />
          </RadioButton>
        </DDSliderItem>
        <DDSliderItem>
          <RadioButton htmlFor="cena500" tekst="Preko 500 din cena po satu">
            <input
              type="radio"
              id="cena500"
              value={500}
              {...register("cenaPoSatu")}
            />
          </RadioButton>
        </DDSliderItem>
        <DDSliderItem>
          <RadioButton htmlFor="cena1000" tekst="Preko 1000 din cena po satu">
            <input
              type="radio"
              id="cena1000"
              value={1000}
              {...register("cenaPoSatu")}
            />
          </RadioButton>
        </DDSliderItem>
        <DDSliderItem>
          <RadioButton htmlFor="cena2000" tekst="Preko 2000 din cena po satu">
            <input
              type="radio"
              id="cena2000"
              value={2000}
              {...register("cenaPoSatu")}
            />
          </RadioButton>
        </DDSliderItem>
      </DropDownSlider>
    </>
  );
}

function IskustvoInput({ isOpen }: InputProps) {
  const { register } = useContext(FormContext)!;

  return (
    <>
      <DropDownSlider text="Iskustvo" isOpen={isOpen}>
        <DDSliderItem>
          <Checkbox htmlFor="pocetnik" text="Početnik">
            <input
              type="checkbox"
              id="pocetnik"
              value={Iskustvo.Pocetnik}
              {...register("iskustva")}
            />
          </Checkbox>
        </DDSliderItem>
        <DDSliderItem>
          <Checkbox htmlFor="iskusan" text="Iskusan">
            <input
              type="checkbox"
              id="iskusan"
              value={Iskustvo.Iskusan}
              {...register("iskustva")}
            />
          </Checkbox>
        </DDSliderItem>
        <DDSliderItem>
          <Checkbox htmlFor="profesionalac" text="Profesionalac">
            <input
              type="checkbox"
              id="profesionalac"
              value={Iskustvo.Profesionalac}
              {...register("iskustva")}
            />
          </Checkbox>
        </DDSliderItem>
      </DropDownSlider>
    </>
  );
}
