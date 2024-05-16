import UserProfile from "../../components/AuthorizedComponents/UsersProfiles/UserProfile";
import UserType from "../../lib/UserType";

function MajstorProfile() {
    return <UserProfile typeFromUrl={UserType.Majstor} />
}

export default MajstorProfile;