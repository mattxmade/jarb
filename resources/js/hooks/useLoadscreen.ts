import { useEffect } from "react";

const useLoadscreen = () => {
    const loadScreen = document.querySelector(".loading-screen");

    const removeLoadscreen = () => {
        const delay = setTimeout(() => {
            clearTimeout(delay);
            loadScreen && loadScreen.remove();
        }, 500);
    };

    useEffect(removeLoadscreen, []);
};

export default useLoadscreen;
