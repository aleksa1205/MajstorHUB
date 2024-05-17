import UserProfile from "../../components/AuthorizedComponents/UsersProfiles/UserProfile";
import UserType from "../../lib/UserType";

function KlijentProfile() {
    return <UserProfile typeFromUrl={UserType.Korisnik} />
}

export default KlijentProfile;