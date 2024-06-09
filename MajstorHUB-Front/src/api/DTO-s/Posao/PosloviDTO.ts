import UserType from "../../../lib/UserType";

export type CreatePosaoDTO = {
    korisnik: string;
    izvodjac: string;
    tipIzvodjaca: UserType;
    oglas: string;
    cena: number;
    opis: string;
    naslov: string;
    zavrsetakRadova: Date;
    prijava: string;
}

export type GetByZapocetiDTO = {
    posaoId: string;
    korisnikNaziv: string;
    korisnik: string;
    izvodjacNaziv: string;
    izvodjac: string;
    tipIzvodjaca: UserType;
    cena: number;
    naslov: string;
    pocetakRadova: Date,
    zavrsetakRadova: Date,
    oglas: string;
    recenzije: Recenzije;
}

export type GetZavrseniPosloviDTO = {
    pocetakRadova: Date;
    zavrsetakRadova: Date;
    recenzije: Recenzije;
    detaljiPosla: DetaljiPosla;
    izvodjac: Izvodjac;
    korisnik: string;
    oglas: string;
}

export type ZavrsiPosaoDTO = {
    posao: string;
    recenzija: Recenzija;
}

export type DetaljiPosla = {
    cena: number;
    naslov: string;
    opis: string;
}

export type Recenzije = {
    recenzijaKorisnika: Recenzija;
    recenzijaIzvodjaca: Recenzija;
}

export type Recenzija = {
    ocena: number;
    opisRecenzije: string;
}

export type Izvodjac = {
    izvodjacId: string;
    tipIzvodjaca: UserType;
}