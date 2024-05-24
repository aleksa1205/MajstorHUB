import { IoIosWarning } from 'react-icons/io';
import classes from './Boxes.module.css'

type PropsVales = {
    children : React.ReactNode;
}

function WarningBox({ children } : PropsVales) {
    return (
        <div className={classes.warrningBox}>
            <IoIosWarning size='1.25rem' />
            <div>
                {children}
            </div>
        </div>
    )
}

export default WarningBox;