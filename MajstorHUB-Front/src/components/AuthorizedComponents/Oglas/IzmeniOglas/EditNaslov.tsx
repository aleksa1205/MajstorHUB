import { MdErrorOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useContext } from "react";
import { EditOglasFormContext } from "./EditOglasMain";
import classes from './IzmeniOglas.module.css'
import frClasses from '../../../FormStyles/Form.module.css';
import { NaslovOglasaValidation } from "../../../../lib/Forms/FormValidation";

type FromValues = {
    value: string;
};

export default function EditNaslov() {
    const { close, oglasData, setOglas } = useContext(EditOglasFormContext)!;

    const form = useForm<FromValues>({defaultValues: {
        value: oglasData.naslov
    }});
    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    function onSubmit(formValues : FromValues) {
        const { value } = formValues;

        setOglas(prev => ({...prev!, naslov: value}));
    }

    return (
        <form className={`${frClasses.form} ${classes.form}`} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={frClasses.header}>
                <h3>Promenite Naslov</h3>
                <IoClose onClick={close} size='2rem' />
            </div>

            <p>Naslov je prva stvar koju izvođači radova vide, zato neka bude upečatljiv! Ovo pomaže da vaša ponuda oglasa privuče prave izvođače.</p>
            
            <label className={frClasses.label} htmlFor="naslov">Naslov</label>
            <input
                className={errors.value ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                type="text"
                id="naslov"
                placeholder='Zamena starog laminata za tarket i ravnajući sloj'
                {...register("value", NaslovOglasaValidation)}
            />
            <p className={frClasses.pError}>
                {errors.value?.message && <MdErrorOutline />}
                {errors.value?.message}
            </p>

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