import { PrijavaZaAdminaDTO } from "../../../api/DTO-s/Admin/AdminDTOs";
import UserType from "../../../lib/UserType";
import classes from './Prijava.module.css';

type PropsValues = {
    user: PrijavaZaAdminaDTO
}

export default function BlokiranCard({ user }: PropsValues) {
    const { naziv, userType } = user;
    
    return (
        <div className={classes.card}>
            <div>
                <h4>{naziv}</h4>
                <p>{UserType[userType]}</p>
            </div>
        </div>
    )
}