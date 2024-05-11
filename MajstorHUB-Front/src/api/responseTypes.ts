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
    potroseno?: number;
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
    struka?: Struka;
    iskustvo?: Iskustvo;
    cenaPoSatu?: number;
    zaradjeno?: number;
}

export type GetFirmaResponse = GetUserResponse & {
    jmbg: string;
    ime?: string;
    prezime?: string;
    datumRodjenja?: Date;
    struka?: Struka;
    iskustvo?: Iskustvo;
    cenaPoSatu?: number;
    zaradjeno?: number;
}