import classes from "./SuccErr.module.css"
import { MdError } from "react-icons/md";
import { FallbackProps } from "react-error-boundary";
import { Link } from "react-router-dom";

function Error({ error, resetErrorBoundary} : FallbackProps) {
  return (
    <div className={`container ${classes.main}`}>
      <div className={classes.error}>
        <MdError size="2.5rem" className={classes.icons} />
        <h3>Doslo je do greške pri komunikaciji sa serverom</h3>
        <p>{error.message}</p>
        <button className={classes.errorButton2} onClick={resetErrorBoundary}>Učitaj ponovo stranicu</button>
        <Link to='/' onClick={resetErrorBoundary} className={classes.errorButton} >Nazad na početnu stranu</Link>
      </div>
    </div>
  );
}

export default Error;
