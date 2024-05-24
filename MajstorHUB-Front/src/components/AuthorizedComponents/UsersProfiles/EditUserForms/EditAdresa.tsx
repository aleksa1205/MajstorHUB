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

function EditAdresa({ close, updateUser, userData }: PropsValues) {
    const form = useForm<FromValues>({defaultValues: {
        value: userData.adresa
    }});
    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    function onSubmit(formValues : FromValues) {
        const { value } = formValues;
        updateUser(prev => ({...prev!, adresa: value}));
    }

    return (
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.header}>
                <h3>Promenite adresu</h3>
                <IoClose onClick={close} size='2rem' />
            </div>
    
            <p>Molimo vas da unesete adresu u sledećem formatu: </p>
            <ul>
                <li>Ime Mesta</li>
                <li>Broj ulice (ukoliko je imate)</li>
                <li>Broj zgrade i broj stana (ukoliko stanujete)</li>
            </ul>
            
            <label htmlFor="adresa">Adresa</label>
            <input
                className={errors.value ? `${classes.error}` : ""}
                type="text"
                id="adresa"
                placeholder="Niš, Aleksandra Medvedeva 14"
                {...register("value", {
                    required: 'Ovo je obavezno polje',
                    minLength: {
                        value: 5,
                        message: "Adresa mora da ima barem 5 karaktera"
                    },
                    maxLength: {
                        value: 30,
                        message: "Adresa ne moze da bude duza od 30 karaktera"
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

export default EditAdresa;