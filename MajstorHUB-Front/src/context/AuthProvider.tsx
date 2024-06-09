import { createContext, useEffect, useState } from "react";
import {
  LoginResponse,
  RefreshToken,
} from "../api/controllers/useUserController";
import UserType, {  userToPath } from "../lib/UserType";
import axios from "../api/axios";
import { useErrorBoundary } from "react-error-boundary";
import appconfig from "../../appconfig.json";

type ContextValues = {
  auth: AuthValues;
  setAuth: React.Dispatch<React.SetStateAction<AuthValues>>;
};

export enum AdminRoles {
  Nedefinisano = -1,
  Admin,
  SudoAdmin
}

export type AuthValues = {
  naziv: string;
  email: string;
  userId: string;
  jwtToken: string;
  expiration: Date;
  refreshToken: RefreshToken;
  userType: UserType;
  role: UserType;
  admin: AdminRoles
};

export const emptyAuthValue: AuthValues = {
  naziv: "",
  userId: "",
  email: "",
  jwtToken: "",
  expiration: new Date(),
  refreshToken: {
    tokenValue: "",
    expiry: new Date(),
    jwtId: "",
  },
  role: UserType.Nedefinisano,
  userType: UserType.Nedefinisano,
  admin: AdminRoles.Nedefinisano
};

const AuthContext = createContext<ContextValues>({
  auth: emptyAuthValue,
  setAuth: () => {},
});

type PropsValue = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: PropsValue) => {
  const { storeSessionInLocalStorage, logTestUser } = appconfig;


  const localStorageItem = localStorage.getItem('_auth');
  let defaultValues: AuthValues = emptyAuthValue
  if (localStorageItem && storeSessionInLocalStorage) {
    defaultValues = JSON.parse(localStorageItem);
  }
  else
    localStorage.removeItem("_auth");

  const [auth, setAuth] = useState<AuthValues>(defaultValues);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    if(storeSessionInLocalStorage)
      localStorage.setItem('_auth', JSON.stringify(auth));
  }, [auth])


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
    const { testUserLoginInfo: { email, password, type } } = appconfig;    
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
      data.expiration = new Date(data.expiration);
      console.log(data.refreshToken.expiry, data.expiration);
      
      setAuth({
        naziv: data.naziv,
        email: email,
        jwtToken: data.jwtToken,
        expiration: data.expiration,
        refreshToken: data.refreshToken,
        role: data.role,
        userId: data.userId,
        userType: type,
        admin: data.admin
      });

    } catch (error) {
      showBoundary(error);
    }

  }