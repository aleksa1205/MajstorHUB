import classes from './BoxesAnimated.module.css'
import { animated } from "@react-spring/web";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";

type PropsVales = {
    children : React.ReactNode;
    style: any;
    closeMessage: () => void
}

function ErrorBoxAnimated({ children, style, closeMessage } : PropsVales) {
    
    useEffect(() => {
        const id = setTimeout(closeMessage, 5000);

        return () => clearTimeout(id);
    }, [])

    return (
        <animated.div style={style} className={classes.errorBox}>
            <MdErrorOutline size='1.25rem' />
            <div>
                {children}
            </div>
            <IoClose onClick={closeMessage} className={classes.close} size='1.75rem' />
        </animated.div>
    )
}

export default ErrorBoxAnimated;