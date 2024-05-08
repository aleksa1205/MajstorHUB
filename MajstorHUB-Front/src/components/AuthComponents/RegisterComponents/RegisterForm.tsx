import classes from "./RegisterForm.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { MdErrorOutline } from "react-icons/md";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import UserType, { userToPath } from "../../../lib/UserType";
import useUserController from "../../../api/controllers/useUserController";

type FormValues = {
  ime?: string;
  prezime?: string;
  imeFirme?: string;
  jmbg?: string;
  pib?: string;
  email: string;
  sifra: string;
  ponovoSifra: string;
  uslovi: boolean;
};

type KorisnikDto = {
  Ime : string,
  Prezime : string,
  JMBG : string,
  Email : string,
  Sifra : string
}

type FirmaDto = {
  ImeFirme : string,
  PIB : string,
  Email : string,
  Sifra : string
}

type PropsValue = {
  formType: UserType;
  setSelected : React.Dispatch<React.SetStateAction<number>>
};

function RegisterForm({ formType, setSelected }: PropsValue) {
  const { emailExists, jmbgExists, pibExists, register: registerUser } = useUserController();
  const navigate = useNavigate();

  const form = useForm<FormValues>();
  const { register, control, handleSubmit, formState, watch } = form;
  const { errors, isSubmitting } = formState;

  const password = watch("sifra");

  const onSubmit = async (formData: FormValues) => {
    // console.log("Form submitted", formData);
    let sendData : FirmaDto | KorisnikDto;

    if(formType == UserType.Korisnik || formType == UserType.Majstor) {
      sendData = {
        'Ime': formData.ime!,
        'Prezime': formData.prezime!,
        'JMBG': formData.jmbg!,
        'Email': formData.email,
        'Sifra': formData.sifra
      }
    }
    else {
      sendData = {
        'ImeFirme': formData.imeFirme!,
        'PIB': formData.pib!,
        'Email': formData.email,
        'Sifra': formData.sifra
      }
    }

    const data = await registerUser(formType, sendData);
    if(data === null) navigate('/error');
    else navigate('/success');
  };

  // Specificne form control-e za svakog vrsta usera
  let imePrezimeFormControl,
    imeFirmeFormControl,
    jmbgFormControl,
    pibFormControl = <></>;

    // Mora i ovde da se vrsi provera tipa forme jer ako se ne proveri
    // dodajemo automatski nepotrebne propertije koji su nam required i necemo moci da submitujemo formu
  if (formType == UserType.Korisnik || formType == UserType.Majstor) {
    imePrezimeFormControl = (
      <div className={`${classes.imePrezime} ${classes.formControl}`}>
        <div>
          <label htmlFor="ime">Ime</label>
          <input
            className={errors.ime ? `${classes.error}` : ""}
            type="text"
            id="ime"
            {...register("ime", {
              required: "Ime je obavezno polje",
              pattern: {
                value: /^[a-zA-Z]+$/,
                message: "Ime mora da zadrzi samo slova",
              },
            })}
          />
          <p>
            {errors.ime?.message && <MdErrorOutline />}
            {errors.ime?.message}
          </p>
        </div>
        <div>
          <label htmlFor="prezime">Prezime</label>
          <input
            className={errors.prezime ? `${classes.error}` : ""}
            type="text"
            id="prezime"
            {...register("prezime", {
              required: "Prezime je obavezno polje",
              pattern: {
                value: /^[a-zA-Z]+$/,
                message: "Prezime mora da zadrzi samo slova",
              },
            })}
          />
          <p>
            {errors.prezime?.message && <MdErrorOutline />}
            {errors.prezime?.message}
          </p>
        </div>
      </div>
    );

    jmbgFormControl = (
      <div className={classes.formControl}>
        <label htmlFor="jmbg">JMBG</label>
        <input
          placeholder="13 broja"
          className={errors.jmbg ? `${classes.error}` : ""}
          type="text"
          id="jmbg"
          {...register("jmbg", {
            required: "JMBG je obavezno polje",
            minLength: {
              value: 13,
              message: "JMBG mora imati tačno 13 karaktera",
            },
            maxLength: {
              value: 13,
              message: "JMBG mora imati tačno 13 karaktera",
            },
            pattern: {
              value: /^\d+$/,
              message: "JMBG mora da sadrži samo brojeve",
            },
            validate: async (fieldValue) => {
              let data;
              
              if(typeof fieldValue === 'string')
                data = await jmbgExists(formType, fieldValue)
              if(data === null) navigate('/error');
              
              return !data || 'JMBG vec postoji';
              
              // const url = `${userUrl}/JmbgExists/${fieldValue}`;
              // const response = await fetch(url);
              // const data = await response.json();
              // console.log('Cekaj kenjam (jmbg)');
              // return !data || 'JMBG vec postoji';
            }
          })}
        />
        <p>
          {errors.jmbg?.message && <MdErrorOutline />}
          {errors.jmbg?.message}
        </p>
      </div>
    );
  } else if(formType == UserType.Firma) {
    imeFirmeFormControl = (
      <div className={classes.formControl}>
        <label htmlFor="imeFirme">Ime Firme</label>
        <input
          className={errors.imeFirme ? `${classes.error}` : ""}
          type="text"
          id="ime"
          {...register("imeFirme", {
            required: "Ime firme je obavezno polje",
            pattern: {
              value: /^[a-zA-Z]+$/,
              message: "Ime firme mora da zadrzi samo slova",
            },
          })}
        />
        <p>
          {errors.imeFirme?.message && <MdErrorOutline />}
          {errors.imeFirme?.message}
        </p>
      </div>
    );

    pibFormControl = (
      <div className={classes.formControl}>
        <label htmlFor="pib">PIB</label>
        <input
          placeholder="8 broja"
          className={errors.pib ? `${classes.error}` : ""}
          type="text"
          id="pib"
          {...register("pib", {
            required: "PIB je obavezno polje",
            minLength: {
              value: 8,
              message: "PIB mora imati tačno 8 karaktera",
            },
            maxLength: {
              value: 8,
              message: "PIB mora imati tačno 8 karaktera",
            },
            pattern: {
              value: /^\d+$/,
              message: "PIB mora da sadrži samo brojeve",
            },
            validate: async (fieldValue) => {
              let data;
              
              if(typeof fieldValue === 'string')
                data = await pibExists(formType, fieldValue)
              if(data === null) navigate('/error');
              
              return !data || 'PIB vec postoji';

              // console.log('Cekaj kenjam (pib)');
              // const url = `${userUrl}/PibExists/${fieldValue}`;
              // const response = await fetch(url);
              // const data = await response.json();
              // return !data || 'PIb vec postoji';
            }
          })}
        />
        <p>
          {errors.pib?.message && <MdErrorOutline />}
          {errors.pib?.message}
        </p>
      </div>
    );
  }

  return (
    <div className={classes.main}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`container ${classes.form}`}
        noValidate
      >
        <h3>Pridruži se kao {userToPath(formType)}</h3>
        <hr />

        {(formType == UserType.Korisnik || formType == UserType.Majstor) && (
          <>
            {imePrezimeFormControl}
            {jmbgFormControl}
          </>
        )}
        {formType == UserType.Firma && (
          <>
            {imeFirmeFormControl}
            {pibFormControl}
          </>
        )}

        <div className={classes.formControl}>
          <label htmlFor="email">Email</label>
          <input
            className={errors.email ? `${classes.error}` : ""}
            type="text"
            id="email"
            {...register("email", {
              required: "Email je obavezno polje",
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Format email-a neispravan",
              },
              validate: async (fieldValue) => {
                let data;
              
                data = await emailExists(formType, fieldValue)
                if(data === null) navigate('/error');
                
                return !data || 'Email vec postoji';

                // console.log('Cekaj kenjam (email)');
                // const url = `${userUrl}/EmailExists/${fieldValue}`;
                // const response = await fetch(url);
                // const data = await response.json();
                // return !data || 'Email vec postoji';
              }
            })}
          />
          <p>
            {errors.email?.message && <MdErrorOutline />}
            {errors.email?.message}
          </p>
        </div>

        <div className={classes.formControl}>
          <label htmlFor="sifra">Sifra</label>
          <input
            placeholder="Minimim 8 karaktera"
            className={errors.sifra ? `${classes.error}` : ""}
            type="text"
            id="sifra"
            {...register("sifra", {
              required: "Sifra je obavezno polje",
              minLength: {
                value: 8,
                message: "Sifra mora da ima minimum 8 karaktera",
              },
            })}
          />
          {password != null && <PasswordStrengthMeter password={password} />}
          <p>
            {errors.sifra?.message && <MdErrorOutline />}
            {errors.sifra?.message}
          </p>
        </div>

        <div className={classes.formControl}>
          <label htmlFor="ponovoSifra">Ponovite Sifru</label>
          <input
            className={errors.ponovoSifra ? `${classes.error}` : ""}
            type="text"
            id="ponovoSifra"
            {...register("ponovoSifra", {
              required: "Unesite ponovo sifru",
              validate: (fieldValue) => {
                return fieldValue === password || "Sifre se ne poklapaju";
              },
            })}
          />
          <p>
            {errors.ponovoSifra?.message && <MdErrorOutline />}
            {errors.ponovoSifra?.message}
          </p>
        </div>

        <div className={classes.formControl}>
          <label htmlFor="uslovi" className="checkbox">
            Slažem se sa Uslovima korišćenja i Pravilima o privatnosti
            <input
              type="checkbox"
              id="uslovi"
              {...register("uslovi", {
                required: {
                  value: true,
                  message: "Molimo vas da se slozite sa uslovima koriscenja",
                },
              })}
            />
            <span
              className={
                errors.uslovi ? `checkmark ${classes.error}` : "checkmark"
              }
            ></span>
          </label>
          <p>
            {errors.uslovi?.message && <MdErrorOutline />}
            {errors.uslovi?.message}
          </p>
        </div>
        

        <div className={`${classes.center} ${classes.formControl}`}>
          <button disabled={isSubmitting}  className={"mainButton" + ' ' + `${isSubmitting ? 'button--loading' : ''}`}>
            Napravi nalog
          </button>
        </div>
        <div className={`${classes.center} ${classes.formControl}`}>
          <p>
            Već imate nalog?{" "}
            <Link to="/login" className="secondLink">
              Ulogujte se
            </Link>
          </p>
        </div>
      </form>
      <DevTool control={control} />
    </div>
  );
}

export default RegisterForm;
