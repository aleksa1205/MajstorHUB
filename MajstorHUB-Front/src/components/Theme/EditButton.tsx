import classes from './EditButton.module.css';
import { MdOutlineEdit } from "react-icons/md";
import { LuPencil } from "react-icons/lu";

function EditButton() {
    return (
        <button className={classes.btn}><LuPencil size='1rem' /></button>
    )
}

export default EditButton;