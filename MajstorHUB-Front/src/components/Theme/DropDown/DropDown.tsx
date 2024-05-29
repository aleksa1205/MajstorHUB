import { MdOutlineKeyboardArrowUp } from 'react-icons/md';
import classes from './DropDown.module.css'
import { useEffect, useRef, useState } from 'react';
import { easings, useTransition, animated } from '@react-spring/web';

type SliderPropsValue = {
    children : React.ReactNode;
    text : string;
}

function DropDown({children, text} : SliderPropsValue) {
    const [showList, setShowList] = useState(false);

    const transition = useTransition(showList, {
        from: {opacity: 0, top: '60px'},
        enter: {opacity: 1, top: '70px'},
        leave: {opacity: 0, top: '60px'},
        config: {duration: 300, easing: easings.easeInOutQuart}
    })

    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handler(e : MouseEvent) {
            if(!menuRef.current?.contains(e.target as Node))
                setShowList(false);
        }

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        }
    });

    const style: React.CSSProperties = {
        borderColor: '#f57624',
        backgroundColor: '#faf4f0',
    }

    return (
        <div ref={menuRef} className={classes.main}>
            <div style={showList ? style : {}} onClick={() => setShowList(!showList)} className={classes.heading}>
                <p>{text}</p>
                <MdOutlineKeyboardArrowUp size='1.2rem' className={`${classes.arrow}  ${showList && classes.arrowDown}`} />
            </div>
            {transition((style, showList) => {
                return showList ? (
                    <animated.ul style={style}>
                        {children}
                    </animated.ul>
                ) : null
            })}
        </div>
    )
}

type ItemPropsValue = {
    children : React.ReactNode;
}

export function DDItem({ children } : ItemPropsValue) {
    return (
        <li className={classes.item}>{children}</li>
    )
}


export default DropDown;