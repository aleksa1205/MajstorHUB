import classes from './EditButton.module.css';
import { MdAdd } from "react-icons/md";

type PropsValues = {
    onClick?: () => void;
}

function AddButton({ onClick } : PropsValues) {
    return (
        <button onClick={onClick} className={classes.btn}><MdAdd size='1.35rem' /></button>
    )
}

export default AddButton;