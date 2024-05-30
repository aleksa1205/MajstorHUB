import { useContext } from 'react';
import classes from './PostaviOglas.module.css'
import { FormContext, stepsLength } from '../../../../routes/Oglasi/PostaviOglas';
import { MdErrorOutline } from 'react-icons/md';

export default function CenaForm() {
    const { currentStep, register, errors } = useContext(FormContext)!;

    return (
        <>
            <div className={classes.description}>
                <div className={classes.steps}>
                    <span>{currentStep + 1}/{stepsLength}</span>
                    <span>Postavljanje Oglasa</span>
                </div>
                <h2>Recite nam o vašem budžetu</h2>
                <p>Ovo nam pomaže da bolje pronađemo izvođača radova koji vam odgovara.</p>
            </div>

            <div className={classes.inputs}>
                <label className={classes.labelBold} htmlFor="cena">Koja je vaša procena cene ovog posla?</label>
                <p>Možete za cenu da se dogovarate sa izvođačem radova kasnije prilikom sklapanja posla.</p>
                <input
                    className={errors.naslov ? `${classes.error}` : ""}
                    type="text"
                    id="cena"
                    placeholder='5000'
                    {...register("cena", {
                    required: "Ovo je obavezno polje",
                    valueAsNumber: true,
                    validate: (fieldValue) => {
                        let msg: string = "";
                        let valid = false;
        
                        if (fieldValue < 1000 || fieldValue > 1000000)
                          msg = "Iznos mora da bude između 1000 i 1 000 000 dinara";
                        else if (Number.isNaN(fieldValue))
                          msg = "Dozvoljeni su samo brojevi";
                        else valid = true;
        
                        return valid || msg;
                      },
                    })}
                />
                <p className={classes.pError}>
                    {errors.cena?.message && <MdErrorOutline />}
                    {errors.cena?.message}
                </p>
            </div>
        </>
    )
}