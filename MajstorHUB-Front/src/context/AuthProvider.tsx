import {  createContext, useState } from "react";
import { RefreshToken } from "../api/serverRequests";
import UserType from "../lib/UserType";

// Ovi tipovi moraju da se dodaju da se typescirpt ne bi bunio
// I zato sto createContext zahteva default values
// TypeScirpt malo komplikuje ovaj proces
type ContextValues = {
    auth : AuthValues,
    setAuth : React.Dispatch<React.SetStateAction<AuthValues>>;
}

export type AuthValues = {
    email : string;
    // userId : string;
    jwtToken : string;
    refreshToken : RefreshToken;
    userType : UserType;
    roles : Array<string>;
}

const defaultValues = {
    email: '',
    jwtToken: '',
    refreshToken: {
        tokenValue: '',
        expiry: new Date(),
        jwtId: ''
    },
    roles : [],
    userType: UserType.Nedefinisano
}

// Da se radi sa vanilla js ovde bi se samo prosledio prazan objekat, {}
const AuthContext = createContext<ContextValues>({
    auth : defaultValues,
    setAuth: () => {}
});

type PropsValue = {
    children : React.ReactNode;
}

export const AuthProvider = ({ children } : PropsValue) => {
    const [auth, setAuth] = useState<AuthValues>(defaultValues);

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;