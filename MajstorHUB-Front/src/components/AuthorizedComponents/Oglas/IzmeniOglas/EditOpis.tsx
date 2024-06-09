import { MdErrorOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useContext } from "react";
import { EditOglasFormContext } from "./EditOglasMain";
import classes from './IzmeniOglas.module.css'
import frClasses from '../../../FormStyles/Form.module.css';
import { NaslovOglasaValidation, OpisOglasaValidation } from "../../../../lib/Forms/FormValidation";

type FromValues = {
    value: string;
};

export default function EditOpis() {
    const { close, oglasData, setOglas } = useContext(EditOglasFormContext)!;

    const form = useForm<FromValues>({defaultValues: {
        value: oglasData.opis
    }});
    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    function onSubmit(formValues : FromValues) {
        const { value } = formValues;

        setOglas(prev => ({...prev!, opis: value}));
    }

    return (
        <form className={`${frClasses.form} ${classes.form}`} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={frClasses.header}>
                <h3>Promenite Opis</h3>
                <IoClose onClick={close} size='2rem' />
            </div>

            <div style={{overflowY: 'scroll', height: window.innerWidth < 1000 ? '400px' : 'auto'}}>
                <p>Izvođači traže:</p>
                <ul>
                    <li>Veštine potrebne za vaš posao</li>
                    <li>Dobra komunikacija</li>
                    <li>Detalji o tome kako vi ili vaš tim volite da radite</li>
                </ul>
            
                <label className={frClasses.label} htmlFor="opis">Naslov</label>
                <textarea
                    className={errors.value ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                    id="opis"
                    rows={10}
                    placeholder='Zamena starog laminata za tarket i ravnajući sloj'
                    {...register("value", OpisOglasaValidation)}
                />
                <p className={frClasses.pError}>
                    {errors.value?.message && <MdErrorOutline />}
                    {errors.value?.message}
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