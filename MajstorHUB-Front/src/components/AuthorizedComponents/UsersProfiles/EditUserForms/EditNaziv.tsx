import { MdErrorOutline } from "react-icons/md";
import classes from './EditUserForm.module.css'
import { useForm } from "react-hook-form";
import { userDataUpdateType } from "../../../../api/DTO-s/updateSelfTypes";
import { IoClose } from "react-icons/io5";
import UserType from "../../../../lib/UserType";

type FromValues = {
    value: string;
};

type PropsValues = {
    close: () => void,
    updateUser: React.Dispatch<React.SetStateAction<userDataUpdateType | null>>,
    userData: userDataUpdateType;
}

function EditImeFirme({ close, updateUser, userData }: PropsValues) {
    const form = useForm<FromValues>({defaultValues: {
        value: userData.userType === UserType.Firma ? userData.naziv : ''
    }});
    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    function onSubmit(formValues : FromValues) {
        const { value } = formValues;
        updateUser(prev => ({...prev!, naziv: value}));
    }

    return (
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.header}>
                <h3>Promenite Ime Firme</h3>
                <IoClose onClick={close} size='2rem' />
            </div>
    
            <p>Unesite ime vaše firme</p>
            
            <label htmlFor="adresa">Ime Firme</label>
            <input
                className={errors.value ? `${classes.error}` : ""}
                type="text"
                id="adresa"
                placeholder="Konkordija"
                {...register("value", {
                    required: "Ovo je obavezno polje",
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "Ime firme mora da zadrzi samo slova i razmake",
                    },
                    minLength: {
                      value: 4,
                      message: 'Mora barem 4 karaktera'
                    },
                    maxLength: {
                      value: 30,
                      message: 'Maksimum 30 karaktera'
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

export default EditImeFirme;