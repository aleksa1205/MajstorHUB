import { useEffect } from "react";
import classes from "./Modal.module.css";

type PropsValues = {
    children : React.ReactNode;
    onClose: () => void;
}

function Modal({ children, onClose } : PropsValues) {

  useEffect(() => {

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    }
  }, []);

  return (
    <>
      <div onClick={onClose} className={classes.backdrop} />
      <dialog open className={classes.modal}>
        {children}
      </dialog>
    </>
  );
}

export default Modal;
