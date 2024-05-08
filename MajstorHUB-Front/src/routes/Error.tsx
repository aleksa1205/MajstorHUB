import { useLoaderData } from "react-router-dom";
import classes from "../components/SuccErr.module.css";
import { MdError } from "react-icons/md";

export function loader({ request }: any) {
  const url = new URL(request.url);
  return url.searchParams.get("message");
}

function Error() {
  const message = useLoaderData();

  return (
    <div className={`container ${classes.main}`}>
      <div className={classes.error}>
        <MdError size="2.5rem" className={classes.icons} />
        {message !== null && typeof message === "string" ? (
          <h3>{message}</h3>
        ) : (
          <h3>
            {" "}
            Došlo je do greške pri komunikaciji sa serverom, pokušajte kasnije
            ili se obratite korisničkom servisu
          </h3>
        )}
      </div>
    </div>
  );
}

export default Error;
