import React, { useEffect, useState } from "react";
import classes from "./DropDownSlider.module.css";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { useSpring, animated } from "@react-spring/web";

type SliderPropsValue = {
  children: React.ReactNode;
  text: string;
  isOpen?: boolean;
  isValid?: boolean;
};

function DropDownSlider({ children, text, isOpen, isValid = true }: SliderPropsValue) {
  const [showList, setShowList] = useState(isOpen ?? false);
  return (
    <div className={classes.main}>
      <div onClick={() => setShowList(!showList)} className={classes.heading}>
        <p>{text}</p>
        <MdOutlineKeyboardArrowUp
          size="2rem"
          className={`${classes.arrow}  ${showList && classes.arrowDown}`}
        />
      </div>
    {showList && <ul>{children}</ul>}
    </div>
  );
}

type ItemPropsValue = {
  children: React.ReactNode;
  isValid?: boolean;
};

export function DDSliderItem({ children, isValid = true }: ItemPropsValue) {
    const animation = {
      from: {
        x: 25,
      },
      to: {
        x: 0,
      },
      config: { mass: 1, friction: 15, tension: 1500, bounce: 1 },
    };

  const [springs, api] = useSpring(() => {});

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!isValid) api.start(animation);
    }

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  useEffect(() => {
    if(!isValid)
        api.start(animation);
  }, [isValid])

  return (
    <animated.li className={!isValid ? `${classes.item} ${classes.radioError}` : classes.item} style={springs}>
      {children}
    </animated.li>
  );
}

export default DropDownSlider;
