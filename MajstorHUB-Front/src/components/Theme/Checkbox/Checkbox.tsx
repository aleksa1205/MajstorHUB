import classes from './Checkbox.module.css'

type PropsValues = {
    children: React.ReactNode;
    htmlFor: string;
    text: string;
}

function Checkbox({children, htmlFor, text} : PropsValues) {
    return (
        <label htmlFor={htmlFor} className={classes.checkbox}>
        {text}
        {children}
        <span
          className={classes.checkmark}
        ></span>
      </label>
    );
}

export default Checkbox;