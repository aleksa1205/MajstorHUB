import UserType from "../../lib/UserType";

export type GetUserResponse = {
    id: string;
    email: string;
    slika?: string;
    adresa?: string;
    brojTelefona?: string;
    datumKreiranjaNaloga: Date;
    novacNaSajtu: number;
    opis: string;
    oglasi: string[]
    ocena: number;
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
    Nedefinisano,
    Keramika,
    Moleraj,
    Fasada,
    AdapdacijaProstora,
    Bastovan,
    Bojleri,
    BravarskiRadovi,
    Ciscenje,
    Elektroinstalacije,
    Grejanje,
    HemijskoCiscenje,
    Kamenorezac,
    Klimatizacija,
    KomarniciIRoletne,
    KucniAparati,
    KucniMajstor,
    Limar,
    Krov,
    Moler,
    Obucar,
    Odzacar,
    PlinskeInstalacije,
    Podovi,
    PVC,
    Selidbe,
    SigurnosniSistemi,
    Snajder,
    SolarniPaneli,
    Staklorezac,
    Stolar,
    Vodoinstalater,
    Zidar,
    Putevi,
    Betoniranje,
    Asfaltiranje,
    Vutricionista,
    Ograde,
    Rusenje,
    PripremaTerena,
    Stubovi,
    Nivelacija,
}

const strukaDisplayNames: { [key in Struka]: string } = {
    [Struka.Nedefinisano]: "Nedefinisano",
    [Struka.Keramika]: "Keramika",
    [Struka.Moleraj]: "Moleraj",
    [Struka.Fasada]: "Fasada",
    [Struka.AdapdacijaProstora]: "Adapdacija Prostora",
    [Struka.Bastovan]: "Bastovan",
    [Struka.Bojleri]: "Bojleri",
    [Struka.BravarskiRadovi]: "Bravarski Radovi",
    [Struka.Ciscenje]: "Ciscenje",
    [Struka.Elektroinstalacije]: "Elektroinstalacije",
    [Struka.Grejanje]: "Grejanje",
    [Struka.HemijskoCiscenje]: "Hemijsko Ciscenje",
    [Struka.Kamenorezac]: "Kamenorezac",
    [Struka.Klimatizacija]: "Klimatizacija",
    [Struka.KomarniciIRoletne]: "Komarnici i Roletne",
    [Struka.KucniAparati]: "Kucni Aparati",
    [Struka.KucniMajstor]: "Kucni Majstor",
    [Struka.Limar]: "Limar",
    [Struka.Krov]: "Krov",
    [Struka.Moler]: "Moler",
    [Struka.Obucar]: "Obucar",
    [Struka.Odzacar]: "Odzacar",
    [Struka.PlinskeInstalacije]: "Plinske Instalacije",
    [Struka.Podovi]: "Podovi",
    [Struka.PVC]: "PVC",
    [Struka.Selidbe]: "Selidbe",
    [Struka.SigurnosniSistemi]: "Sigurnosni Sistemi",
    [Struka.Snajder]: "Snajder",
    [Struka.SolarniPaneli]: "Solarni Paneli",
    [Struka.Staklorezac]: "Staklorezac",
    [Struka.Stolar]: "Stolar",
    [Struka.Vodoinstalater]: "Vodoinstalater",
    [Struka.Zidar]: "Zidar",
    [Struka.Putevi]: "Putevi",
    [Struka.Betoniranje]: "Betoniranje",
    [Struka.Asfaltiranje]: "Asfaltiranje",
    [Struka.Vutricionista]: "Vutricionista",
    [Struka.Ograde]: "Ograde",
    [Struka.Rusenje]: "Rusenje",
    [Struka.PripremaTerena]: "Priprema Terena",
    [Struka.Stubovi]: "Stubovi",
    [Struka.Nivelacija]: "Nivelacija"
};

export const maxStrukeLength = 15;

// Function to get the display name
export function getStrukaDisplayName(struka: Struka): string {
    return strukaDisplayNames[struka];
}


export enum Iskustvo {
    Nedefinisano,
    Pocetnik,
    Iskusan,
    Profesionalac
}

export type GetMajstorResponse = GetUserResponse & {
    jmbg: string;
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