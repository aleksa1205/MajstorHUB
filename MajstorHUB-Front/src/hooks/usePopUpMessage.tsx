import { useEffect, useState } from "react";
import usePopUpAnimation from "./usePopUpAnimation";
import SuccessBoxAnimated from "../components/Theme/Boxes/SuccessBoxAnimated";
import ErrorBoxAnimated from "../components/Theme/Boxes/ErrorBoxAnimated";
import InfoBoxAnimated from "../components/Theme/Boxes/InfoBoxAnimated";
import WarningBoxAnimated from "../components/Theme/Boxes/WarningBoxAnimated";

export type PopUpMessage = {
    type: "success" | "error" | "warning" | "info";
    message: string;
    dontClose?: boolean;
}


export default function usePopUpMessage() {
    const [popUpMessage, setPopUpMessage] = useState<PopUpMessage | null>(null);

    const { closeMessage, openMessage, transition } = usePopUpAnimation();

    useEffect(() => {
        if(popUpMessage)
            openMessage();
    }, [popUpMessage]);

    const PopUpComponent = () => {
        if (!popUpMessage) return null;

        const { message, type, dontClose } = popUpMessage;

        return (
         <>
            {transition((style, show) => {
                return show ? (
                    <>
                        {type === 'success' && (
                            <SuccessBoxAnimated closeMessage={closeMessage} style={style} dontClose={dontClose}>
                                <p>{message}</p>
                            </SuccessBoxAnimated>
                        )}
                        {type === 'info' && (
                            <InfoBoxAnimated closeMessage={closeMessage} style={style} dontClose={dontClose}>
                                <p>{message}</p>
                            </InfoBoxAnimated>
                        )}
                        {type === 'error' && (
                            <ErrorBoxAnimated closeMessage={closeMessage} style={style} dontClose={dontClose}>
                                <p>{message}</p>
                            </ErrorBoxAnimated>
                        )}
                        {type === 'warning' && (
                            <WarningBoxAnimated closeMessage={closeMessage} style={style} dontClose={dontClose}>
                                <p>{message}</p>
                            </WarningBoxAnimated>
                        )}
                    </>
                ) : null
            })}
         </>   
        )
    }

    return { setPopUpMessage, PopUpComponent }
}