import { useContext, useEffect, useState } from "react";
import classes from "./PostaviOglas.module.css";
import {
  FormContext,
  stepsLength,
} from "../../../../routes/Oglasi/PostaviOglas";
import { MdErrorOutline } from "react-icons/md";
import {
  Struka,
  getStrukaDisplayName,
} from "../../../../api/DTO-s/responseTypes";
import DropDown from "../../../Theme/DropDown/DDSelect";
import { IoClose } from "react-icons/io5";

export default function StrukeForm() {
  const { currentStep, register, errors, watch, clearErrors, setError, struke, setStruke } =
    useContext(FormContext)!;

  const [increment, setIncrement] = useState<number>(0);

  const sveStruke = Object.keys(Struka).filter((v) => !isNaN(Number(v)));

  const inputValue = watch("value");

  useEffect(() => {
    if (
      struke.includes(inputValue) ||
      typeof inputValue === "undefined" ||
      inputValue === 0
    )
    return;
    
    if (struke.length < 10) {
      clearErrors();
      setStruke((prev) => [...prev, inputValue]);
      //setError(null);
    } else {
      setError("value", {
        type: "manual",
        message: "Maksimalan broj struka je 10",
      });
    }
  }, [increment]);

  function deleteHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const struka: Struka = parseInt(e.currentTarget.value);
    setStruke((prev) => prev.filter((el) => el !== struka));
    clearErrors();
  }

  return (
    <>
      <div className={classes.description}>
        <div className={classes.steps}>
          <span>
            {currentStep + 1}/{stepsLength}
          </span>
          <span>Postavljanje Oglasa</span>
        </div>
        <h2>Koje su glavne veštine potrebne za vaš posao?</h2>
      </div>

      <div className={classes.inputs}>
        <label className={classes.label} htmlFor="vestine">
          Dodajte do 10 veština
        </label>
        <DropDown>
          <select
            className={errors.value ? `${classes.error}` : ""}
            id="vestine"
            {...register("value", {
              valueAsNumber: true,
              required: "Ovo je obavezno polje",
            })}
          >
            <option value="0">Izaberite Struku</option>
            {sveStruke.map((e) => {
              const el = parseInt(e, 10);
              if (el !== Struka.Nedefinisano) {
                const isIncluded = struke.includes(el);
                return (
                  <option
                    onClick={() => setIncrement((prev) => prev + 1)}
                    disabled={isIncluded}
                    key={el}
                    value={el}
                  >
                    {getStrukaDisplayName(el)}
                  </option>
                );
              }
            })}
          </select>
        </DropDown>
        <p>Maksimalno 10 struka</p>
        <p className={classes.pError}>
          {errors.value?.message && <MdErrorOutline />}
          {errors.value?.message}
        </p>

        <div className={classes.vestine}>
          {struke.map((el) => {
            return (
              <div key={el} className={classes.vestina}>
                {getStrukaDisplayName(el)}
                <button type="button" onClick={deleteHandler} value={el}>
                  <IoClose size="1.3rem" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
