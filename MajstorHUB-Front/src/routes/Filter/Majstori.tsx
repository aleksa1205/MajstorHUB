import FilterUsers from "../../components/AuthorizedComponents/FilterUsers/FilterUsers";
import UserType from "../../lib/UserType";

function Majstori() {
    return (
        <FilterUsers type={UserType.Majstor} />
    )
}

export default Majstori;