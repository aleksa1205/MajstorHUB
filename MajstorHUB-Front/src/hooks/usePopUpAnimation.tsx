import { useTransition } from "@react-spring/web";
import { useState } from "react";

function usePopUpAnimation() {
    const [showMessge, setShowMessage] = useState(false);
    const transition = useTransition(showMessge, {
        from: {bottom: '-5%', opacity: 0, transform: 'translate(-50%, -50%) scale(0.9)'},
        enter: {bottom: '0', opacity: 1, transform: 'translate(-50%, -50%) scale(1)'},
        leave: {bottom: '5%', opacity: 0, transform: 'translate(-50%, -50%) scale(0.9)'},
        config: {mass: 3, tension: 350, friction: 35, clamp: true}
        // config: {duration: 400, easing: easings.easeInOutQuart}
    })

    function closeMessage() {
        setShowMessage(false);
    }

    function openMessage() {
        setShowMessage(true);
    }

    function toggleMessage() {
        setShowMessage(!showMessge);
    }

    return {showMessge, transition, openMessage, closeMessage, toggleMessage};
}

export default usePopUpAnimation;