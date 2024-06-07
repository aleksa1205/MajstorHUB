import { GiRank1, GiRank2, GiRank3 } from "react-icons/gi";
import { Iskustvo } from "../../../../api/DTO-s/responseTypes";
import UserType from "../../../../lib/UserType";
import classes from './Struke.module.css';

type PropsValues = {
    userType: UserType;
    iskustvo: Iskustvo
}

export default function ShowIskustvo({ iskustvo, userType }: PropsValues) {
    let icon;
    if(userType !== UserType.Korisnik) {
        if(iskustvo === Iskustvo.Nedefinisano)
            icon = <></>;
        else if(iskustvo === Iskustvo.Pocetnik)
            icon = <GiRank1 size='1.5rem' />
        else if(iskustvo === Iskustvo.Iskusan)
            icon = <GiRank2 size='1.5rem' />
        else
            icon = <GiRank3 size='1.5rem' />
    }
    
    return (
        <div className={classes.iskustvo}>
            {icon}
            <p>{Iskustvo[iskustvo]}</p>
        </div>
    )
}