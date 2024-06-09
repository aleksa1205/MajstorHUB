import { Struka, getStrukaDisplayName } from '../../../../api/DTO-s/responseTypes';
import classes from './Struke.module.css';

type PropsValues = {
    struke: Struka[];
}

export default function Vestine({ struke }: PropsValues) {
    return (
        <div className={classes.vestine}>
            {struke.map(el => {
                return (
                    <Vestina key={el} struka={el} />
                )
            })}
        </div>
    )
}

type StrukaProps = {
    struka: Struka;
}
export function Vestina({ struka }: StrukaProps) {
    return (
        <div className={classes.vestina}>
            {getStrukaDisplayName(struka)}
        </div>
    )
}