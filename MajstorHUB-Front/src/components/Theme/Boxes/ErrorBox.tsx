import classes from './Boxes.module.css'
import { MdErrorOutline } from "react-icons/md";

type PropsVales = {
    children : React.ReactNode;
}

function ErrorBox({ children } : PropsVales) {
    return (
        <div className={classes.errorBox}>
            <MdErrorOutline size='1.25rem' />
            <div>
                {children}
            </div>
        </div>
    )
}

export default ErrorBox;