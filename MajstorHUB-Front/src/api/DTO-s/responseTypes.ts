import UserType from "../../lib/UserType";

type GetUserResponse = {
    id: string;
    email: string;
    slika?: string;
    adresa?: string;
    brojTelefona?: string;
    datumKreiranjaNaloga: Date;
    novacNaSajtu : number;
    opis : string;
}

export type GetKorisnikResponse  = GetUserResponse & {
    jmbg: string;
    ime?: string;
    prezime?: string;
    datumRodjenja?: Date;
    potroseno: number;
    userType: UserType.Korisnik;
}

export enum Struka {
    Nedefinisano = 0,
    Keramika = 1,
    Moleraj = 2,
    Fasada = 3
}

export enum Iskustvo {
    Nedefinisano,
    Pocetnik,
    Iskusan,
    Profesionalac
}

export type GetMajstorResponse = GetUserResponse & {
    jmbg?: string;
    ime?: string;
    prezime?: string;
    datumRodjenja?: Date;
    struka: Struka;
    iskustvo: Iskustvo;
    cenaPoSatu?: number;
    zaradjeno: number;
    userType: UserType.Majstor;
}

export type GetFirmaResponse = GetUserResponse & {
    pib: string;
    naziv?: string;
    struke: Array<Struka>;
    iskustvo: Iskustvo;
    cenaPoSatu?: number;
    zaradjeno: number;
    userType: UserType.Firma;
}

export type userDataType = GetKorisnikResponse | GetFirmaResponse | GetMajstorResponse;