import { MdErrorOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useContext } from "react";
import { EditOglasFormContext } from "./EditOglasMain";
import classes from './IzmeniOglas.module.css'
import frClasses from '../../../FormStyles/Form.module.css';
import { LokacijaValidation } from "../../../../lib/Forms/FormValidation";

type FromValues = {
    value: string;
};

export default function EditLokacija() {
    const { close, oglasData, setOglas } = useContext(EditOglasFormContext)!;

    const form = useForm<FromValues>({defaultValues: {
        value: oglasData.lokacija
    }});
    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    function onSubmit(formValues : FromValues) {
        const { value } = formValues;

        setOglas(prev => ({...prev!, lokacija: value}));
    }

    return (
        <form className={`${frClasses.form} ${classes.form}`} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={frClasses.header}>
                <h3>Promenite Lokaciju</h3>
                <IoClose onClick={close} size='2rem' />
            </div>

            <p>Lokacija može da bude: </p>
            <ul>
                <li>Grad</li>
                <li>Selo</li>
                <li>Mesto</li>
                <li>Optština</li>
            </ul>
            
            <label className={frClasses.label} htmlFor="lokacija">Lokacija</label>
            <input
                className={errors.value ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                type="text"
                id="lokacija"
                placeholder='Niš'
                {...register("value", LokacijaValidation)}
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