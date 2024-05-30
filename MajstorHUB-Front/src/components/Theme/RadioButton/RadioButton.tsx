import classes from './RadioButton.module.css'

type PropsValues = {
    tekst: string;
    children: React.ReactNode;
    htmlFor: string;
    opis?: string;
}

function RadioButton({children, tekst, opis, htmlFor} : PropsValues) {
    return (
        <label style={{height: `${opis ? 'fit-content' : '25px'}`}} htmlFor={htmlFor} className={classes.container}>
            <div>
                <p className={classes.tekst}>{tekst}</p>
                {opis && (
                    <p className={classes.opis}>{opis}</p>
                )}
            </div>
            {children}
            <span className={classes.checkmark}></span>
        </label>
    )
}

export default RadioButton;