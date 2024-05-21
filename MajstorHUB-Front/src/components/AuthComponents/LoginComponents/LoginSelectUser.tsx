import UserType, { userToPath } from "../../../lib/UserType";
import InfoBox from "../../Theme/Boxes/InfoBox";
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
            <InfoBox>
                <p>Email koji ste uneli je registrovan na {userTypesFound.length} vrsta naloga</p>
                <p>Molimo vas da izaberete na koji nalog želite da se ulogujete</p>

                {userTypesFound.map(el => {
                    return <button key={el} value={el} onClick={clickHandler} >Kao {userToPath(el)}</button>
                })}
                <br />
                <br />
                <p>Ukoliko ste slučajno napravili pogrešan nalog,<br /> obriši te ga kako vam ovaj prozor ne bi iskakao</p>
            </InfoBox>
        </>
    )
}

export default LoginSelectUser;