import { MdErrorOutline } from "react-icons/md";
import classes from './IzmeniOglas.module.css'
import frClasses from '../../../FormStyles/Form.module.css';
import { useForm } from "react-hook-form";
import { Struka, getStrukaDisplayName } from "../../../../api/DTO-s/responseTypes";
import { IoClose } from "react-icons/io5";
import DropDown from "../../../Theme/DropDown/DDSelect";
import { useContext, useEffect, useState } from "react";
import { EditOglasFormContext } from "./EditOglasMain";

type FromValues = {
    value: number;
};

export default function EditVestine() {

    const { close, oglasData, setOglas } = useContext(EditOglasFormContext)!;

    const form = useForm<FromValues>();
    const { register, handleSubmit, formState, watch, setError, clearErrors } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    const [increment, setIncrement] = useState<number>(0);

    const [selectedFields, setSelectedFields] = useState<Array<Struka>>(
        oglasData.struke
    )

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    const sveStruke = Object.keys(Struka)
                            .filter(v => !isNaN(Number(v)));

    const inputValue = watch('value');

    useEffect(() => {
        if(selectedFields.includes(inputValue) || typeof inputValue === 'undefined' || inputValue === 0)
            return;

        if(selectedFields.length < 10) {
            clearErrors();
            setSelectedFields(prev => [...prev, inputValue]);
            //setError(null);
        }
        else{
            setError('value', {
                type: 'manual',
                message: 'Maksimalan broj struka je 10'
            });
        }

    }, [increment]);

    function deleteHandler(e : React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const struka : Struka = parseInt(e.currentTarget.value);
        setSelectedFields(prev => prev.filter(el => el !== struka));
        clearErrors();
    }

    function onSubmit() {
        if(selectedFields.length === 0) {
            setError('value', {
                type: 'manual',
                message: 'Molimo vas izaberite struku'
            })
        } else
            setOglas(prev => ({...prev!, struke: selectedFields}));
    }

    return (
        <form className={`${frClasses.form} ${classes.form}`} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={frClasses.header}>
                <h3>Promenite Veštine</h3>
                <IoClose onClick={close} size='2rem' />
            </div>

            <div style={{overflow: 'scroll', height: window.innerHeight < 900 ? '400px' : 'auto'}}>
            <p>Koje su glavne veštine potrebne za vaš posao?</p>
            
            <label htmlFor="struka">Struke</label>
            <DropDown>
                <select
                    className={errors.value ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                    id="struka"
                    {...register("value", {
                        valueAsNumber: true,
                        required: 'Ovo je obavezno polje',
                    })}
                >
                    <option value="0">Izaberite Struku</option>
                    {sveStruke.map((e) => {
                        const el = parseInt(e, 10);
                        if(el !== Struka.Nedefinisano) {
                            const isIncluded = selectedFields.includes(el)
                            return (
                                <option onClick={() => setIncrement(prev => prev + 1)} disabled={isIncluded} key={el} value={el}>{getStrukaDisplayName(el)}</option>
                            )
                        }
                    }
                    )}
                </select>
            </DropDown>
            <p>Maksimalno 10 struka</p>
            <p className={frClasses.pError}>
                {errors.value?.message && <MdErrorOutline />}
                {errors.value?.message}
            </p>

            <div className={frClasses.vestine}>
            {
                selectedFields.map(el => {
                    return (
                    <div key={el} className={frClasses.vestina}>
                        {getStrukaDisplayName(el)}
                        <button type="button" onClick={deleteHandler} value={el}>
                            <IoClose size='1.3rem' />
                        </button>
                    </div>)
                })
            }
            </div>

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