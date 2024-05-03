import UserType, { userToPath } from "../lib/UserType.ts";
import { isAxiosError } from "axios";
import axios from "./axios.ts";

// fajl sa funkcijama za slanje zahteva serveru, error-i se handluju ovde i posto koristim axios
// to znaci da svaki status kod koji nije 200 ide direktno u catch block, ako bi koristili fetch,
// status kodovi se ne proveravaju u catch bloku nego u try bloku, i ako nesto ne valja logiku za 
// redirektovanje usera se ne stavlja ovde nego u komponentama
// takodje axios reponse vraca u json formatu, znaci ne mora kao kod fetch-a da se zove await response.json()

// odlucio sam da funkcije zovem get/post/put pa onda ime endpointa (bez majstor, korisnik i firma)
// ako imas bolju ideju, pucaj



// Mora da vrati null da bi mi proverili posle kada koristimo ovu funkciju, jer ako je rezultat null,
// to znaci da je vrv neka greska sa serverom i moramo usera da redirectujemo na error page
export async function getEmailExists(userType : UserType, email : string) : Promise<boolean | null> {
    try {
        const response = await axios.get(`${userToPath(userType)}/EmailExists/${email}`);
        return response.data;
    } 
    catch (error) {
        if(isAxiosError(error)) {
            console.error(error.message);
        }
        else if (error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error(error);
        }
        return null;
    }
}


export async function getJmbgExists(type : UserType.Korisnik | UserType.Majstor, jmbg : string) : Promise<boolean | null> {
    try {
        const response = await axios.get(`${userToPath(type)}/JmbgExists/${jmbg}`);
        return response.data;
    } 
    catch (error) {
        if(isAxiosError(error)) {
            console.error(error.message);
        }
        else if (error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error(error);
        }
        return null;
    }
}


export async function getPibExists(type : UserType.Firma, pib : string) : Promise<boolean | null> {
    try {
        const response = await axios.get(`${userToPath(type)}/PibExists/${pib}`);
        return response.data;
    } 
    catch (error) {
        if(isAxiosError(error)) {
            console.error(error.message);
        }
        else if (error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error(error);
        }
        return null;
    }
}

export type RefreshToken = {
    TokenValue : string;
    Expiry : Date;
    JwtId : string;
}
// Isto kao na backend-u
export type LoginResponse = {
    JwtToken : string;
    RefreshToken : RefreshToken;
    Expiration : Date;
}
// funkcije vraca object ako je uspeo login, false ako je greska sa sifrom ili emailom ili null ako je server riknuo
export async function postLogin(type : UserType, email : string, password : string) : Promise<LoginResponse | false | null> {
    const dataToSend = {Email: email, Password: password};
    
    try {
        const response = await axios.post(`${userToPath(type)}/Login`,
            JSON.stringify(dataToSend),
            { headers: {'Content-Type': 'application/json'} }
        );

        const data : LoginResponse = response.data;

        return data;

    } catch (error) {
        if(isAxiosError(error) && error.response != null) {
            console.log(error.response.status);
            switch(error.response.status) {
                case 401:
                    return false;
                default:
                    console.error('Unexpected error ' + error.message);
                    return null;
            }
        }
        else if(error instanceof Error) {
            return null;
        }
        else {
            console.error(error);
            return null;
        }
    }
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


export async function postRegister(type : UserType, registerDto : RegiserKorisnikDto | RegisterFirmaDto) : Promise<null | object> {
    // Proverava da li je tip korisnik ili majstor, sto znaci da registerDto mora da bude RegiserKorisnikDto
    // odnosno ako registerDto zadrzi property 'PIB' moramo da bacimo gresku
    if((type == UserType.Korisnik || type == UserType.Majstor) && 'PIB' in registerDto)
        throw new Error('Greska pri pozivu funkcije: Tip je korisnik ili majstor a dto je za firmu')

    // Sada obrnuto proveravamo
    if((type == UserType.Firma) && 'JMBG' in registerDto)
        throw new Error('Greska pri pozivu funkcije: Tip je firma a dto je za korisnika ili majstora')
        

    try {
        const response = await axios.post(`${userToPath(type)}/Register`, 
        JSON.stringify(registerDto),
        { headers: {'Content-Type': 'application/json'} });

        return response.data;
    } 
    catch (error) {
        if(isAxiosError(error) && error.response != null) {
            console.error(error.response);
        }
        else if(error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error(error);
        }

        return null;
    }
}