import classes from "../components/AuthComponents/RegisterComponents/Regsiter.module.css";
import RegisterOptions from "../components/AuthComponents/RegisterComponents/RegisterOptions";
import RegisterForm from "../components/AuthComponents/RegisterComponents/RegisterForm";
import { useState } from "react";
import { Link } from "react-router-dom";
import UserType from "../lib/UserType";
import { FaCircleCheck } from "react-icons/fa6";

function Register() {
  const [selected, setSelected] = useState(-1);
  const [formSelected, setFormSelected] = useState(-1);

  function selectButtonHandler(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setFormSelected(parseInt(event.currentTarget.value));
  }

  const registerOptions = (
    <RegisterOptions setSelected={setSelected}>
    <div className={classes.kontinjer}>
      {selected == -1 && (
        <button disabled className="mainButton">
          Napravi Nalog
        </button>
      )}

      {selected == UserType.Korisnik && (
        <button
          onClick={selectButtonHandler}
          className={`mainButton ${classes.clientBtn}`}
          value={UserType.Korisnik}
        >
          Pridruži se kao klijent
        </button>
      )}

      {selected == UserType.Izvodjac && (
        <div className={classes.buttonWrapper}>
          <button
            onClick={selectButtonHandler}
            className="mainButton"
            value={UserType.Firma}
          >
            Pridruži se kao građevinska firma
          </button>
          <button
            onClick={selectButtonHandler}
            className="mainButton"
            value={UserType.Majstor}
          >
            Pridruži se kao majstor
          </button>
        </div>
      )}

      <p>
        Već imate nalog?{" "}
        <Link to="/login" className="secondLink">
          Ulogujte se
        </Link>
      </p>
    </div>
  </RegisterOptions>
  )

  return (
    <>
        {formSelected == -1 && registerOptions}
        {formSelected == UserType.Korisnik && <RegisterForm setSelected={setFormSelected} formType={UserType.Korisnik}/>}
        {formSelected == UserType.Majstor && <RegisterForm setSelected={setFormSelected} formType={UserType.Majstor} />}
        {formSelected == UserType.Firma && <RegisterForm setSelected={setFormSelected} formType={UserType.Firma} />}
        {formSelected == UserType.Uspesno && (
          <div className={`container ${classes.main}`}>
            <div className={classes.success}>
              <FaCircleCheck size='3rem' className={classes.icons} />
              <h2>Uspešno ste se registrovali, sada vam preostaje da se <Link className={classes.link} to='/login'>ulogujete</Link> na platformu</h2>
            </div>
          </div>
        )}
        {formSelected == UserType.Neuspesno && (
          <div className={`container ${classes.main}`}>
            <div className={classes.error}>
              <h2>:( <br /><br /> Došlo je do greške prilikom registrovanja, pokušajte kasnije ili se obratite korisnickom servisu</h2>
            </div>
          </div>
        )}
    </>
  );
}

export default Register;
