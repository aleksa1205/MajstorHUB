import { FaCircleCheck } from "react-icons/fa6";
import classes from './BoxesAnimated.module.css'
import { animated } from "@react-spring/web";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";

type PropsVales = {
    children : React.ReactNode;
    style: any;
    closeMessage: () => void
}

function SuccessBoxAnimated({ children, style, closeMessage } : PropsVales) {
    
    useEffect(() => {
        const id = setTimeout(closeMessage, 5000);

        return () => clearTimeout(id);
    }, [])

    return (
        <animated.div style={style} className={classes.succBox}>
            <FaCircleCheck size='1.25rem' />
            <div>
                {children}
            </div>
            <IoClose onClick={closeMessage} className={classes.close} size='1.75rem' />
        </animated.div>
    )
}

export default SuccessBoxAnimated;