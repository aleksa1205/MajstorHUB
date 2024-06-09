import classes from './EditUserForm.module.css'
import { IoClose } from "react-icons/io5";
import ModalAnimated from '../../../Theme/Modal/ModalAnimated';

type PropsValues = {
    close: () => void,
    callback: () => void;
    style: any;
}

function ConfirmBan({ close, callback, style }: PropsValues) {



    return (
        <ModalAnimated onClose={close} style={style}>
            <div className={classes.form} >
                <div className={classes.header}>
                    <h3>Da li ste sigurni da zelite ovo da blokirate ovog korisnika</h3>
                    <IoClose onClick={close} size='2rem' />
                </div>

                <div className={classes.btnContainer}>
                    <button className='secondLink' onClick={close} type='button'>Ne</button>

                    <button
                        className={
                        "mainButtonSmall"
                        }
                        onClick={() => {
                            callback();
                            close();
                        }}
                        >
                        Da
                    </button>
                </div>
            </div>
        </ModalAnimated>
    )
}

export default ConfirmBan;