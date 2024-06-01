import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import classes from "./DropDown.module.css";
import { useEffect, useRef, useState } from "react";
import { easings, useTransition, animated, useSpring } from "@react-spring/web";

type SliderPropsValue = {
  children: React.ReactNode;
  text: string;
  isValid?: boolean;
};

function DropDown({ children, text, isValid = true }: SliderPropsValue) {
  const [showList, setShowList] = useState(false);

  const animation = {
    from: {
      x: 25,
    },
    reset: true,
    to: {
      x: 0,
    },
    config: { mass: 1, friction: 15, tension: 1500, bounce: 1 },
  };
  const [springs, api] = useSpring(() => animation);

  const transition = useTransition(showList, {
    from: { opacity: 0, top: "60px" },
    enter: { opacity: 1, top: "70px" },
    leave: { opacity: 0, top: "60px" },
    config: { duration: 300, easing: easings.easeInOutQuart },
  });

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) close();
    }

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  function close() {
    if (!isValid) {
      api.start(animation);
      return;
    }
    setShowList(false);
  }

  useEffect(() => {
    if (!isValid) {
      api.start(animation);
    }
  }, [isValid]);

  function toggleHandler() {
    if (!showList) setShowList(true);
    if (!isValid) {
      api.start(animation);
      return;
    }
    setShowList(!showList);
  }

  const style: React.CSSProperties = {
    borderColor: "#f57624",
    backgroundColor: "#faf4f0",
  };

  return (
    <div ref={menuRef} className={classes.main}>
      <div
        style={showList ? style : {}}
        onClick={toggleHandler}
        className={classes.heading}
      >
        <p>{text}</p>
        <MdOutlineKeyboardArrowUp
          size="1.2rem"
          className={`${classes.arrow}  ${showList && classes.arrowDown}`}
        />
      </div>
      {transition((style, showList) => {
        return showList ? (
          <animated.ul
            className={!isValid ? classes.error : ""}
            style={{ ...style, ...springs }}
          >
            {children}
          </animated.ul>
        ) : null;
      })}
    </div>
  );
}

type ItemPropsValue = {
  children: React.ReactNode;
  isValid?: boolean;
};

export function DDItem({ children, isValid = true }: ItemPropsValue) {
  return <li className={!isValid ? `${classes.item} ${classes.radioError}` : classes.item}>{children}</li>;
}

export default DropDown;
