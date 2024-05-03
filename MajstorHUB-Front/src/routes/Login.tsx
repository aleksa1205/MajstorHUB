import classes from '../components/AuthComponents/LoginComponents/Login.module.css'
import { useState } from "react";
import LoginEmailForm from "../components/AuthComponents/LoginComponents/LoginEmailForm";
import UserType from "../lib/UserType";
import LoginSelectUser from "../components/AuthComponents/LoginComponents/LoginSelectUser";
import LoginPasswordForm from "../components/AuthComponents/LoginComponents/LoginPasswordForm";
import { useLoaderData } from 'react-router-dom';
import { FaCircleInfo } from 'react-icons/fa6';

export function loader({ request } : any) {
    // Proveriti da li je korisnik logovan, ako jeste ne rendereuj ovu komponentu

    const url = new URL(request.url);
    return url.searchParams.get("message");
}

function Login() {
    const message = useLoaderData();

    const [userTypesFound, setUserTypesFound] = useState<UserType[]>([]);
    const [email, setEmail] = useState('');
    // const navigate = useNavigate();

    return (
        <main className={`container ${classes.main}`}>

            {message !== null && (
                <div className='infoBox'>
                    <FaCircleInfo size='1.25rem' />
                    <div>
                        <p>Morate da budete ulogovani</p>
                    </div>
                </div>
            )}

            {userTypesFound.length == 0 && <LoginEmailForm setUserTypesFound={setUserTypesFound} setEmail={setEmail} />}
            {userTypesFound.length > 1 && <LoginSelectUser setUserTypesFound={setUserTypesFound} userTypesFound={userTypesFound} />}
            {userTypesFound.length === 1 && <LoginPasswordForm email={email} userType={userTypesFound[0]} reset={setUserTypesFound} />}

            {/* {(loginStep == LoginSteps.EnterPassword && selectedTypePath === '') && navigate('/error')} */}
        </main>
    )
}

export default Login;