import classes from "./SuccErr.module.css"
import { MdError } from "react-icons/md";
import { FallbackProps } from "react-error-boundary";

function Error({ error, resetErrorBoundary} : FallbackProps) {
  return (
    <div className={`container ${classes.main}`}>
      <div className={classes.error}>
        <MdError size="2.5rem" className={classes.icons} />
        <h3>Doslo je do greške pri komunikaciji sa serverom</h3>
        <p>{error.message}</p>
        <button className={classes.errorButton} onClick={resetErrorBoundary}>Učitaj ponovo stranicu</button>
      </div>
    </div>
  );
}

export default Error;
