import UserType from "../../../lib/UserType";

export type CreateReportDTO = {
    prijavljeni: string;
    tipPrijavljenog: UserType;
    razlog: RazlogPrijave,
    opis?: string;
}

export type ReportDto = {
    id: string;
    inicijator: string,
    tipInicijatora: UserType;
    prijavljeni: string;
    tipPrijavljenog: UserType;
    razlog: RazlogPrijave,
    opis?: string;
    datumPrijave: Date;
}

export enum RazlogPrijave {
    NeprihvatljivSadrzaj,
    Spam,
    LazanProfil,
    NarusavanjePrivatnosti,
    Pretnje,
    NezavrseniProjekti,
    Ostalo
}

const razlogPrijaveDisplayName: { [key in RazlogPrijave]: string} = {
    [RazlogPrijave.NeprihvatljivSadrzaj]: "Neprihvatljiv Sadrzaj",
    [RazlogPrijave.Spam]: "Spam",
    [RazlogPrijave.LazanProfil]: "Lažan Profil", // dodao š
    [RazlogPrijave.NarusavanjePrivatnosti]: "Narušavanje Privatnosti", // dodao š
    [RazlogPrijave.Pretnje]: "Pretnje",
    [RazlogPrijave.NezavrseniProjekti]: "Nezavršeni Projekti", // dodao ž
    [RazlogPrijave.Ostalo]: "Ostalo"
};

export function GetRazlogPrijaveDisplaName(razlog: RazlogPrijave): string {
    return razlogPrijaveDisplayName[razlog];
}