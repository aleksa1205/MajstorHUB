import { MdErrorOutline } from "react-icons/md";
import classes from './EditUserForm.module.css'
import { useForm } from "react-hook-form";
import { userDataUpdateType } from "../../../../api/DTO-s/updateSelfTypes";
import { Struka } from "../../../../api/DTO-s/responseTypes";
import { IoClose } from "react-icons/io5";
import DropDown from "../../../Theme/DropDown/DropDown";
import UserType from "../../../../lib/UserType";

type FromValues = {
    value: number;
};

type PropsValues = {
    close: () => void,
    updateUser: React.Dispatch<React.SetStateAction<userDataUpdateType | null>>,
    userData: userDataUpdateType;
}

function EditStruka({ close, updateUser, userData }: PropsValues) {
    const form = useForm<FromValues>({defaultValues: {
        value: userData.userType === UserType.Majstor ? userData.struka : Struka.Fasada
    }});
    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    function onSubmit(formValues : FromValues) {
        const { value } = formValues; 

        updateUser(prev => ({...prev!, struka: value}));
    }

    const sveStruke = Object.keys(Struka)
                        .filter((v) => !isNaN(Number(v)));

    return (
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.header}>
                <h3>Promenite struku</h3>
                <IoClose onClick={close} size='2rem' />
            </div>

            <p>Izaberite struku iz liste ponuđenih struka. Ovo polje vam pomaže da bi vas klijenti lakše pronašli prilikom pretraživanja.</p>
            <p>Ukoliko ne možete da pronađete vašu struku kontaktirajte nas da bi smo je dodali</p>
            
            <label htmlFor="struka">Struka</label>
            <DropDown>
                <select
                    className={errors.value ? `${classes.error}` : ""}
                    id="struka"
                    {...register("value", {
                        valueAsNumber: true,
                        required: 'Ovo je obavezno polje',
                    })}
                >
                    {sveStruke.map((e) => {
                        const el = parseInt(e, 10);
                        if(el !== Struka.Nedefinisano) {
                            return (
                                <option key={el} value={el}>{Struka[el]}</option>
                            )
                        }
                    }
                    )}
                </select>
            </DropDown>
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

export default EditStruka;