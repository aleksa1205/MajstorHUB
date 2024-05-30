import { easings, useTransition } from "@react-spring/web";
import { useState } from "react";

function useNavSidebarAnim() {
    const [showSidebar, setShowSidebar] = useState(false);
    const transition = useTransition(showSidebar, {
        from: {left: '-100%'},
        enter: {left: '0'},
        leave: {left: '-100%'},
        config: {mass: 1, tension: 200, friction: 26, clamp: true}
        // config: {duration: 400, easing: easings.easeInOutQuart}
    })

    function hideSidebar() {
        setShowSidebar(false);
    }

    function openSidebar() {
        setShowSidebar(true);
    }

    function toggleSidebar() {
        setShowSidebar(!showSidebar);
    }

    return {showSidebar, transition, openSidebar, hideSidebar, toggleSidebar};
}

export default useNavSidebarAnim;