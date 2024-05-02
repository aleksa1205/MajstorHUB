import classes from '../components/AuthComponents/LoginComponents/Login.module.css'
import { useState } from "react";
import LoginEmailForm from "../components/AuthComponents/LoginComponents/LoginEmailForm";
import UserType from "../lib/UserType";
import { useNavigate } from "react-router-dom";
import LoginSelectUser from "../components/AuthComponents/LoginComponents/LoginSelectUser";
import LoginPasswordForm from "../components/AuthComponents/LoginComponents/LoginPasswordForm";

function Login() {
    const [userTypesFound, setUserTypesFound] = useState<UserType[]>([]);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    return (
        <main className={`container ${classes.main}`}>
            {userTypesFound.length == 0 && <LoginEmailForm setUserTypesFound={setUserTypesFound} setEmail={setEmail} />}
            {userTypesFound.length > 1 && <LoginSelectUser setUserTypesFound={setUserTypesFound} userTypesFound={userTypesFound} />}
            {userTypesFound.length === 1 && <LoginPasswordForm email={email} userType={userTypesFound[0]} />}

            {/* {(loginStep == LoginSteps.EnterPassword && selectedTypePath === '') && navigate('/error')} */}
        </main>
    )
}

export default Login;