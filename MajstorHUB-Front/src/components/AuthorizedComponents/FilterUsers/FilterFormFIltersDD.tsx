import classes from "./FilterForm.module.css";
import { MdErrorOutline } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import RadioButton from "../../Theme/RadioButton/RadioButton";
import DropDown, {DDItem} from "../../Theme/DropDown/DropDown";
import { useContext } from "react";
import { Iskustvo } from "../../../api/DTO-s/responseTypes";
import Checkbox from "../../Theme/Checkbox/Checkbox";
import { FormContext } from "./FilterForm";


export function OpisInputDD() {
  const { register, errors } = useContext(FormContext)!;
  return (
    <>
      <DropDown text="Pretraga po opisu" >
        <DDItem>
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
        </DDItem>
      </DropDown>
    </>
  );
}

export function PotrosenoInputDD() {
  const { register } = useContext(FormContext)!;

  return (
    <>
      <DropDown text="Potrošeno" >
        <DDItem>
          <RadioButton htmlFor="potroseno0" tekst="Bilo koji iznos potrošen" >
            <input
              type="radio"
              id="potroseno0"
              value={0}
              {...register("potroseno")}
            />
          </RadioButton>
        </DDItem>
        <DDItem>
          <RadioButton htmlFor="potroseno1" tekst="Preko 1 din potrošeno">
            <input
              type="radio"
              id="potroseno1"
              value={1}
              {...register("potroseno")}
            />
          </RadioButton>
        </DDItem>
        <DDItem>
          <RadioButton htmlFor="potroseno1000" tekst="Preko 1000 din potrošeno">
            <input
              type="radio"
              id="potroseno1000"
              value={1000}
              {...register("potroseno")}
            />
          </RadioButton>
        </DDItem>
        <DDItem>
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
        </DDItem>
        <DDItem>
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
        </DDItem>
        <DDItem>
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
        </DDItem>
      </DropDown>
    </>
  );
}

export function ZaradjenoInputDD() {
  const { register } = useContext(FormContext)!;

  return (
    <>
      <DropDown text="Ukupno zarađeno" >
        <DDItem>
          <RadioButton htmlFor="zaradjeno0" tekst="Bilo koji iznos zarađen">
            <input
              type="radio"
              id="zaradjeno0"
              value={0}
              {...register("zaradjeno")}
            />
          </RadioButton>
        </DDItem>
        <DDItem>
          <RadioButton htmlFor="zaradjeno1" tekst="Preko 1 din zarađeno">
            <input
              type="radio"
              id="zaradjeno1"
              value={1}
              {...register("zaradjeno")}
            />
          </RadioButton>
        </DDItem>
        <DDItem>
          <RadioButton htmlFor="zaradjeno1000" tekst="Preko 1000 din zarađeno">
            <input
              type="radio"
              id="zaradjeno1000"
              value={1000}
              {...register("zaradjeno")}
            />
          </RadioButton>
        </DDItem>
        <DDItem>
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
        </DDItem>
        <DDItem>
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
        </DDItem>
      </DropDown>
    </>
  );
}

export function CenaPoSatuInputDD() {
  const { register } = useContext(FormContext)!;

  return (
    <>
      <DropDown text="Cena po satu" >
        <DDItem>
          <RadioButton htmlFor="cena0" tekst="Bilo koja cena">
            <input
              type="radio"
              id="cena0"
              value={0}
              {...register("cenaPoSatu")}
            />
          </RadioButton>
        </DDItem>
        <DDItem>
          <RadioButton htmlFor="cena1" tekst="Preko 1 din cena po satu">
            <input
              type="radio"
              id="cena1"
              value={1}
              {...register("cenaPoSatu")}
            />
          </RadioButton>
        </DDItem>
        <DDItem>
          <RadioButton htmlFor="cena500" tekst="Preko 500 din cena po satu">
            <input
              type="radio"
              id="cena500"
              value={500}
              {...register("cenaPoSatu")}
            />
          </RadioButton>
        </DDItem>
        <DDItem>
          <RadioButton htmlFor="cena1000" tekst="Preko 1000 din cena po satu">
            <input
              type="radio"
              id="cena1000"
              value={1000}
              {...register("cenaPoSatu")}
            />
          </RadioButton>
        </DDItem>
        <DDItem>
          <RadioButton htmlFor="cena2000" tekst="Preko 2000 din cena po satu">
            <input
              type="radio"
              id="cena2000"
              value={2000}
              {...register("cenaPoSatu")}
            />
          </RadioButton>
        </DDItem>
      </DropDown>
    </>
  );
}

export function IskustvoInputDD() {
  const { register } = useContext(FormContext)!;

  return (
    <>
      <DropDown text="Iskustvo" >
        <DDItem>
          <Checkbox htmlFor="pocetnik" text="Početnik">
            <input
              type="checkbox"
              id="pocetnik"
              value={Iskustvo.Pocetnik}
              {...register("iskustva")}
            />
          </Checkbox>
        </DDItem>
        <DDItem>
          <Checkbox htmlFor="iskusan" text="Iskusan">
            <input
              type="checkbox"
              id="iskusan"
              value={Iskustvo.Iskusan}
              {...register("iskustva")}
            />
          </Checkbox>
        </DDItem>
        <DDItem>
          <Checkbox htmlFor="profesionalac" text="Profesionalac">
            <input
              type="checkbox"
              id="profesionalac"
              value={Iskustvo.Profesionalac}
              {...register("iskustva")}
            />
          </Checkbox>
        </DDItem>
      </DropDown>
    </>
  );
}