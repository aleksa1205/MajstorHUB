import {  createContext, useState } from "react";
import { RefreshToken } from "../api/controllers/useUserController";
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
    userId : string;
    jwtToken : string;
    refreshToken : RefreshToken;
    userType : UserType;
    roles : Array<Number>;
}

// Posto u local storage ne cuvamo dovoljno informacija da bi authentifikovali korisnika moramo to na drugi nacin da resimo
// U bazi mora da postoji tabela koja pamti sesiju korisnika (session id), taj session id mora da stoji u local storage
// kada se aplikacija ponovu ucita context je prazan, procitamo iz local storage session id, posaljemo serveru, server autentifikuje korisnika
// i vrati nazad sve potrebne informacije o autentifikaciji i mi tada updatujemo context

const defaultValues : AuthValues = {
    userId : '',
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

    const localStorageItem = {
        userId: auth.userId,
        email: auth.email,
        userType: auth.userType,
        roles: auth.roles
    };

    localStorage.setItem('_auth', JSON.stringify(localStorageItem));

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;