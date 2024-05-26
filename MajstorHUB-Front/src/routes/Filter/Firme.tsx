import FilterUsers from "../../components/AuthorizedComponents/FilterUsers/FilterUsers";
import UserType from "../../lib/UserType";

function Firme() {
    return (
        <FilterUsers type={UserType.Firma} />
    )
}

export default Firme;