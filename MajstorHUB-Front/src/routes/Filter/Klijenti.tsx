import FilterUsers from "../../components/AuthorizedComponents/FilterUsers/FilterUsers";
import UserType from "../../lib/UserType";

function Klijenti() {
    return (
        <FilterUsers type={UserType.Korisnik} />
    )
}

export default Klijenti;