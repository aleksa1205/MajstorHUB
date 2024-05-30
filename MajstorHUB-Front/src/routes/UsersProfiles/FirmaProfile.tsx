import UserProfile from "../../components/AuthorizedComponents/UsersProfiles/UserProfile";
import UserType from "../../lib/UserType";

function FirmaProfile() {
    return <UserProfile typeFromUrl={UserType.Firma} />
}

export default FirmaProfile;