import classes from "./RegisterOptions.module.css";
import { FaHandshake } from "react-icons/fa";
import { MdConstruction } from "react-icons/md";
import UserType from "../../../lib/UserType";

type PropsType = {
  setSelected: React.Dispatch<React.SetStateAction<number>>;
  children: React.ReactNode;
};

function RegisterOptions({ setSelected, children }: PropsType) {
  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setSelected(parseInt(event.target.value));
  }

  return (
    <main className={classes.main}>
      <div className={`container`}>
        <div className={classes.kontinjer}>
          <label className={classes.option}>
            <FaHandshake className={classes.icon} size="3rem" />
            <h3 className={classes.naslov}>
              Ja sam klijent, zapošljavam za projekat
            </h3>
            <input
              onChange={changeHandler}
              value={UserType.Korisnik}
              name="userType"
              type="radio"
            />
            <span className={classes.checkmark}></span>
          </label>

          <label className={classes.option}>
            <MdConstruction className={classes.icon} size="3rem" />
            <h3 className={classes.naslov}>
              Ja sam izvođač radova, tražim posao
            </h3>
            <input
              onChange={changeHandler}
              value={UserType.Izvodjac}
              name="userType"
              type="radio"
            />
            <span className={classes.checkmark}></span>
          </label>
        </div>
        {children}
      </div>
    </main>
  );
}

export default RegisterOptions;

/* <h3 className={classes.naslov}> <MdConstruction size='3rem' />Registrujte se kao Izvođač Radova</h3>
<p>Pridružite se našoj platformi kao izvođač radova i pronađite nove poslove u građevinskoj industriji. Predstavite svoje veštine i iskustvo, povežite se sa potencijalnim klijentima i izgradite uspešnu karijeru u građevinarstvu.</p> */

/* <h3  className={classes.naslov}> <FaHandshake size='3rem' />Registrujte se kao Klijent</h3>
<p>Kao klijent naše platforme, pružamo vam mogućnost da pronađete kvalifikovane izvođače radova za svoje građevinske projekte. Registrujte se i postavite svoje zahteve, pregledajte profile izvođača i pronađite savršenog partnera za ostvarenje vaših građevinskih ciljeva.</p> */
