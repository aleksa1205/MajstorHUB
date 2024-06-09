import { Iskustvo, Struka } from "../responseTypes";

export enum DuzinaPosla {
  Nedefinisano,
  ManjeOdMesec,
  JedanDoTriMeseca,
  TriDoSestMeseci,
  ViseOdSestMeseci,
}

const DuzinaPoslaDisplayName: { [key in DuzinaPosla]: string } = {
  [DuzinaPosla.Nedefinisano]: "Nedefinisano",
  [DuzinaPosla.ManjeOdMesec]: "Manje od mesec dana",
  [DuzinaPosla.JedanDoTriMeseca]: "1 do 3 meseca",
  [DuzinaPosla.TriDoSestMeseci]: "3 do 6 meseci",
  [DuzinaPosla.ViseOdSestMeseci]: "Više od 6 meseci",
};

export function getDuzinaPoslaDisplayName(duzinaPosla: DuzinaPosla): string {
  return DuzinaPoslaDisplayName[duzinaPosla];
}

export type CreateOglasDTO = {
  naslov: string;
  iskustvo: Iskustvo;
  struke: Struka[];
  opis: string;
  cena: number;
  duzinaPosla: DuzinaPosla;
  lokacija?: string;
};

export type FilterOglasDTO = {
  query?: string;
  opis?: string;
  iskustva?: Iskustvo[];
  duzinePosla?: DuzinaPosla[];
  cena?: {
    od: number;
    do: number;
  };
  potroseno?: number;
};

export type GetOglasDTO = {
  id: string;
  korisnikId: string;
  ime: string;
  prezime: string;
  potroseno: number;
  naslov: string;
  iskustvo: Iskustvo;
  struke: Struka[];
  opis: string;
  cena: number;
  duzinaPosla: DuzinaPosla;
  lokacija?: string;
  datumKreiranja: Date;
  brojPrijava: number;
};

export type OglasUpdateSelfDTO = CreateOglasDTO & {
  id: string;
}