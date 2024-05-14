import { useContext } from "react";
import CurrUserContext from "../context/CurrUserProvider";

function useCurrUser() {
    return useContext(CurrUserContext);
}

export default useCurrUser;