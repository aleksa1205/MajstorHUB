import classes from "./RegisterForm.module.css";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { MdErrorOutline } from "react-icons/md";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import UserType from "../../../lib/UserType";

type FormValues = {
  ime: string,
  prezime: string,
  jmbg: string,
  email: string,
  sifra: string,
  ponovoSifra: string,
  uslovi: boolean
};

type PropsValue = {
  formType : UserType
}

function RegisterForm({ formType } : PropsValue) {
  const form = useForm<FormValues>();
  const { register, control, handleSubmit, formState, watch } = form;
  const { errors, isSubmitting } = formState;

  let formTypeString : string;
  switch(formType) {
    case UserType.Korisnik:
      formTypeString = 'Klijent';
      break;
    case UserType.Majstor:
      formTypeString = 'Majstor';
      break;
    case UserType.Firma:
      formTypeString = 'Firma';
      break;
    default:
      formTypeString = 'Nepoznato'
      break;
  }

  const password = watch('sifra');

  const onSubmit = (data : FormValues) => {
    console.log('Form submitted', data);
  }

  return (
    <div className={classes.main}>
          <form onSubmit={handleSubmit(onSubmit)} className={`container ${classes.form}`} noValidate>
            
            <h3>Pridruži se kao {formTypeString}</h3>
            <hr />

            <div className={`${classes.imePrezime} ${classes.formControl}`}>
              <div>
                <label htmlFor="ime">Ime</label>
                <input className={errors.ime ? `${classes.error}` : ''} type="text" id="ime" {...register('ime', {
                  required: 'Ime je obavezno polje',
                  pattern: {
                    value: /^[a-zA-Z]+$/,
                    message: 'Ime mora da zadrzi samo slova'
                  }
                }
                )} />
                <p>
                  {errors.ime?.message && <MdErrorOutline />}
                  {errors.ime?.message}
                </p>
              </div>
              <div>
                <label htmlFor="prezime">Prezime</label>
                <input className={errors.prezime ? `${classes.error}` : ''} type="text" id="prezime" {...register('prezime', {
                  required: 'Prezime je obavezno polje',
                  pattern: {
                    value: /^[a-zA-Z]+$/,
                    message: 'Prezime mora da zadrzi samo slova'
                  }
                })} />
                <p>
                  {errors.prezime?.message && <MdErrorOutline />}
                  {errors.prezime?.message}
                </p>
              </div>
            </div>

            <div className={classes.formControl}>
              <label htmlFor="jmbg">JMBG</label>
              <input placeholder='13 broja' className={errors.jmbg ? `${classes.error}` : ''} type="text" id="jmbg" {...register('jmbg', {
                required: 'JMBG je obavezno polje',
                minLength: {
                  value: 13,
                  message: 'JMBG mora imati tačno 13 karaktera'
                },
                maxLength: {
                  value: 13,
                  message: 'JMBG mora imati tačno 13 karaktera'
                },
                pattern: {
                  value: /^\d+$/,
                  message: 'JMBG mora da sadrži samo brojeve'
                }
              })} />
              <p>
                {errors.jmbg?.message && <MdErrorOutline />}
                {errors.jmbg?.message}
              </p>
            </div>

            <div className={classes.formControl}>
              <label htmlFor="email">Email</label>
              <input className={errors.email ? `${classes.error}` : ''} type="text" id="email" {...register('email', {
                required: 'Email je obavezno polje',
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: 'Format email-a neispravan'
                },
                validate: async (fieldValue) => {
                  const response = await fetch(`https://localhost:7163/Korisnik/GetByEmail/${fieldValue}`);
                  const data = await response.json();
                  console.log(response);
                  return data.length == 0 || 'Email je vec postoji'
                }
              })} />
              <p>
                {errors.email?.message && <MdErrorOutline />}
                {errors.email?.message}
              </p>
            </div>

            <div className={classes.formControl}>
              <label htmlFor="sifra">Sifra</label>
              <input placeholder='Minimim 8 karaktera' className={errors.sifra ? `${classes.error}` : ''} type="text" id="sifra" {...register('sifra', {
                required: 'Sifra je obavezno polje',
                minLength: {
                  value: 8,
                  message: 'Sifra mora da ima minimum 8 karaktera'
                }
              })} />
              {password != null && <PasswordStrengthMeter password={password} />}
              <p>
                {errors.sifra?.message && <MdErrorOutline />}
                {errors.sifra?.message}
              </p>
            </div>

            <div className={classes.formControl}>
              <label htmlFor="ponovoSifra">Ponovite Sifru</label>
              <input className={errors.ponovoSifra ? `${classes.error}` : ''} type="text" id="ponovoSifra" {...register('ponovoSifra', {
                required: 'Unesite ponovo sifru',
                validate: (fieldValue) => {
                  return (
                    fieldValue === password ||
                    'Sifre se ne poklapaju'
                  )
                }
              })} />
              <p>
                {errors.ponovoSifra?.message && <MdErrorOutline />}
                {errors.ponovoSifra?.message}
              </p>
            </div>

            <div className={classes.formControl}>
              <label htmlFor="uslovi" className="checkbox">Slažem se sa Uslovima korišćenja i Pravilima o privatnosti
                <input type="checkbox" id="uslovi" {...register('uslovi', {
                  required: {
                    value: true,
                    message: 'Molimo vas da se slozite sa uslovima koriscenja'
                  }
                })} />
                <span className={errors.uslovi ? `checkmark ${classes.error}` : 'checkmark'}></span>
              </label>
              <p>
                {errors.uslovi?.message && <MdErrorOutline />}
                {errors.uslovi?.message}
              </p>
            </div>

            <div className={`${classes.center} ${classes.formControl}`}>
              <button disabled={isSubmitting} className='mainButton'>Napravi nalog</button>
            </div>
            <div className={`${classes.center} ${classes.formControl}`}>
              <p>Već imate nalog? <Link to='/login' className="secondLink">Ulogujte se</Link></p>
            </div>
          </form>
          <DevTool control={control}/>
    </div>
  );
}

export default RegisterForm;
