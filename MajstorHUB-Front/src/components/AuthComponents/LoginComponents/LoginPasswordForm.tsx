import UserType, { userToPath } from "../../../lib/UserType";

type PropsValues = {
    email: string;
    userType: UserType;
}

function LoginPasswordForm({email, userType} : PropsValues) {
    return (
        <main>
            Email: {email}, UserType: {userToPath(userType)}
        </main>
    )
}

export default LoginPasswordForm;