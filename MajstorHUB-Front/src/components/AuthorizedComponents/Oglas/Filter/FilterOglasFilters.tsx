import { useContext } from "react";
import { FormContext } from "./FilterOglasForm";
import classes from "../../FilterUsers/FilterForm.module.css";
import { IoIosSearch } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";
import DropDown, { DDItem } from "../../../Theme/DropDown/DropDown";
import RadioButton from "../../../Theme/RadioButton/RadioButton";
import DropDownSlider, {
  DDSliderItem,
} from "../../../Theme/DropDown/DropDownSlider";
import Checkbox from "../../../Theme/Checkbox/Checkbox";
import { Iskustvo } from "../../../../api/DTO-s/responseTypes";
import { DuzinaPosla } from "../../../../api/DTO-s/Oglasi/OglasiDTO";

type PropsValues = {
  tip: "DropDownSlider" | "DropDown";
};

export function QueryInputOglas() {
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
          placeholder="Montiranje spuštenog plafona"
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

export function OpisInputOglas({ tip }: PropsValues) {
  const { register, errors } = useContext(FormContext)!;
  const item = (
    <>
      <div
        className={
          classes.inputGroup + " " + `${errors.opis ? `${classes.error}` : ""}`
        }
      >
        <IoIosSearch size="2rem" className={classes.inputIcon} />
        <input
          type="text"
          id="opis"
          placeholder="Spuštanje plafona u dnevnom boravku"
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
    </>
  );

  return (
    <>
      {tip === "DropDown" && (
        <DropDown text="Pretraga po opisu">
          <DDItem>{item}</DDItem>
        </DropDown>
      )}
      {tip == "DropDownSlider" && (
        <DropDownSlider isOpen={true} text="Pretraga po opisu">
          <DDSliderItem>{item}</DDSliderItem>
        </DropDownSlider>
      )}
    </>
  );
}

export function CenaInputOglas({ tip }: PropsValues) {
  const { register, setValue, watch, setIsCustom, isCustom, errors } =
    useContext(FormContext)!;

  const odCena = watch("customOd");
  const doCena = watch("customDo");

  const handleCustomRadioChange = () => {
    setIsCustom(true);
    setValue("cena", "custom");
  };

  const item1 = (
    <RadioButton htmlFor="0-max" tekst="Bilo koji budžet">
      <input
        type="radio"
        id="0-max"
        value={JSON.stringify({ od: 0, do: Number.MAX_VALUE })}
        {...register("cena")}
        onClick={() => setIsCustom(false)}
      />
    </RadioButton>
  );

  const item2 = (
    <RadioButton htmlFor="0-5000" tekst="Manje od 5 000 din">
      <input
        type="radio"
        id="0-5000"
        value={JSON.stringify({ od: 0, do: 5000 })}
        {...register("cena")}
        onClick={() => setIsCustom(false)}
      />
    </RadioButton>
  );

  const item3 = (
    <RadioButton htmlFor="5000-10000" tekst="5 000 do 10 000 din">
      <input
        type="radio"
        id="5000-10000"
        value={JSON.stringify({ od: 5000, do: 10000 })}
        {...register("cena")}
        onClick={() => setIsCustom(false)}
      />
    </RadioButton>
  );

  const item4 = (
    <RadioButton htmlFor="10000-50000" tekst="10 000 do 50 000 din">
      <input
        type="radio"
        id="10000-50000"
        value={JSON.stringify({ od: 10000, do: 50000 })}
        {...register("cena")}
        onClick={() => setIsCustom(false)}
      />
    </RadioButton>
  );

  const item5 = (
    <RadioButton htmlFor="50000-100000" tekst="50 000 do 100 000 din">
      <input
        type="radio"
        id="50000-100000"
        value={JSON.stringify({ od: 50000, do: 100000 })}
        {...register("cena")}
        onClick={() => setIsCustom(false)}
      />
    </RadioButton>
  );

  const item6 = (
    <RadioButton htmlFor="100000-500000" tekst="100 000 do 500 000 din">
      <input
        type="radio"
        id="100000-500000"
        value={JSON.stringify({ od: 100000, do: 500000 })}
        {...register("cena")}
        onClick={() => setIsCustom(false)}
      />
    </RadioButton>
  );

  const item7 = (
    <>
      <RadioButton htmlFor="custom" tekst="Izaberite sami">
        <input
          type="radio"
          id="custom"
          value="custom"
          {...register("cena")}
          onClick={handleCustomRadioChange}
        />
      </RadioButton>
      {isCustom && (
        <>
          <div
            className={
              classes.inputGroup2 +
              " " +
              `${errors.customOd ? `${classes.error}` : ""}`
            }
          >
            <div className={classes.inputIcon}>RSD</div>
            <input
              type="text"
              placeholder="Od"
              {...register("customOd", {
                required: "Ovo je obavezno polje",
                validate: (fieldValueStr) => {
                  let msg: string = "";
                  let valid = false;
                  let fieldValue;
                  if (fieldValueStr) {
                    fieldValue = parseFloat(fieldValueStr);
                    if (doCena && fieldValue > parseFloat(doCena))
                      msg = "Neispravno";
                    else if (Number.isNaN(fieldValue))
                      msg = "Dozvoljeni su samo brojevi";
                    else valid = true;
                  }

                  return valid || msg;
                },
              })}
            />
          </div>

          <br />

          <div
            className={
              classes.inputGroup2 +
              " " +
              `${errors.customDo ? `${classes.error}` : ""}`
            }
          >
            <div className={classes.inputIcon}>RSD</div>
            <input
              type="text"
              placeholder="Do"
              {...register("customDo", {
                required: "Ovo je obavezno polje",
                validate: (fieldValueStr) => {
                  let msg: string = "";
                  let valid = false;

                  if (fieldValueStr) {
                    let fieldValue = parseFloat(fieldValueStr);
                    if (odCena && fieldValue < parseFloat(odCena))
                      msg = "Neispravno";
                    else if (Number.isNaN(fieldValue))
                      msg = "Dozvoljeni su samo brojevi";
                    else valid = true;
                  }

                  return valid || msg;
                },
              })}
            />
          </div>
        </>
      )}
    </>
  );

  const isValid =
    (typeof errors.customDo === "undefined" &&
      typeof errors.customOd === "undefined") ||
    !isCustom;

  return (
    <>
      {tip === "DropDown" && (
        <DropDown text="Budžet Klijenta" isValid={isValid}>
          <DDItem>{item1}</DDItem>
          <DDItem>{item2}</DDItem>
          <DDItem>{item3}</DDItem>
          <DDItem>{item4}</DDItem>
          <DDItem>{item5}</DDItem>
          <DDItem>{item6}</DDItem>
          <DDItem isValid={isValid}>{item7}</DDItem>
        </DropDown>
      )}

      {tip === "DropDownSlider" && (
        <DropDownSlider isOpen={true} text="Budžet Klijenta" isValid={isValid}>
          <DDSliderItem>{item1}</DDSliderItem>
          <DDSliderItem>{item2}</DDSliderItem>
          <DDSliderItem>{item3}</DDSliderItem>
          <DDSliderItem>{item4}</DDSliderItem>
          <DDSliderItem>{item5}</DDSliderItem>
          <DDSliderItem>{item6}</DDSliderItem>
          <DDSliderItem isValid={isValid}>{item7}</DDSliderItem>
        </DropDownSlider>
      )}
    </>
  );
}

export function PotrosenoInputOglas({ tip }: PropsValues) {
  const { register } = useContext(FormContext)!;

  const item1 = (
    <RadioButton htmlFor="potroseno0" tekst="Bilo koji iznos potrošen">
      <input
        type="radio"
        id="potroseno0"
        value={0}
        {...register("potroseno")}
      />
    </RadioButton>
  );
  const item2 = (
    <RadioButton htmlFor="potroseno1" tekst="Preko 1 din potrošeno">
      <input
        type="radio"
        id="potroseno1"
        value={1}
        {...register("potroseno")}
      />
    </RadioButton>
  );
  const item3 = (
    <RadioButton htmlFor="potroseno1000" tekst="Preko 1000 din potrošeno">
      <input
        type="radio"
        id="potroseno1000"
        value={1000}
        {...register("potroseno")}
      />
    </RadioButton>
  );
  const item4 = (
    <RadioButton htmlFor="potroseno10000" tekst="Preko 10 000 din potrošeno">
      <input
        type="radio"
        id="potroseno10000"
        value={10000}
        {...register("potroseno")}
      />
    </RadioButton>
  );
  const item5 = (
    <RadioButton htmlFor="potroseno100000" tekst="Preko 100 000 din potrošeno">
      <input
        type="radio"
        id="potroseno100000"
        value={100000}
        {...register("potroseno")}
      />
    </RadioButton>
  );

  const item6 = (
    <RadioButton htmlFor="potroseno-1" tekst="Klijent nije potrošio ništa">
      <input
        type="radio"
        id="potroseno-1"
        value={-1}
        {...register("potroseno")}
      />
    </RadioButton>
  );

  const text = "Potrošeno";

  return (
    <>
      {tip === "DropDown" && (
        <DropDown text={text}>
          <DDItem>{item1}</DDItem>
          <DDItem>{item2}</DDItem>
          <DDItem>{item3}</DDItem>
          <DDItem>{item4}</DDItem>
          <DDItem>{item5}</DDItem>
          <DDItem>{item6}</DDItem>
        </DropDown>
      )}

      {tip === "DropDownSlider" && (
        <DropDownSlider isOpen={true} text={text}>
          <DDSliderItem>{item1}</DDSliderItem>
          <DDSliderItem>{item2}</DDSliderItem>
          <DDSliderItem>{item3}</DDSliderItem>
          <DDSliderItem>{item4}</DDSliderItem>
          <DDSliderItem>{item5}</DDSliderItem>
          <DDSliderItem>{item6}</DDSliderItem>
        </DropDownSlider>
      )}
    </>
  );
}

export function IskustvoInputOglas({ tip }: PropsValues) {
  const { register } = useContext(FormContext)!;

  const item1 = (
    <Checkbox htmlFor="pocetnik" text="Početnik">
      <input
        type="checkbox"
        id="pocetnik"
        value={Iskustvo.Pocetnik}
        {...register("iskustva")}
      />
    </Checkbox>
  );
  const item2 = (
    <Checkbox htmlFor="iskusan" text="Iskusan">
      <input
        type="checkbox"
        id="iskusan"
        value={Iskustvo.Iskusan}
        {...register("iskustva")}
      />
    </Checkbox>
  );
  const item3 = (
    <Checkbox htmlFor="profesionalac" text="Profesionalac">
      <input
        type="checkbox"
        id="profesionalac"
        value={Iskustvo.Profesionalac}
        {...register("iskustva")}
      />
    </Checkbox>
  );

  const text = "Iskustvo";

  return (
    <>
      {tip === "DropDown" && (
        <DropDown text={text}>
          <DDItem>{item1}</DDItem>
          <DDItem>{item2}</DDItem>
          <DDItem>{item3}</DDItem>
        </DropDown>
      )}
      {tip === "DropDownSlider" && (
        <DropDownSlider isOpen={true} text={text}>
          <DDSliderItem>{item1}</DDSliderItem>
          <DDSliderItem>{item2}</DDSliderItem>
          <DDSliderItem>{item3}</DDSliderItem>
        </DropDownSlider>
      )}
    </>
  );
}

export function DuzinaPoslaInputOglas({ tip }: PropsValues) {
  const { register } = useContext(FormContext)!;

  const item1 = (
    <Checkbox htmlFor="manjeMesec" text="Manje od mesec dana">
      <input
        type="checkbox"
        id="manjeMesec"
        value={DuzinaPosla.ManjeOdMesec}
        {...register("duzinePosla")}
      />
    </Checkbox>
  );
  const item2 = (
    <Checkbox htmlFor="jedantri" text="1 do 3 meseca">
      <input
        type="checkbox"
        id="jedantri"
        value={DuzinaPosla.JedanDoTriMeseca}
        {...register("duzinePosla")}
      />
    </Checkbox>
  );
  const item3 = (
    <Checkbox htmlFor="trisest" text="3 do 6 meseci">
      <input
        type="checkbox"
        id="trisest"
        value={DuzinaPosla.TriDoSestMeseci}
        {...register("duzinePosla")}
      />
    </Checkbox>
  );
  const item4 = (
    <Checkbox htmlFor="visesest" text="Više od 6 meseci">
      <input
        type="checkbox"
        id="visesest"
        value={DuzinaPosla.ViseOdSestMeseci}
        {...register("duzinePosla")}
      />
    </Checkbox>
  );

  const text = "Dužina Posla";

  return (
    <>
      {tip === "DropDown" && (
        <DropDown text={text}>
          <DDItem>{item1}</DDItem>
          <DDItem>{item2}</DDItem>
          <DDItem>{item3}</DDItem>
          <DDItem>{item4}</DDItem>
        </DropDown>
      )}
      {tip === "DropDownSlider" && (
        <DropDownSlider isOpen={true} text={text}>
          <DDSliderItem>{item1}</DDSliderItem>
          <DDSliderItem>{item2}</DDSliderItem>
          <DDSliderItem>{item3}</DDSliderItem>
          <DDSliderItem>{item4}</DDSliderItem>
        </DropDownSlider>
      )}
    </>
  );
}
