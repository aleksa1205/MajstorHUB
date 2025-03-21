import { MdErrorOutline } from "react-icons/md";
import classes from './EditUserForm.module.css'
import { useForm } from "react-hook-form";
import { userDataUpdateType } from "../../../../api/DTO-s/updateSelfTypes";
import { IoClose } from "react-icons/io5";

type FromValues = {
    value: string;
};

type PropsValues = {
    close: () => void,
    updateUser: React.Dispatch<React.SetStateAction<userDataUpdateType | null>>,
    userData: userDataUpdateType;
}

function EditBrojTelefona({ close, updateUser, userData }: PropsValues) {
    const form = useForm<FromValues>({defaultValues: {
        value: userData.brojTelefona
    }});

    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    function onSubmit(formValues : FromValues) {
        const { value } = formValues;
        updateUser(prev => ({...prev!, brojTelefona: value}));
    }

    return (
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.header}>
                <h3>Promenite broj telefona</h3>
                <IoClose onClick={close} size='2rem' />
            </div>
    
            <p>Upisite broj telefona koji koristite za posao, preporuka je da ne unosite vaš privatan broj telefona</p>
            
            <label htmlFor="brojTelefona">Broj telefona</label>
            <input
                className={errors.value ? `${classes.error}` : ""}
                type="text"
                id="brojTelefona"
                placeholder="0612345678"
                {...register("value", {
                    required: 'Ovo je obavezno polje',
                    minLength: {
                        value: 10,
                        message: "Broj telefona mora da ima tacno 10 broja"
                    },
                    maxLength: {
                        value: 10,
                        message: "Broj telefona mora da ima tacno 10 broja"
                    },
                    pattern: {
                        value: /^\d+$/,
                        message: "Broj telefona mora da sadrži samo brojeve",
                    },
                })}
            />
            <p className={classes.pError}>
                {errors.value?.message && <MdErrorOutline />}
                {errors.value?.message}
            </p>

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

export default EditBrojTelefona;