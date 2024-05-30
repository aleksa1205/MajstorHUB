import { MdErrorOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useContext } from "react";
import { EditOglasFormContext } from "./EditOglasMain";
import classes from './IzmeniOglas.module.css'
import frClasses from '../../../FormStyles/Form.module.css';
import { CenaOglasaValidation, NaslovOglasaValidation } from "../../../../lib/Forms/FormValidation";

type FromValues = {
    value: number;
};

export default function EditCena() {
    const { close, oglasData, setOglas } = useContext(EditOglasFormContext)!;

    const form = useForm<FromValues>({defaultValues: {
        value: oglasData.cena
    }});
    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    function onSubmit(formValues : FromValues) {
        const { value } = formValues;

        setOglas(prev => ({...prev!, cena: value}));
    }

    return (
        <form className={`${frClasses.form} ${classes.form}`} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={frClasses.header}>
                <h3>Promenite Budžet</h3>
                <IoClose onClick={close} size='2rem' />
            </div>

            <p>Možete za cenu da se dogovarate sa izvođačem radova kasnije prilikom sklapanja posla.</p>
            
            <label className={frClasses.label} htmlFor="cena">Budžet</label>
            <input
                className={errors.value ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                type="text"
                id="cena"
                placeholder='5000'
                {...register("value", CenaOglasaValidation)}
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