import classes from "../components/SuccErr.module.css";
import { MdError } from "react-icons/md";

function Error() {
  return (
    <div className={`container ${classes.main}`}>
      <div className={classes.error}>
        <MdError size="2.5rem" className={classes.icons} />
        <h3>
          Došlo je do greške pri komunikaciji sa serverom, pokušajte kasnije ili se
          obratite korisničkom servisu
        </h3>
      </div>
    </div>
  );
}

export default Error;