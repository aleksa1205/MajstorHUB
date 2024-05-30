import { useEffect, useState } from "react";
import classes from "./ModalAnimated.module.css";
import { animated } from "@react-spring/web";

type PropsValues = {
  children: React.ReactNode;
  onClose: () => void;
  style: any;
};

function ModalAnimated({ children, onClose, style }: PropsValues) {

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 700);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 700);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <animated.div
        style={{ opacity: style.t.to((value: number) => value)}}
        onClick={onClose}
        className={classes.backdrop}
      />

      <animated.dialog
        style={{
          opacity: style.t.to((value: string) => value),
          top: isSmallScreen
               ? ''
               : style.bot.to((value: string) => value),
          bottom: isSmallScreen
                  ? style.botSmall.to((value: string) => value)
                  : '',
          transform: isSmallScreen 
                     ? 'translate(-50%, 0)'
                     : style.scale.to((value: number) => `translate(-50%, -50%) scale(${value})`),
        }}
        open
        className={classes.modal}
      >
        {children}
      </animated.dialog>
    </>
  );
}

export default ModalAnimated;
