import classes from './RadioButton.module.css'

type PropsValues = {
    tekst: string;
    children: React.ReactNode;
    htmlFor: string;
}

function RadioButton({children, tekst, htmlFor} : PropsValues) {
    return (
        <label htmlFor={htmlFor} className={classes.container}>
            <p className={classes.opis}>{tekst}</p>
            {children}
            <span className={classes.checkmark}></span>
        </label>
    )
}

export default RadioButton;