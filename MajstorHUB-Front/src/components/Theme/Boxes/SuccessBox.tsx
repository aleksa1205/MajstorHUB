import { FaCircleCheck } from "react-icons/fa6";
import classes from './Boxes.module.css'

type PropsVales = {
    children : React.ReactNode;
}

function SuccessBox({ children } : PropsVales) {
    return (
        <div className={classes.succBox}>
            <FaCircleCheck size='1.25rem' />
            <div>
                {children}
            </div>
        </div>
    )
}

export default SuccessBox;