import { useEffect } from "react";
import classes from "./Modal.module.css";
import { animated } from "@react-spring/web";

type PropsValues = {
  children: React.ReactNode;
  onClose: () => void;
  style: any;
};

function ModalAnimated({ children, onClose, style }: PropsValues) {
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
          top: style.bot.to((value: string) => value),
          transform: style.scale.to((value: number) => `translate(-50%, -50%) scale(${value})`),
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
