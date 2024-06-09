import { useEffect, useState } from "react";

export default function useIsSmallScreen(width: number) {
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth <= width);

    useEffect(() => {
        function handler() {
            setIsSmallScreen(window.innerWidth <= width);
        }

        window.addEventListener('resize', handler);

        return () => window.removeEventListener('resize', handler);
    }, []);

    return isSmallScreen;
}