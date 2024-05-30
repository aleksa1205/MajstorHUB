import { useContext } from 'react';
import classes from './PostaviOglas.module.css'
import { FormContext, stepsLength } from '../../../../routes/Oglasi/PostaviOglas';
import { MdErrorOutline } from 'react-icons/md';

export default function NaslovForm() {
    const { register, errors, currentStep } = useContext(FormContext)!;

    return (
        <>
            <div className={classes.description}>
                <div className={classes.steps}>
                    <span>{currentStep + 1}/{stepsLength}</span>
                    <span>Postavljanje Oglasa</span>
                </div>
                <h2>Počnimo sa dobrim naslovom.</h2>
                <p>Naslov je prva stvar koju izvođači radova vide, zato neka bude upečatljiv! Ovo pomaže da vaša ponuda oglasa privuče prave izvođače.</p>
            </div>

            <div className={classes.inputs}>
                <label className={classes.label} htmlFor="naslov">Unesite naslov vašeg oglasa</label>
                <input
                    className={errors.naslov ? `${classes.error}` : ""}
                    type="text"
                    id="ime"
                    placeholder='Zamena starog laminata za tarket i ravnajući sloj'
                    {...register("naslov", {
                    required: "Ovo je obavezno polje",
                    minLength: {
                        value: 3,
                        message: 'Mora barem 3 karaktera'
                    },
                    maxLength: {
                        value: 50,
                        message: 'Maksimum 50 karaktera'
                    },
                    pattern: {
                        value: /^[a-zA-Z\s]*$/,
                        message: "Naslov mora da zadrzi samo slova",
                    },
                    })}
                />
                <p className={classes.pError}>
                    {errors.naslov?.message && <MdErrorOutline />}
                    {errors.naslov?.message}
                </p>
            </div>
        </>
    )
}