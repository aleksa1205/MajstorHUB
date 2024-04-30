import { useState } from "react";
import LoginEmailForm from "../components/AuthComponents/LoginComponents/LoginEmailForm";
import UserType from "../lib/UserType";
import { useNavigate } from "react-router-dom";
import LoginSelectUser from "../components/AuthComponents/LoginComponents/LoginSelectUser";
import LoginPasswordForm from "../components/AuthComponents/LoginComponents/LoginPasswordForm";

export enum LoginSteps {
    EnterEmail = 0,
    EnterUserType = 1,
    EnterPassword = 2
}

function Login() {
    const [loginStep, setLoginStep] = useState<LoginSteps>(LoginSteps.EnterEmail);
    const navigate = useNavigate();
    let selectedTypePath : string = '';

    return (
        <>
            {loginStep == LoginSteps.EnterEmail && <LoginEmailForm setLoginStep={setLoginStep} selectedTypePath={selectedTypePath} />}
            {loginStep == LoginSteps.EnterUserType && <LoginSelectUser />}
            {loginStep == LoginSteps.EnterPassword &&       console.log("u login " + selectedTypePath)}

            {(loginStep == LoginSteps.EnterPassword && selectedTypePath === '') && navigate('/error')}
        </>
    )
}

export default Login;