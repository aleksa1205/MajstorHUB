import { FieldErrors, RegisterOptions, UseFormRegister, useForm } from 'react-hook-form';
import { FirmaDataUpdate, KorisnikDataUpdate, MajstorDataUpdate, userDataUpdateType } from '../../../../api/DTO-s/updateSelfTypes';
import classes from './EditUserForm.module.css'
import { Iskustvo, Struka } from '../../../../api/DTO-s/responseTypes';
import { MdErrorOutline } from 'react-icons/md';
import { useErrorBoundary } from 'react-error-boundary';
import useUserController from '../../../../api/controllers/useUserController';
import UserType from '../../../../lib/UserType';
import Modal from '../../../Theme/Modal/Modal';

// Uopste mi se ne svidja implementacija ovoga, pokusao sam da napravim dinamcku komponentu za editovanje profila, sto sam i uspeo ali
// je kod toliko necitljiv i uzasan zato sto za odredjena polja za editovanje ne prikazuje <input /> nego nesto drugo.
// Kada pravim ovo za editovanje oglasa pravim posebnu komponentu za sve makar sve bilo hardkodirano
// IDEJA ZA DALJE: kreiras komponentu form koja u kontekstu ima sve podatke vezane za registrovanje forme, ima dugmice, nalazi se u modal...
// i onda za svaku posebno formu pises kod

type FromValues = {
    value: string | number | Date | Struka | Iskustvo;
    value2?: string;
};

type EditFormType = {
    userData : userDataUpdateType;
    setUserData : React.Dispatch<React.SetStateAction<userDataUpdateType | null>>;
    fieldName : keyof KorisnikDataUpdate | keyof MajstorDataUpdate | keyof FirmaDataUpdate;
    heading : string;
    description : string;
    closeModal: () => void;
}

function EditUserForm({userData, fieldName, setUserData, heading, description, closeModal} : EditFormType) {
    const form = useForm<FromValues>();
    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting } = formState;
    
    const { showBoundary } = useErrorBoundary();
    const { emailExists } = useUserController();

    const { options, inputType } = getRegisterOptions(fieldName, showBoundary, emailExists, userData.userType);

    function onSubmit(formData : FromValues) {
        const { value, value2 } = formData;

        // const newObject : userDataUpdateType = {...userData, [fieldName]: value};

        if(fieldName === 'ime' || fieldName === 'prezime') 
            setUserData(prev => ({ ...prev!, [fieldName]: value, prezime: value2! }));
        else {
            setUserData(prev => ({ ...prev!, [fieldName]: value }));
        }
    }

    let result;
    if(fieldName === 'ime' || fieldName === 'prezime')
        result = <ImePrezime errors={errors} register={register} />;
    else if(fieldName === 'opis') {
        result = (
            <textarea {...register('value', options)}></textarea>
        )
    }
    else {
        result = (
            <input
                className={errors.value ? `${classes.error}` : ""}
                type={inputType}
                id={fieldName}
                {...register("value", options)}
            />
        )
    }
        

    return (
        
        <Modal onClose={closeModal}>
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                <h3>{heading}</h3>
                <p>{description}</p>

                {fieldName !== 'ime' && fieldName !== 'prezime' && 
                <label>{heading}</label>}

                {result}

                {fieldName !== 'ime' && fieldName !== 'prezime' &&
                <p className={classes.pError}>
                    {errors.value?.message && <MdErrorOutline />}
                    {errors.value?.message}
                </p>
                }

                <div className={classes.btnContainer}>
                    <button
                        disabled={isSubmitting}
                        className={
                        "mainButtonSmall" + " " + `${isSubmitting ? "button--loading" : ""}`
                        }
                        >
                        <span className="button__text">Save</span>
                    </button>

                    <button className='secondLink' onClick={closeModal} type='button'>Cancel</button>
                </div>
            </form>
        </Modal>
    )
}

export default EditUserForm;

type ReturnType = {
    options : RegisterOptions<FromValues, "value">;
    inputType : React.HTMLInputTypeAttribute
}

function getRegisterOptions(
    fieldName : keyof KorisnikDataUpdate | keyof MajstorDataUpdate | keyof FirmaDataUpdate,
    showBoundary: (error: any) => void,
    emailExists: (type: UserType, email: string) => Promise<boolean>,
    type : UserType )
    : ReturnType {
    let options : RegisterOptions<FromValues, "value"> = {};
    let inputType : React.HTMLInputTypeAttribute = 'text';
    
    switch (fieldName) {
        case 'naziv':
            options = {
                required: 'Ovo je obavezno polje',
                minLength: {
                    value: 4,
                    message: "Naziv mora da ima barem 3 karaktera"
                },
                maxLength: {
                    value: 30,
                    message: "Naziv ne moze da bude duzi od 30 karaktera"
                },
                pattern: {
                    value: /^[a-zA-Z]+$/,
                    message: "Ime firme mora da zadrzi samo slova",
                }
            }
            break;
        case 'email':
            options = {
                required: "Email je obavezno polje",
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Format email-a neispravan",
                },
                validate: async (fieldValue) => {
                  let data;
                  try {
                    if(typeof fieldValue === 'string')
                        data = await emailExists(type, fieldValue)
                    else
                        console.error('Greska, fieldValue mora da bude string');
                  } catch (error) {
                    showBoundary(error);
                  }
                  
                  return !data || 'Email vec postoji';
                }
            }
            break;
        case 'adresa':
            options = {
                required: 'Ovo je obavezno polje',
                minLength: {
                    value: 5,
                    message: "Adresa mora da ima barem 5 karaktera"
                },
                maxLength: {
                    value: 30,
                    message: "Adresa ne moze da bude duza od 30 karaktera"
                },
            }
            break;
        case 'brojTelefona':
            options = {
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
            }
            break;
        case 'cenaPoSatu':
            options = {
                required: 'Ovo je obavezno polje',
                maxLength: {
                    value: 4,
                    message: "Cena ne sme da bude veca od 1000"
                },
                pattern: {
                    value: /^\d+$/,
                    message: "Cena mora da sadrži samo brojeve",
                },
            }
            break;
        case 'datumRodjenja':
            inputType = 'date';
            options = {
                required: 'Ovo polje je obavezno',
                valueAsDate: true,
                validate: (fieldValue) => {
                    const date = new Date(fieldValue);
                
                    const isValid = date < new Date();
                
                    return isValid || 'Izabran datum je veci od danasnjeg'
                }
            }
            break;
        case 'slika':
            inputType = 'image'
            break;
        case 'opis':
            options = {
                required: 'Ovo je obavezno polje',
                minLength: {
                    value: 20,
                    message: "Opis mora da ima barem 20 karaktera"
                },
                maxLength: {
                    value: 5000,
                    message: "Opis moze maksimalno da ima 5000 karaktera"
                },
            }
            break;
        default:
            break;
    }

    return { options, inputType };
}

type InputProps = {
    register: UseFormRegister<FromValues>;
    errors: FieldErrors<FromValues>
}

function ImePrezime({register, errors} : InputProps) {
    return (
        <> 
            <label htmlFor="ime">Ime</label>
            <input
                className={errors.value ? `${classes.error}` : ""}
                type="text"
                id="ime"
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
        </>
    )
}