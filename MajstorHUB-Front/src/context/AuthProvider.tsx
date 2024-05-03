import { createContext, useState } from "react";



const AuthContext = createContext({});

type PropsValue = {
    children : React.ReactNode;
}

export const AuthProvider = ({ children } : PropsValue) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;