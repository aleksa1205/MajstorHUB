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

function EditOpis({ close, updateUser, userData }: PropsValues) {
    const form = useForm<FromValues>({defaultValues: {
        value: userData.opis
    }});
    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting, isSubmitSuccessful } = formState;

    if(isSubmitSuccessful) setTimeout(() => close(), 0);

    function onSubmit(formValues : FromValues) {
        const { value } = formValues;
        updateUser(prev => ({...prev!, opis: value}));
    }

    let res, placeholderText;

    if(userData.userType === UserType.Firma || userData.userType === UserType.Majstor) {
        res = (
            <>
                <p>Iskoristite ovaj prostor da pokažete klijentima da posedujete veštine i iskustvo koje traže.</p>
                <ul>
                    <li>Opišite svoje snage i veštine</li>
                    <li>Istaknite projekte, postignuća i obrazovanje</li>
                    <li>Budite sažeti i pazite da nema grešaka</li>
                </ul>
            </>
        )
        placeholderText =
        'Ja sam iskusni električar sa preko 10 godina iskustva u radu na stambenim i komercijalnim projektima. Specijalizovan sam za instalaciju i popravku elektroinstalacija, ugradnju osvetljenja i rešavanje problema sa elektroinstalacijama. Završio sam Elektrotehničku školu i redovno se usavršavam kroz razne kurseve. Moji klijenti cene moju pouzdanost, tačnost i kvalitet rada. Radujem se prilici da vam pomognem sa vašim projektom.'
    }
    else {
        res = (
            <>
                <p>Iskoristite ovaj prostor da pokažete majstorima i firmama kakve usluge i veštine tražite.</p>
                <ul>
                    <li>Opišite svoje zahteve i projekte</li>
                    <li>Istaknite specifične veštine i iskustvo koje vam je potrebno</li>
                    <li>Budite jasni i precizni kako biste pronašli idealnog majstora</li>
                </ul>
            </>
        )
        placeholderText =
        'Mi smo građevinska firma specijalizovana za renoviranje i izgradnju stambenih objekata. Često tražimo majstore sa iskustvom u električnim instalacijama, vodovodnim radovima i postavljanju pločica. Naši projekti obuhvataju sve, od manjih popravki do kompletnog renoviranja kuća. Cenimo profesionalnost, tačnost i visok kvalitet rada. Ako imate potrebne veštine i iskustvo, voleli bismo da sarađujemo sa vama.'
    }

    return (
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.header}>
                <h3>Promenite opis</h3>
                <IoClose onClick={close} size='2rem' />
            </div>

            {res}
            
            <label htmlFor="opis">Opis</label>
            <textarea
                className={errors.value ? `${classes.error}` : ""}
                id="adresa"
                maxLength={5000}
                rows={7}
                placeholder={placeholderText}
                {...register("value", {
                    required: 'Ovo je obavezno polje',
                    minLength: {
                        value: 100,
                        message: "Opis prekratak. Dobar opis sadži barem 100 karaktera"
                    },
                    maxLength: {
                        value: 5000,
                        message: "Opis moze maksimalno da ima 5000 karaktera"
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

export default EditOpis;