import classes from './EditButton.module.css';
import { LuPencil } from "react-icons/lu";

type PropsValues = {
    onClick?: () => void;
}

function EditButton({ onClick } : PropsValues) {
    return (
        <button onClick={onClick} className={classes.btn}><LuPencil size='1rem' /></button>
    )
}

export default EditButton;