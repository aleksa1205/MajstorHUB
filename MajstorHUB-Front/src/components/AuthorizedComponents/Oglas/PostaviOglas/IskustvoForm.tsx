import { useContext } from "react";
import classes from "./PostaviOglas.module.css";
import {
  FormContext,
  stepsLength,
} from "../../../../routes/Oglasi/PostaviOglas";
import { MdErrorOutline } from "react-icons/md";
import RadioButton from "../../../Theme/RadioButton/RadioButton";
import { Iskustvo } from "../../../../api/DTO-s/responseTypes";
import DropDownSlider, {
  DDSliderItem,
} from "../../../Theme/DropDown/DropDownSlider";
import { DuzinaPosla } from "../../../../api/DTO-s/Oglasi/OglasiDTO";

export default function IskustvoForm() {
  const { register, errors, currentStep } = useContext(FormContext)!;

  return (
    <>
      <div className={classes.description}>
        <div className={classes.steps}>
          <span>
            {currentStep + 1}/{stepsLength}
          </span>
          <span>Postavljanje Oglasa</span>
        </div>
        <h2>
          Sledeće, izaberite iskustvo izvođača kao i dužinu trajanja posla.
        </h2>
        <p>
          Ovo nisu finalni odgovori, ali ove informacije nam pomažu da vam
          pronađemo odgovarajućeg izvođača radova za ono što vam je potrebno.
        </p>
      </div>

      <div className={classes.inputs}>
        <DropDownSlider
          text="Koji nivo iskustva posao zahteva?"
          isOpen={true}
        >
          <DDSliderItem>
            <RadioButton
              htmlFor="pocetnik"
              tekst="Početnik"
              opis="Tražim nekog ko je relativno nov u ovoj oblasti"
            >
              <input
                className={errors.naslov ? `${classes.error}` : ""}
                type="radio"
                id="pocetnik"
                value={Iskustvo.Pocetnik}
                {...register("iskustvo", {
                    required: "Ovo je obavezno polje"
                })}
              />
            </RadioButton>
          </DDSliderItem>
          <DDSliderItem>
            <RadioButton
              htmlFor="iskusan"
              tekst="Iskusan"
              opis="Tražim nekog ko ima značajno iskustvo u ovoj oblasti"
            >
              <input
                className={errors.naslov ? `${classes.error}` : ""}
                type="radio"
                id="iskusan"
                value={Iskustvo.Iskusan}
                {...register("iskustvo", {
                    required: "Ovo je obavezno polje"
                })}
              />
            </RadioButton>
          </DDSliderItem>
          <DDSliderItem>
            <RadioButton
              htmlFor="profi"
              tekst="Profesionalac"
              opis="Tražim nekog ko ima duboko znanje iz ove oblasti"
            >
              <input
                className={errors.naslov ? `${classes.error}` : ""}
                type="radio"
                id="profi"
                value={Iskustvo.Profesionalac}
                {...register("iskustvo", {
                    required: "Ovo je obavezno polje"
                })}
              />
            </RadioButton>
          </DDSliderItem>
        </DropDownSlider>
        <p className={classes.pError}>
          {errors.iskustvo?.message && <MdErrorOutline />}
          {errors.iskustvo?.message}
        </p>

        <DropDownSlider text="Koliko dugo bi posao trajao?">
          <DDSliderItem>
            <RadioButton htmlFor="manjeMesec" tekst="Manje od mesec dana">
            <input
                className={errors.naslov ? `${classes.error}` : ""}
                type="radio"
                id="manjeMesec"
                value={DuzinaPosla.ManjeOdMesec}
                {...register("duzinaPosla", {
                    required: "Ovo je obavezno polje"
                })}
              />
            </RadioButton>
          </DDSliderItem>
          <DDSliderItem>
            <RadioButton htmlFor="mesecTri" tekst="1 do 3 meseci">
            <input
                className={errors.naslov ? `${classes.error}` : ""}
                type="radio"
                id="mesecTri"
                value={DuzinaPosla.JedanDoTriMeseca}
                {...register("duzinaPosla", {
                    required: "Ovo je obavezno polje"
                })}
              />
            </RadioButton>
          </DDSliderItem>
          <DDSliderItem>
            <RadioButton htmlFor="triSest" tekst="3 do 6 meseci">
            <input
                className={errors.naslov ? `${classes.error}` : ""}
                type="radio"
                id="triSest"
                value={DuzinaPosla.TriDoSestMeseci}
                {...register("duzinaPosla", {
                    required: "Ovo je obavezno polje"
                })}
              />
            </RadioButton>
          </DDSliderItem>
          <DDSliderItem>
            <RadioButton htmlFor="viseSest" tekst="Više od 6 meseci">
            <input
                className={errors.naslov ? `${classes.error}` : ""}
                type="radio"
                id="viseSest"
                value={DuzinaPosla.ViseOdSestMeseci}
                {...register("duzinaPosla", {
                    required: "Ovo je obavezno polje"
                })}
              />
            </RadioButton>
          </DDSliderItem>
        </DropDownSlider>

        <p className={classes.pError}>
          {errors.duzinaPosla?.message && <MdErrorOutline />}
          {errors.duzinaPosla?.message}
        </p>
      </div>
    </>
  );
}
