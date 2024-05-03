import { useForm } from "react-hook-form";
import UserType from "../../../lib/UserType";
import classes from "./LoginEmailForm.module.css";
import { Link, useNavigate } from "react-router-dom";
import { MdErrorOutline, MdLockOutline } from "react-icons/md";
import { useState } from "react";
import { postLogin } from "../../../api/serverRequests";

type FormValues = {
  password: string;
};

type PropsValues = {
  email: string;
  userType: UserType;
  reset: React.Dispatch<React.SetStateAction<UserType[]>>;
};

function LoginPasswordForm({ email, userType, reset }: PropsValues) {
  const navigate = useNavigate();
    const [isWrongPassword, setIsWrongPassword] = useState(false);

  const form = useForm<FormValues>();
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  async function onSubmit(formData : FormValues) {
    const { password } = formData;

    const data = await postLogin(userType, email, password);

    if(data === null) 
      navigate('/error');
    else if(!data)
      setIsWrongPassword(true);
    else {
      setIsWrongPassword(false);
      console.log(data);
    }
  }
  return (
    <>
      <form
        className={`${classes.form}`}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3>Dobrodošli</h3>
        <p style={{ textAlign: "center", marginBottom: "2rem" }}>{email}</p>
        <div className={classes.formControl}>
          <div
            className={
              classes.inputGroup +
              " " +
              `${errors.password ? `${classes.error}` : ""}`
            }
          >
            <MdLockOutline size="2rem" className={classes.inputIcon} />
            <input
              type="password"
              id="password"
              placeholder="Šifra"
              {...register("password", {
                required: "Molimo vas unesite šifru",
              })}
            />
          </div>

          {errors.password != null && (
            <p className={classes.pError}>
                {errors.password?.message && <MdErrorOutline />}
                {errors.password?.message}
            </p>
          )}

        {isWrongPassword && (
            <p className={classes.pError}>
                <MdErrorOutline />
                Pogrešna šifra
            </p>
        )}
          <p style={{fontWeight: 'bold'}} className={`secondLink`}>Zaboravili ste šifru?</p>
        </div>

        <div className={`${classes.center} ${classes.formControl}`}>
          <button
            disabled={isSubmitting}
            className={
              "mainButton" + " " + `${isSubmitting ? "button--loading" : ""}`
            }
          >
            <span className="button__text">Uloguj se</span>
          </button>
        </div>

        <div className={classes.formControl}>
          <button
            onClick={() => reset([])}
            type="button"
            className={`secondLink ${classes.nisteViBtn}`}
          >
            Niste vi?
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

export default LoginPasswordForm;