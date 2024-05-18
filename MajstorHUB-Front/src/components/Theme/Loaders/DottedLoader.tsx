import classes from './DottedLoader.module.css'

type PropsValue = {
    size : string;
}

function DottedLoader({ size } : PropsValue) {
    return (
        <div className={classes.dotSpinner} style={{height: size, width: size}}>
            <div className={classes.dotSpinnerDot}></div>
            <div className={classes.dotSpinnerDot}></div>
            <div className={classes.dotSpinnerDot}></div>
            <div className={classes.dotSpinnerDot}></div>
            <div className={classes.dotSpinnerDot}></div>
            <div className={classes.dotSpinnerDot}></div>
            <div className={classes.dotSpinnerDot}></div>
            <div className={classes.dotSpinnerDot}></div>
        </div>
    )
}

export default DottedLoader;