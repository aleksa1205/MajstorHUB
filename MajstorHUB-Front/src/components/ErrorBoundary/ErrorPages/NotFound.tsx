import classes from "./Error.module.css";
import image from "../../../../pictures/not-found.png";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className={classes.main}>
      <img src={image} alt="forbiden" />
      <h2>Tražite nešto?</h2>
      <p>
        Nismo pronašli stranicu koju tražite ali možemo da vam{" "}
        <Link className="secondLink" to="/majstori">
          pronađemo izvođače
        </Link>{" "}
        ili da{" "}
        <Link className="secondLink" to="/oglasi">
          vas zaposlimo
        </Link>
      </p>
      <Link to="/" className="mainButtonSmall">
        Nazad na početnu
      </Link>
    </main>
  );
}
