import classes from "./LoginEmailForm.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MdErrorOutline } from "react-icons/md";
import UserType, { pathToUser } from "../../../lib/UserType";
import { CiUser } from "react-icons/ci";
import { useState } from "react";
import { IoIosWarning } from "react-icons/io";
import { getEmailExists } from "../../../api/serverRequests";
import { Form } from "react-router-dom";

type FromValues = {
  email: string;
};

type PropsValues = {
  setUserTypesFound : React.Dispatch<React.SetStateAction<UserType[]>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>
}

function LoginEmailForm({ setUserTypesFound, setEmail } : PropsValues) {
  const navigate = useNavigate();

  const [emailExists, setEmailExists] = useState(true);

  const form = useForm<FromValues>();
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  async function onSubmit(formData : FromValues) {
    const { email } = formData;
    const userTypesArr = [UserType.Korisnik, UserType.Majstor, UserType.Firma];
    let userTypesFound : Array<UserType> = [];

    // Puni niz tipovima usera koji imaju prosledjen email u bazi

    for(const type of userTypesArr) {
      const data = await getEmailExists(type, email);

      if(data === null) {
        console.log('sjebo sam, sad moram da te redirectujem');
        navigate('/error');
      }

      if(data) userTypesFound.push(type);
    }

    if(userTypesFound.length == 0)
      setEmailExists(false);
    else {
      setEmailExists(true);
      setEmail(email);
      setUserTypesFound(userTypesFound);
    }
  }

  return (
    <>
      {!emailExists && (
        <div className='warrningBox'>
          <IoIosWarning size='1.25rem' className={classes.warningIcon} />
          <div>
            <p>Email koji ste uneli ne postoji</p>
          </div>
        </div>
      )}

      <form className={`${classes.form}`} noValidate onSubmit={handleSubmit(onSubmit)}>
        <h3>Ulogujte se na MajstorHub</h3>
        <div className={classes.formControl}>
          <div className={classes.inputGroup + ' ' + `${errors.email ? `${classes.error}` : ""}`}>
            <CiUser size="2rem" className={classes.inputIcon} />
            <input
              type="text"
              id="email"
              placeholder="Email"
              {...register("email", {
                required: "Molimo vas unesite Email",
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Format email-a neispravan",
                },
                // validate: async (fieldValue) {

                // }
              })}
            />
          </div>
          <p className={classes.pError}>
            {errors.email?.message && <MdErrorOutline />}
            {errors.email?.message}
          </p>
        </div>

        <div className={`${classes.center} ${classes.formControl}`}>
          <button disabled={isSubmitting} className={"mainButton" + ' ' + `${isSubmitting ? 'button--loading' : ''}`}>
            <span className="button__text">Nastavi</span>
          </button>
        </div>
        <div className={`${classes.register} ${classes.formControl}`}>
          <p className="separator">Nemate Nalog?</p>
          <Link
            to="/register"
            className='secondaryButton'
          >
            Registrujte Se
          </Link>
        </div>
      </form>
    </>
  );
}

export default LoginEmailForm;
