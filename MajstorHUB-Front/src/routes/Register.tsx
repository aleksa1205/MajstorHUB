import classes from "../components/AuthComponents/RegisterComponents/Regsiter.module.css";
import RegisterOptions from "../components/AuthComponents/RegisterComponents/RegisterOptions";
import RegisterForm from "../components/AuthComponents/RegisterComponents/RegisterForm";
import { useState } from "react";
import { Link } from "react-router-dom";
import UserType from "../lib/UserType";

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
        {formSelected == UserType.Korisnik && <RegisterForm formType={UserType.Korisnik}/>}
        {formSelected == UserType.Majstor && <RegisterForm formType={UserType.Majstor} />}
        {formSelected == UserType.Firma && <RegisterForm formType={UserType.Firma} />}
    </>
  );
}

export default Register;
