import React, { useState } from "react";
import classes from './DropDownSlider.module.css'
import { MdOutlineKeyboardArrowUp } from "react-icons/md";

type SliderPropsValue = {
    children : React.ReactNode;
    text : string;
}

function DropDownSlider({ children, text } : SliderPropsValue) {
    const [showList, setShowList] = useState(false);

    return (
        <div className={classes.main}>
            <div onClick={() => setShowList(!showList)} className={classes.heading}>
                <p>{text}</p>
                <MdOutlineKeyboardArrowUp size='2rem' className={`${classes.arrow}  ${showList && classes.arrowDown}`} />
            </div>
            {showList &&
                <ul>
                    {children}
                </ul>
            }
        </div>
    )
}

type ItemPropsValue = {
    children : React.ReactNode;
}

export function DDSliderItem({ children } : ItemPropsValue) {
    return (
        <li className={classes.item}>{children}</li>
    )
}

export default DropDownSlider;