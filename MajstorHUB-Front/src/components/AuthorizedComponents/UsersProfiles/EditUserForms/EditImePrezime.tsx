import { MdErrorOutline } from "react-icons/md";
import classes from './EditUserForm.module.css'
import { useForm } from "react-hook-form";
import { userDataUpdateType } from "../../../../api/DTO-s/updateSelfTypes";
import { IoClose } from "react-icons/io5";
import UserType from "../../../../lib/UserType";

type FromValues = {
    value: string;
    value2: string;
};

type PropsValues = {
    close: () => void,
    updateUser: React.Dispatch<React.SetStateAction<userDataUpdateType | null>>,
    userData: userDataUpdateType;
}

function EditImePrezime({ close, updateUser, userData }: PropsValues) {
    const form = useForm<FromValues>({defaultValues: {
        value: userData.userType !== UserType.Firma ? userData.ime : '',
        value2: userData.userType !== UserType.Firma ? userData.prezime : '',
    }});
    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    function onSubmit(formValues : FromValues) {
        const { value, value2 } = formValues;
        updateUser(prev => ({...prev!, ime: value, prezime: value2}));
    }

    return (
        <form className={`${classes.form}`} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.header}>
                <h3>Promenite Ime i Prezime</h3>
                <IoClose onClick={close} size='2rem' />
            </div>

            <p>Nemojte unesiti srednje ime ili nadimke, unesite vaše puno ime i prezime</p>
            
            <label htmlFor="ime">Ime</label>
            <input
                className={errors.value ? `${classes.error}` : ""}
                type="text"
                id="ime"
                placeholder="Jovan"
                {...register("value", {
                required: "Ovo je obavezno polje",
                minLength: {
                    value: 4,
                    message: 'Ime mora da zadrzi najmanje 4 slova'
                },
                maxLength: {
                    value: 20,
                    message: 'Ime ne moze da ima vise od 20 slova'
                },
                pattern: {
                    value: /^[a-zA-Z]+$/,
                    message: "Ime mora da zadrzi samo slova",
                },
                })}
            />
            <p className={classes.pError}>
                {errors.value?.message && <MdErrorOutline />}
                {errors.value?.message}
            </p>

            <label htmlFor="prezime">Prezime</label>
            <input
                className={errors.value2 ? `${classes.error}` : ""}
                type="text"
                id="prezime"
                placeholder="Cvetković"
                {...register("value2", {
                required: "Ovo je obavezno polje",
                minLength: {
                    value: 4,
                    message: 'Prezime mora da zadrzi najmanje 4 slova'
                },
                maxLength: {
                    value: 20,
                    message: 'Prezime ne moze da ima vise od 20 slova'
                },
                pattern: {
                    value: /^[a-zA-Z]+$/,
                    message: "Prezime mora da zadrzi samo slova",
                },
                })}
            />
            <p className={classes.pError}>
                {errors.value2?.message && <MdErrorOutline />}
                {errors.value2?.message}
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

export default EditImePrezime;