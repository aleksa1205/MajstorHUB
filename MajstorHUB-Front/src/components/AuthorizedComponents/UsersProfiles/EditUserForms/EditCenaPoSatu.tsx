import { MdErrorOutline } from "react-icons/md";
import classes from './EditUserForm.module.css'
import { useForm } from "react-hook-form";
import { userDataUpdateType } from "../../../../api/DTO-s/updateSelfTypes";
import { IoClose } from "react-icons/io5";
import UserType from "../../../../lib/UserType";
import { useEffect, useState } from "react";

type FromValues = {
    value: number;
};

type PropsValues = {
    close: () => void,
    updateUser: React.Dispatch<React.SetStateAction<userDataUpdateType | null>>,
    userData: userDataUpdateType;
}

function EditCenaPoSatu({ close, updateUser, userData }: PropsValues) {
    const form = useForm<FromValues>({defaultValues: {
        value: userData.userType !== UserType.Korisnik ? userData.cenaPoSatu : 0
    }});
    const { register, handleSubmit, formState, watch } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;
    
    const inputValue = watch("value");

    const [oduzimanje, setOduzimanje] = useState<number>(inputValue * 0.1);
    const [zarada, setZarada] = useState<number>(inputValue * 0.9);

    useEffect(() => {
        let valueBef = inputValue * 0.1
        let value = Math.round((valueBef + Number.EPSILON) * 100) / 100
        setOduzimanje(value);

        valueBef = inputValue * 0.9;
        value = Math.round((valueBef + Number.EPSILON) * 100) / 100
        setZarada(value)
    }, [inputValue])
    

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    function onSubmit(formValues : FromValues) {
        const { value } = formValues;
        updateUser(prev => ({...prev!, cenaPoSatu: value}));
    }

    return (
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.header}>
                <h3>Promenite cenu po satu</h3>
                <IoClose onClick={close} size='2rem' />
            </div>
    
            <p>Vaša nova cena po satu će se odnositi samo na nove poslove.</p>
            <p>Trenutna vaša cena: {userData.userType !== UserType.Korisnik ? userData.cenaPoSatu : 0}/din po satu</p>

            <div className={classes.firstCenaContainer}>
                <div className={classes.cenaContainer}>
                    <label htmlFor="cenaPoSatu">Cena po satu</label>
                    <div>
                        <div className={classes.cenaDinContainer}>
                            <input
                                className={errors.value ? `${classes.error} ${classes.cenaInput}` : `${classes.cenaInput}`}
                                type="text"
                                id="cenaPoSatu"
                                {...register("value", {
                                    required: 'Ovo je obavezno polje',
                                    pattern: {
                                        value: /^\d+$/,
                                        message: "Cena mora da sadrži samo brojeve",
                                    },
                                    validate: (value) => {
                                        const valid = value >= 100 && value <= 99999
                                        return valid || 'Cena mora da bude u rangu od 100din do 99 999din'
                                    }
                                })}
                            />
                            <p>/din</p>
                        </div>
                    </div>
                </div>
                <p className={classes.pError}>
                    {errors.value?.message && <MdErrorOutline />}
                    {errors.value?.message}
                </p>
                <hr className={classes.cenahr} />
            </div>

            <div>
                <div className={classes.cenaContainer}>
                    <label htmlFor="taksa">10% MajstorHUB taksa</label>
                    <div>
                        <div className={classes.cenaDinContainer}>
                            <input
                                className={errors.value ? `${classes.error} ${classes.cenaInput}` : `${classes.cenaInput}`}
                                type="text"
                                id="taksa"
                                value={`-${oduzimanje}`}
                                disabled
                            />
                            <p>/din</p>
                        </div>
                    </div>
                </div>
                <p className={classes.pError}></p>
                <hr className={classes.cenahr} />
            </div>

            <div>
                <div className={classes.cenaContainer}>
                    <label htmlFor="taksa">Vi dobijate</label>
                    <div>
                        <div className={classes.cenaDinContainer}>
                            <input
                                className={errors.value ? `${classes.error} ${classes.cenaInput}` : `${classes.cenaInput}`}
                                type="text"
                                id="zarada"
                                value={zarada}
                                disabled
                            />
                            <p>/din</p>
                        </div>
                    </div>
                </div>
                <p className={classes.pError}></p>
                <hr className={classes.cenahr} />
            </div>

            <div className={classes.btnContainer}>
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

export default EditCenaPoSatu;