import { useContext } from 'react';
import classes from './PostaviOglas.module.css'
import { FormContext, stepsLength } from '../../../../routes/Oglasi/PostaviOglas';
import { MdErrorOutline } from 'react-icons/md';

export default function OpisForm() {
    const { register, errors, currentStep } = useContext(FormContext)!;

    return (
        <>
            <div className={classes.description}>
                <div className={classes.steps}>
                    <span>{currentStep + 1}/{stepsLength}</span>
                    <span>Postavljanje Oglasa</span>
                </div>
                <h2>Zapčnite razgovor.</h2>
                <p>Izvođači traže:</p>
                <ul>
                    <li>Veštine potrebne za vaš posao</li>
                    <li>Dobra komunikacija</li>
                    <li>Detalji o tome kako vi ili vaš tim volite da radite</li>
                </ul>
            </div>

            <div className={classes.inputs}>
                <label className={classes.label} htmlFor="opis">Opišite šta vam je potrebno</label>
                <textarea
                    className={errors.naslov ? `${classes.error}` : ""}
                    id="opis"
                    placeholder="Već imate spreman opis? Nalepite ga ovde!"
                    rows={10}
                    {...register("opis", {
                    required: "Ovo je obavezno polje",
                    minLength: {
                        value: 50,
                        message: 'Mora barem 50 karaktera'
                    },
                    maxLength: {
                        value: 30000,
                        message: 'Maksimum 30000 karaktera'
                    },
                    })}
                />
                <p className={classes.pError}>
                    {errors.opis?.message && <MdErrorOutline />}
                    {errors.opis?.message}
                </p>
            </div>
        </>
    )
}