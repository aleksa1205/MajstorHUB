import UserType from "../../lib/UserType";
import { Iskustvo } from "./responseTypes";

export type FilterKorisnikDTO = {
    query: string;
    opis: string;
    potroseno: number;
    type: UserType.Korisnik
}

export type FilterMajstorDTO = {
    query: string;
    opis: string;
    iskustva: Iskustvo[];
    cenaPoSatu: number;
    zaradjeno: number;
    type: UserType.Majstor
}

export type FilterFirmaDTO = {
    query: string;
    opis: string;
    iskustva: Iskustvo[];
    cenaPoSatu: number;
    zaradjeno: number;
    type: UserType.Firma
}

export type FilterDTO = FilterKorisnikDTO | FilterMajstorDTO | FilterFirmaDTO;