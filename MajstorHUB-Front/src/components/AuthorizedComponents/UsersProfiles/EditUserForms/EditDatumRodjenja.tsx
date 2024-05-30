import { MdErrorOutline } from "react-icons/md";
import classes from './EditUserForm.module.css'
import { useForm } from "react-hook-form";
import { userDataUpdateType } from "../../../../api/DTO-s/updateSelfTypes";
import { IoClose } from "react-icons/io5";
import UserType from "../../../../lib/UserType";

type FromValues = {
    value: Date;
};

type PropsValues = {
    close: () => void,
    updateUser: React.Dispatch<React.SetStateAction<userDataUpdateType | null>>,
    userData: userDataUpdateType;
}

function EditDatumRodjenja({ close, updateUser, userData }: PropsValues) {
    const form = useForm<FromValues>({defaultValues: {
        value: userData.userType !== UserType.Firma ? userData.datumRodjenja : new Date()
    }});
    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    function onSubmit(formValues : FromValues) {
        const { value } = formValues;
        updateUser(prev => ({...prev!, datumRodjenja: value}));
    }

    return (
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.header}>
                <h3>Promenite datum rođenja</h3>
                <IoClose onClick={close} size='2rem' />
            </div>
    
            <p>Niste u obavezi da unesete ovaj podatak ukoliko ne želite.</p>
            <p>Ukoliko ne unesete datum rođenja on se postavlja na datum kreiranja naloga</p>
            
            <label htmlFor="datumRodjenja">Datum Rođenja</label>
            <input
                className={errors.value ? `${classes.error}` : ""}
                type="date"
                id="datumRodjenja"
                {...register("value", {
                    required: 'Ovo polje je obavezno',
                    valueAsDate: true,
                    validate: (fieldValue) => {
                        const date = new Date(fieldValue);
                    
                        const isValid = date < new Date();
                    
                        return isValid || 'Izabran datum je veci od danasnjeg'
                    }
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

export default EditDatumRodjenja;