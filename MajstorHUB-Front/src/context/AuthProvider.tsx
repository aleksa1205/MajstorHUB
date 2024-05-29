import { createContext, useEffect, useState } from "react";
import {
  LoginResponse,
  RefreshToken,
} from "../api/controllers/useUserController";
import UserType, { pathToUser, userToPath } from "../lib/UserType";
import axios from "../api/axios";
import { useErrorBoundary } from "react-error-boundary";

type ContextValues = {
  auth: AuthValues;
  setAuth: React.Dispatch<React.SetStateAction<AuthValues>>;
};

export type AuthValues = {
  naziv: string;
  email: string;
  userId: string;
  jwtToken: string;
  refreshToken: RefreshToken;
  userType: UserType;
  roles: Array<Number>;
};

export const emptyAuthValue: AuthValues = {
  naziv: "",
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

  const logTestUser : boolean = true;

  useEffect(() => {
    if(logTestUser)
      getData(setAuth, showBoundary);
  }, []);

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

      const data: LoginResponse = response!.data;
      data.refreshToken.expiry = new Date(data.refreshToken.expiry);
      console.log(data.refreshToken.expiry);
      
      setAuth({
        naziv: data.naziv,
        email: email,
        jwtToken: data.jwtToken,
        refreshToken: data.refreshToken,
        roles: data.roles.map((el) => pathToUser(el)),
        userId: data.userId,
        userType: type,
      });
    } catch (error) {
      showBoundary(error);
    }

  }