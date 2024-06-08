import classes from "./LoginEmailForm.module.css";
import { Link, useLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MdErrorOutline } from "react-icons/md";
import UserType from "../../../lib/UserType";
import { CiUser } from "react-icons/ci";
import { useEffect } from "react";
import useUserController from "../../../api/controllers/useUserController";
import { useErrorBoundary } from "react-error-boundary";
import { PopUpMessage } from "../../../hooks/usePopUpMessage";

type FromValues = {
  email: string;
};

type PropsValues = {
  setUserTypesFound: React.Dispatch<React.SetStateAction<UserType[]>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPopUpMessage: React.Dispatch<React.SetStateAction<PopUpMessage | null>>
};

function LoginEmailForm({ setUserTypesFound, setEmail, setPopUpMessage } : PropsValues) {
  const { emailExists } = useUserController();
  const {showBoundary} = useErrorBoundary();
  const message = useLoaderData();

  useEffect(() => {
    if(typeof message === 'string') {
      setPopUpMessage({
        message,
        type: 'info'
      })
    }
  }, []);

  const form = useForm<FromValues>();
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  async function onSubmit(formData: FromValues) {
    const { email } = formData;
    const userTypesArr = [UserType.Korisnik, UserType.Majstor, UserType.Firma];
    let userTypesFound: Array<UserType> = [];

    // Puni niz tipovima usera koji imaju prosledjen email u bazi

    for (const type of userTypesArr) {
      let data;
      try {
        data = await emailExists(type, email);
      } catch (error) {
        showBoundary(error);
      }

      if (data) userTypesFound.push(type);
    }

    if (userTypesFound.length == 0) {
      setPopUpMessage({
        message: "Email koji ste uneli ne postoji",
        type: 'warning'
      })
    }
    else {
      setEmail(email);
      setUserTypesFound(userTypesFound);
    }
  }

  return (
    <>
      <form
        className={`${classes.form}`}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3>Ulogujte se na MajstorHub</h3>
        <div className={classes.formControl}>
          <div
            className={
              classes.inputGroup +
              " " +
              `${errors.email ? `${classes.error}` : ""}`
            }
          >
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
          <button
            disabled={isSubmitting}
            className={
              "mainButton" + " " + `${isSubmitting ? "button--loading" : ""}`
            }
          >
            <span className="button__text">Nastavi</span>
          </button>
        </div>
        <div className={`${classes.register} ${classes.formControl}`}>
          <p className="separator">Nemate Nalog?</p>
          <Link to="/register" className="secondaryButton">
            Registrujte Se
          </Link>
        </div>
      </form>
    </>
  );
}

export default LoginEmailForm;
