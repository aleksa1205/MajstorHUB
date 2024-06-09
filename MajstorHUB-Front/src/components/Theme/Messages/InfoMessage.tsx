import { FaCircleInfo } from "react-icons/fa6";
import classes from "./InfoMessage.module.css"

export default function InfoMessage({ text }: { text: string }) {
    return (
        <div className={classes.info}>
            <FaCircleInfo />
            <p>{text}</p>
        </div>
    )
}