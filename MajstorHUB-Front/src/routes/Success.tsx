import classes from "../components/SuccErr.module.css";
import { Link } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";

function Success() {
  return (
    <div className={`container ${classes.main}`}>
      <div className={classes.success}>
        <FaCircleCheck size="2.5rem" className={classes.icons} />
        <h3>
          Uspešno ste se registrovali, sada vam preostaje da se{" "}
          <Link className={classes.link} to="/login">
            ulogujete
          </Link>{" "}
          na platformu
        </h3>
      </div>
    </div>
  );
}

export default Success;
