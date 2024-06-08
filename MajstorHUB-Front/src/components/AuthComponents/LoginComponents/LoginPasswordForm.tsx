import { useForm } from "react-hook-form";
import UserType, { pathToUser } from "../../../lib/UserType";
import classes from "./LoginEmailForm.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdErrorOutline, MdLockOutline } from "react-icons/md";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useUserController, { WrongPasswordError } from "../../../api/controllers/useUserController";
import { useErrorBoundary } from "react-error-boundary";
import { PopUpMessage } from "../../../hooks/usePopUpMessage";
import { ForbiddenError } from "../../../api/controllers/useOglasController";

type FormValues = {
  password: string;
};

type PropsValues = {
  email: string;
  userType: UserType;
  reset: React.Dispatch<React.SetStateAction<UserType[]>>;
  setPopUpMessage: React.Dispatch<React.SetStateAction<PopUpMessage | null>>
};

function LoginPasswordForm({ email, userType, reset, setPopUpMessage }: PropsValues) {
  const { setAuth } = useAuth();
  const { login } = useUserController();
  const {showBoundary} = useErrorBoundary();

  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const navigate = useNavigate();
  const [isWrongPassword, setIsWrongPassword] = useState(false);

  const form = useForm<FormValues>();
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  async function onSubmit(formData: FormValues) {
    const { password } = formData;

    try {
      const data = await login(userType, email, password);

      // Auth context (mesto gde cuvamo sve podatke o trenutno logovanom useru) 
      // mora da se updatuje kada submitujemo login formu
      setAuth({
        naziv: data.naziv,
        userId: data.userId,
        email,
        jwtToken: data.jwtToken,
        expiration: data.expiration,
        refreshToken: data.refreshToken,
        userType,
        role: data.role
      });

      // Nesto ne radi kada nema setTimeout
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);

      setIsWrongPassword(false);
    } catch (error) {
      if (error instanceof ForbiddenError) {
          setPopUpMessage({
            message: "Vaš nalog je blokiran",
            type: "error"
          })
          setIsWrongPassword(false);
      }
      else if (error instanceof WrongPasswordError) {
        setIsWrongPassword(true);
      }
      else
        showBoundary(error);

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
          <p style={{ fontWeight: "bold" }} className={`secondLink`}>
            Zaboravili ste šifru?
          </p>
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
