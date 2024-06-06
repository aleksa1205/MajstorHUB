import { MdErrorOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useContext } from "react";
import { EditOglasFormContext } from "./EditOglasMain";
import classes from './IzmeniOglas.module.css'
import frClasses from '../../../FormStyles/Form.module.css';
import { NaslovOglasaValidation } from "../../../../lib/Forms/FormValidation";
import DropDownSlider, { DDSliderItem } from "../../../Theme/DropDown/DropDownSlider";
import RadioButton from "../../../Theme/RadioButton/RadioButton";
import { Iskustvo } from "../../../../api/DTO-s/responseTypes";
import { DuzinaPosla } from "../../../../api/DTO-s/Oglasi/OglasiDTO";

type FromValues = {
    iskustvo: string;
    vreme: string;
};

export default function EditIskustvoVreme() {
    const { close, oglasData, setOglas } = useContext(EditOglasFormContext)!;

    const form = useForm<FromValues>({defaultValues: {
        iskustvo: oglasData.iskustvo.toString(),
        vreme: oglasData.duzinaPosla.toString()
    }});
    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    function onSubmit(formValues : FromValues) {
        const { iskustvo, vreme } = formValues;

        setOglas(prev => ({...prev!, iskustvo: parseInt(iskustvo), duzinaPosla: parseInt(vreme)}));
    }

    return (
        <form className={`${frClasses.form} ${classes.form}`} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={frClasses.header}>
                <h3>Promenite Iskutvo i Duzinu posla</h3>
                <IoClose onClick={close} size='2rem' />
            </div>

            <div style={{overflow: 'scroll', height: window.innerHeight < 900 ? '400px' : 'auto'}}>
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
                className={errors.iskustvo ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
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
                className={errors.iskustvo ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
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
                className={errors.iskustvo ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
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
                className={errors.vreme ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                type="radio"
                id="manjeMesec"
                value={DuzinaPosla.ManjeOdMesec}
                {...register("vreme", {
                    required: "Ovo je obavezno polje"
                })}
              />
            </RadioButton>
          </DDSliderItem>
          <DDSliderItem>
            <RadioButton htmlFor="mesecTri" tekst="1 do 3 meseci">
            <input
                className={errors.vreme ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                type="radio"
                id="mesecTri"
                value={DuzinaPosla.JedanDoTriMeseca}
                {...register("vreme", {
                    required: "Ovo je obavezno polje"
                })}
              />
            </RadioButton>
          </DDSliderItem>
          <DDSliderItem>
            <RadioButton htmlFor="triSest" tekst="3 do 6 meseci">
            <input
                className={errors.vreme ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                type="radio"
                id="triSest"
                value={DuzinaPosla.TriDoSestMeseci}
                {...register("vreme", {
                    required: "Ovo je obavezno polje"
                })}
              />
            </RadioButton>
          </DDSliderItem>
          <DDSliderItem>
            <RadioButton htmlFor="viseSest" tekst="Više od 6 meseci">
            <input
                className={errors.vreme ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                type="radio"
                id="viseSest"
                value={DuzinaPosla.ViseOdSestMeseci}
                {...register("vreme", {
                    required: "Ovo je obavezno polje"
                })}
              />
            </RadioButton>
          </DDSliderItem>
        </DropDownSlider>

        <p className={classes.pError}>
          {errors.vreme?.message && <MdErrorOutline />}
          {errors.vreme?.message}
        </p>
            </div>

            <div className={frClasses.btnContainer}>
                <button className='secondLink' onClick={close} type='button'>Cancel</button>
                <button
                    disabled={isSubmitting}
                    className={
                    "mainButtonSmall" + " " + `${isSubmitting ? "button--loading" : ""}`
                    }
                    >
                    <span className="button__text">Save</span>
                </button>

            </div>
        </form>
    )
}