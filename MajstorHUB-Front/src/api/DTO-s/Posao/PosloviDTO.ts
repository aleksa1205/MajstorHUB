import UserType from "../../../lib/UserType";

export type CreatePosaoDTO = {
    korisnik: string;
    izvodjac: string;
    tipIzvodjaca: UserType;
    oglas: string;
    cena: number;
    opis: string;
    zavrsetakRadova: Date;
    prijava: string;
}