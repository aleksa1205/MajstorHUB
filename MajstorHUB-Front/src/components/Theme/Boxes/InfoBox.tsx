import { FaCircleInfo } from "react-icons/fa6";
import classes from './Boxes.module.css'

type PropsVales = {
    children : React.ReactNode;
}

function InfoBox({ children } : PropsVales) {
    return (
        <div className={classes.infoBox}>
            <FaCircleInfo size='1.25rem' />
            <div>
                {children}
            </div>
        </div>
    )
}

export default InfoBox;