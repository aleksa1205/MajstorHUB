import { FaCircleCheck } from "react-icons/fa6";
import classes from './BoxesAnimated.module.css'
import { animated } from "@react-spring/web";

type PropsVales = {
    children : React.ReactNode;
    style: any;
}

function SuccessBoxAnimated({ children, style } : PropsVales) {
    return (
        <animated.div style={style} className={classes.succBox}>
            <FaCircleCheck size='1.25rem' />
            <div>
                {children}
            </div>
        </animated.div>
    )
}

export default SuccessBoxAnimated;