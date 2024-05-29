import classes from './RadioCard.module.css'

type PropsValues = {
    naslov: string;
    opis?: string;
    children: React.ReactNode;
}

function RadioCard({naslov, opis, children} : PropsValues) {
    return (
        <label className={classes.option}>
            <h4 className={classes.naslov}>
                {naslov}
            </h4>
            {opis && <p className={classes.opis}>{opis}</p>}
            {children}
            <span className={classes.checkmark}></span>
        </label>
    )
}

export default RadioCard;