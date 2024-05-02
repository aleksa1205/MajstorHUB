import UserType, { pathToUser, userToPath } from "../../../lib/UserType";
import { FaCircleInfo } from "react-icons/fa6";
import classes from './LoginSelectUser.module.css';
type PropsValues = {
    setUserTypesFound : React.Dispatch<React.SetStateAction<UserType[]>>;
    userTypesFound : UserType[];
}

function LoginSelectUser({ setUserTypesFound, userTypesFound } : PropsValues) {

    function clickHandler(event : React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        let typeSelected : UserType[] = [];
        typeSelected.push(parseInt(event.currentTarget.value));

        setUserTypesFound(typeSelected);
    }

    return (
        <>
            <section className='infoBox'>
                <FaCircleInfo size='1.25rem' />
                <div>
                    <p>Email koji ste uneli je registrovan na {userTypesFound.length} vrsta naloga</p>
                    <p>Molimo vas da izaberete na koji nalog želite da se ulogujete</p>

                    {userTypesFound.map(el => {
                        return <button key={el} value={el} onClick={clickHandler} >Kao {userToPath(el)}</button>
                    })}
                    <br />
                    <br />
                    <p>Ukoliko ste slučajno napravili pogrešan nalog,<br /> obriši te ga kako vam ovaj prozor ne bi iskakao</p>
                </div>
            </section>
        </>
    )
}

export default LoginSelectUser;