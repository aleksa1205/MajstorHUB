import UserType, { userToPath } from "../../lib/UserType";
import { isAxiosError } from "axios";
import axios from "../axios";

export type RefreshToken = {
    tokenValue : string;
    expiry : Date;
    jwtId : string;
}
// Isto kao na backend-u
export type LoginResponse = {
    naziv : string;
    userId : string,
    jwtToken : string;
    refreshToken : RefreshToken;
    expiration : Date;
    role : UserType;
}

type RegiserKorisnikDto = {
    Ime : string,
    Prezime : string,
    JMBG : string,
    Email : string,
    Sifra : string
  }
  
  type RegisterFirmaDto = {
    ImeFirme : string,
    PIB : string,
    Email : string,
    Sifra : string
  }

function useUserController() {
    const UserController = {
        emailExists: async function(type : UserType, email : string) : Promise<boolean> {
            try {
                const response = await axios.get(`${userToPath(type)}/EmailExists/${email}`);
                return response.data;
            } 
            catch (error) {
                if(isAxiosError(error)) {
                    throw Error('Axios Error - ' + error.message);
                }
                else if (error instanceof Error) {
                    throw Error('General Error - ' + error.message);
                }
                else {
                    throw Error('Unexpected Error - ' + error);
                }
            }
        },

        jmbgExists: async function(type : UserType.Korisnik | UserType.Majstor, jmbg : string) : Promise<boolean> {
            try {
                const response = await axios.get(`${userToPath(type)}/JmbgExists/${jmbg}`);
                return response.data;
            } 
            catch (error) {
                if(isAxiosError(error)) {
                    throw Error('Axios Error - ' + error.message);
                }
                else if (error instanceof Error) {
                    throw Error('General Error - ' + error.message);
                }
                else {
                    throw Error('Unexpected Error - ' + error);
                }
            }
        },

        pibExists: async function(type : UserType.Firma, pib : string) : Promise<boolean> {
            try {
                const response = await axios.get(`${userToPath(type)}/PibExists/${pib}`);
                return response.data;
            } 
            catch (error) {
                if(isAxiosError(error)) {
                    throw Error('Axios Error - ' + error.message);
                }
                else if (error instanceof Error) {
                    throw Error('General Error - ' + error.message);
                }
                else {
                    throw Error('Unexpected Error - ' + error);
                }
            }
        },

        login: async function (type : UserType, email : string, password : string) : Promise<LoginResponse | false> {
            const dataToSend = {Email: email, Password: password};
            
            try {
                const response = await axios.post(`${userToPath(type)}/Login`,
                    JSON.stringify(dataToSend),
                    { headers: {'Content-Type': 'application/json'} }
                );
        
                const data : LoginResponse = response.data;
                data.refreshToken.expiry = new Date(data.refreshToken.expiry);
                data.expiration = new Date(data.expiration);
        
                return data;
        
            } catch (error) {
                if(isAxiosError(error) && error.response != null) {
                    console.log(error.response.status);
                    switch(error.response.status) {
                        case 401:
                            return false;
                        default:
                            throw Error('Axios Error - ' + error.message);
                    }
                }
                else if(error instanceof Error) {
                    throw Error('General Error - ' + error.message);
                }
                else {
                    throw Error('Unexpected Error - ' + error);
                }
            }
        },

        register: async function (type : UserType, registerDto : RegiserKorisnikDto | RegisterFirmaDto) : Promise<object> {
            // Proverava da li je tip korisnik ili majstor, sto znaci da registerDto mora da bude RegiserKorisnikDto
            // odnosno ako registerDto zadrzi property 'PIB' moramo da bacimo gresku
            if((type == UserType.Korisnik || type == UserType.Majstor) && 'PIB' in registerDto)
                throw new Error('Greska pri pozivu funkcije register: Tip je korisnik ili majstor a dto je za firmu')
        
            // Sada obrnuto proveravamo
            if((type == UserType.Firma) && 'JMBG' in registerDto)
                throw new Error('Greska pri pozivu funkcije register: Tip je firma a dto je za korisnika ili majstora')
                
        
            try {
                const response = await axios.post(`${userToPath(type)}/Register`, 
                JSON.stringify(registerDto),
                { headers: {'Content-Type': 'application/json'} });
        
                return response.data;
            } 
            catch (error) {
                if(isAxiosError(error)) {
                    throw Error('Axios Error - ' + error.message);
                }
                else if (error instanceof Error) {
                    throw Error('General Error - ' + error.message);
                }
                else {
                    throw Error('Unexpected Error - ' + error);
                }
            }
        },
    }

    return UserController;
}

export default useUserController;