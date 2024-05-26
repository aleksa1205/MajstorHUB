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
                <h3>Promenite lokaciju</h3>
                <IoClose onClick={close} size='2rem' />
            </div>
    
            <p>Lokacija može da bude: </p>
            <ul>
                <li>Grad</li>
                <li>Selo</li>
                <li>Mesto</li>
                <li>Optština</li>
            </ul>
            
            <label htmlFor="adresa">Lokacija</label>
            <input
                className={errors.value ? `${classes.error}` : ""}
                type="text"
                id="adresa"
                placeholder="Niš"
                {...register("value", {
                    required: 'Ovo je obavezno polje',
                    minLength: {
                        value: 2,
                        message: "Lokacija mora da ima barem 2 karaktera"
                    },
                    maxLength: {
                        value: 15,
                        message: "Lokacija ne moze da bude duza od 15 karaktera"
                    },
                    pattern: {
                        value: /^[a-zA-Z]+$/,
                        message: "Lokacija mora da zadrzi samo slova",
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