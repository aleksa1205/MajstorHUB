import { useTransition } from "@react-spring/web";
import { useState } from "react";

function useModalAnimation() {
    const [showModal, setShowModal] = useState(false);
    const transition = useTransition(showModal, {
        from: {t: 0, bot: '60%', scale: 0.9, botSmall: '-35%'},
        enter: {t: 1, bot: '50%', scale: 1, botSmall: '0'},
        leave: {t: 0, bot: '60%', scale: 0.9, botSmall: '-35%'},
        config: {mass: 5, tension: 1000, friction: 80, clamp: true}
        // config: {duration: 400, easing: easings.easeInOutQuart}
    })

    function closeModal() {
        setShowModal(false);
    }

    function openModal() {
        setShowModal(true);
    }

    return {showModal, transition, closeModal, openModal};
}

export default useModalAnimation;