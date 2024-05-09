import { createContext, useEffect, useState } from "react";
import {
  LoginResponse,
  RefreshToken,
} from "../api/controllers/useUserController";
import UserType, { pathToUser, userToPath } from "../lib/UserType";
import axios from "../api/axios";
import { useErrorBoundary } from "react-error-boundary";

// Ovi tipovi moraju da se dodaju da se typescirpt ne bi bunio
// I zato sto createContext zahteva default values
// TypeScirpt malo komplikuje ovaj proces
type ContextValues = {
  auth: AuthValues;
  setAuth: React.Dispatch<React.SetStateAction<AuthValues>>;
};

export type AuthValues = {
  email: string;
  userId: string;
  jwtToken: string;
  refreshToken: RefreshToken;
  userType: UserType;
  roles: Array<Number>;
};

// Posto u local storage ne cuvamo dovoljno informacija da bi authentifikovali korisnika moramo to na drugi nacin da resimo
// U bazi mora da postoji tabela koja pamti sesiju korisnika (session id), taj session id mora da stoji u local storage
// kada se aplikacija ponovu ucita context je prazan, procitamo iz local storage session id, posaljemo serveru, server autentifikuje korisnika
// i vrati nazad sve potrebne informacije o autentifikaciji i mi tada updatujemo context

export const emptyAuthValue: AuthValues = {
  userId: "",
  email: "",
  jwtToken: "",
  refreshToken: {
    tokenValue: "",
    expiry: new Date(),
    jwtId: "",
  },
  roles: [],
  userType: UserType.Nedefinisano,
};

// Da se radi sa vanilla js ovde bi se samo prosledio prazan objekat, {}
const AuthContext = createContext<ContextValues>({
  auth: emptyAuthValue,
  setAuth: () => {},
});

type PropsValue = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: PropsValue) => {
  const [auth, setAuth] = useState<AuthValues>(emptyAuthValue);
  const { showBoundary } = useErrorBoundary();

  // Iskomentarisi useEffect, ovde samo logujem nekog test usera pre pokretanja aplikacije
  useEffect(() => {
    getData(setAuth, showBoundary);
  }, []);


  const localStorageItem = {
    userId: auth.userId,
    email: auth.email,
    userType: auth.userType,
    roles: auth.roles,
  };

  localStorage.setItem("_auth", JSON.stringify(localStorageItem));

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

async function getData(setAuth : React.Dispatch<React.SetStateAction<AuthValues>>, showBoundary : (error: any) => void) {
    const email = "milosmilosevic@gmail.com";
    const password = "sifra123";
    const type = UserType.Korisnik;
    const dataToSend = { email, password };

    let response;
    try {
      response = await axios.post(
        `${userToPath(UserType.Korisnik)}/Login`,
        JSON.stringify(dataToSend),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      showBoundary(error);
    }

    const data: LoginResponse = response!.data;
    setAuth({
      email: email,
      jwtToken: data.jwtToken,
      refreshToken: data.refreshToken,
      roles: data.roles.map((el) => pathToUser(el)),
      userId: data.userId,
      userType: type,
    });
  }