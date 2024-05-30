import UserType from "../../lib/UserType";
import { Iskustvo, Struka } from "./responseTypes";

export type UserDataUpdate = {
    email: string;
    slika: string;
    adresa: string;
    brojTelefona: string;
    opis: string;
}

export type KorisnikDataUpdate = UserDataUpdate & {
    ime: string;
    prezime: string;
    datumRodjenja: Date;
    userType: UserType.Korisnik;
}

export type MajstorDataUpdate = UserDataUpdate & {
    ime: string;
    prezime: string;
    datumRodjenja: Date;
    struka: Struka;
    iskustvo: Iskustvo;
    cenaPoSatu: number;
    userType: UserType.Majstor;
}

export type FirmaDataUpdate = UserDataUpdate & {
    naziv: string;
    struke: Array<Struka>;
    iskustvo: Iskustvo;
    cenaPoSatu: number;
    userType: UserType.Firma;
}

export type userDataUpdateType = KorisnikDataUpdate | MajstorDataUpdate | FirmaDataUpdate;