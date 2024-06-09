import { MdErrorOutline } from "react-icons/md";
import classes from './EditUserForm.module.css'
import { useForm } from "react-hook-form";
import { userDataUpdateType } from "../../../../api/DTO-s/updateSelfTypes";
import { Struka, getStrukaDisplayName } from "../../../../api/DTO-s/responseTypes";
import { IoClose } from "react-icons/io5";
import DropDown from "../../../Theme/DropDown/DDSelect";
import { useEffect, useState } from "react";
import UserType from "../../../../lib/UserType";

type FormValues = {
    value: number;
};

type PropsValues = {
    close: () => void,
    updateUser: React.Dispatch<React.SetStateAction<userDataUpdateType | null>>,
    userData: userDataUpdateType
}

function EditStruke({ close, updateUser, userData }: PropsValues) {
    const form = useForm<FormValues>();
    const { register, handleSubmit, formState, watch, setError, clearErrors, reset } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    const [selectedFields, setSelectedFields] = useState<Array<Struka>>(
        userData.userType === UserType.Firma && userData.struke && userData.struke.length > 0 && userData.struke[0] !== Struka.Nedefinisano ? userData.struke : []
    );

    if (isSubmitSuccessful) setTimeout(() => close(), 0);

    const sveStruke = Object.keys(Struka)
                            .filter(v => !isNaN(Number(v)));

    const inputValue = watch('value');

    useEffect(() => {
        if (inputValue && inputValue !== 0 && !selectedFields.includes(inputValue)) {
            if (selectedFields.length < 15) {
                clearErrors();
                setSelectedFields(prev => [...prev, inputValue]);
                reset({ value: 0 }); // Reset the select input after adding
            } else {
                setError('value', {
                    type: 'manual',
                    message: 'Maksimalan broj struka je 15'
                });
            }
        }
    }, [inputValue]);

    function deleteHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const struka: Struka = parseInt(e.currentTarget.value);
        setSelectedFields(prev => prev.filter(el => el !== struka));
        clearErrors();
    }

    function onSubmit() {
        if (selectedFields.length === 0) {
            setError('value', {
                type: 'manual',
                message: 'Molimo vas izaberite struku'
            });
        } else {
            updateUser(prev => ({ ...prev!, struke: selectedFields }));
        }
    }

    return (
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.header}>
                <h3>Promenite struku</h3>
                <IoClose onClick={close} size='2rem' />
            </div>

            <div style={{ overflowY: 'scroll', height: window.innerWidth < 1000 ? '400px' : 'auto' }}>
                <p>Izaberite struku iz liste ponuđenih struka. Ovo polje vam pomaže da bi vas klijenti lakše pronašli prilikom pretraživanja.</p>
                <p>Ukoliko ne možete da pronađete vašu struku kontaktirajte nas da bi smo je dodali</p>

                <label htmlFor="struka">Struke</label>
                <DropDown>
                    <select
                        className={errors.value ? `${classes.error}` : ""}
                        id="struka"
                        {...register("value", {
                            valueAsNumber: true,
                            required: 'Ovo je obavezno polje',
                        })}
                    >
                        <option value="0">Izaberite Struku</option>
                        {sveStruke.map((e) => {
                            const el = parseInt(e, 10);
                            if (el !== Struka.Nedefinisano) {
                                return (
                                    <option key={el} value={el} disabled={selectedFields.includes(el)}>
                                        {getStrukaDisplayName(el)}
                                    </option>
                                );
                            }
                        })}
                    </select>
                </DropDown>
                <p>Maksimalno 15 struka</p>
                <p className={classes.pError}>
                    {errors.value?.message && <MdErrorOutline />}
                    {errors.value?.message}
                </p>

                <div className={classes.vestine}>
                    {
                        selectedFields.map(el => {
                            return (
                                <div key={el} className={classes.vestina}>
                                    {getStrukaDisplayName(el)}
                                    <button type="button" onClick={deleteHandler} value={el}>
                                        <IoClose size='1.3rem' />
                                    </button>
                                </div>)
                        })
                    }
                </div>
            </div>

            <div className={classes.btnContainer}>
                <button className='secondLink' onClick={close} type='button'>Cancel</button>
                <button
                    disabled={isSubmitting}
                    className={"mainButtonSmall" + " " + `${isSubmitting ? "button--loading" : ""}`}
                >
                    <span className="button__text">Save</span>
                </button>
            </div>
        </form>
    )
}

export default EditStruke;
