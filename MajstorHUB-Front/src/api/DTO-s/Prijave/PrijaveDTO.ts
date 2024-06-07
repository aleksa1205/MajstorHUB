import UserType from "../../../lib/UserType";
import { Iskustvo, Struka } from "../responseTypes";

export type Prijava = {
    id: string;
    oglas: string;
    izvodjac: string;
    tipIzvodjaca: UserType.Majstor | UserType.Firma;
    ponuda: number;
    bit: number;
    opis: string;
    datumKreiranja: Date;
}

export type PrijavaWithIzvodjacDTO = {
    id: string;
    izvodjacId: string;
    ponuda: number;
    opis: string;
    datumKreiranja: Date;
    tipIzvodjaca: UserType;
    bid: number;
    matchingScore: number;
    iskustvo: Iskustvo;
    cenaPoSatu: number;
    zaradjeno: number;
    naziv: string;
    slika: string;
    adresa: string;
    matchingStruke: Struka[];
    email: string;
    brojTelefona?: string;
}

export type CreatePrijavaDTO = {
    oglasId: string;
    ponuda: number;
    opis: string;
    bid: number;
}