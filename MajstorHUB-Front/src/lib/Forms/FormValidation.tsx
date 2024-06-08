import { minCenaPrijave } from "../../api/controllers/usePrijavaController";

export const DatumRodjenjaValidation = {
  required: 'Ovo polje je obavezno',
  valueAsDate: true,
  validate: (fieldValue: Date) => {
      const date = new Date(fieldValue);
  
      const isValid = date < new Date();
  
      return isValid || 'Izabran datum je veci od današnjeg'
  }
}

export const DatumPoslaValidation = {
  required: 'Ovo polje je obavezno',
  valueAsDate: true,
  validate: (fieldValue: Date) => {
      const date = new Date(fieldValue);
      let isValid: boolean = false;
      let msg: string = '';

      if (date <= new Date()) 
        msg = "Ne smete uneti datum koji je pre današnjeg";
      else isValid = true;
  
      return isValid || msg;
  }
}

export const LokacijaValidation = {
    required: 'Ovo je obavezno polje',
    minLength: {
        value: 2,
        message: "Lokacija mora da ima barem 2 karaktera"
    },
    maxLength: {
        value: 15,
        message: "Lokacija ne moze da bude duza od 15 karaktera"
    },
    pattern: {
        value: /^[a-zA-Z]+$/,
        message: "Lokacija mora da zadrzi samo slova",
    },
}

export const LokacijaValidationWithSpaces = {
  required: 'Ovo je obavezno polje',
  minLength: {
      value: 2,
      message: "Lokacija mora da ima barem 2 karaktera"
  },
  maxLength: {
      value: 15,
      message: "Lokacija ne moze da bude duza od 15 karaktera"
  },
  pattern: {
      value: /^[a-zA-Z\s]*$/,
      message: "Lokacija mora da zadrzi samo slova i razmake",
  },
}

export const NaslovOglasaValidation = {
  required: "Ovo je obavezno polje",
  minLength: {
    value: 3,
    message: "Mora barem 3 karaktera",
  },
  maxLength: {
    value: 70,
    message: "Maksimum 70 karaktera",
  },
  // pattern: {
  //   value: /^[a-zA-Z\s]*$/,
  //   message: "Naslov mora da zadrzi samo slova",
  // },
};

export const OpisOglasaValidation = {
  required: "Ovo je obavezno polje",
  minLength: {
    value: 10,
    message: "Mora barem 10 karaktera",
  },
  maxLength: {
    value: 30000,
    message: "Maksimum 30000 karaktera",
  },
};

export const CenaOglasaValidation = {
  required: "Ovo je obavezno polje",
  valueAsNumber: true,
  validate: (fieldValue: number) => {
    let msg: string = "";
    let valid = false;

    if (fieldValue < 1000 || fieldValue > 100000000)
      msg = "Iznos mora da bude između 1000 i 100 000 000 dinara";
    else if (Number.isNaN(fieldValue)) msg = "Dozvoljeni su samo brojevi";
    else valid = true;

    return valid || msg;
  },
};

export function CenaPoslaValidation(ponuda: number, stanje: number) {
  return {
    required: "Ovo je obavezno polje",
    valueAsNumber: true,
    validate: (fieldValue: number) => {
      let msg: string = "";
      let valid = false;

      const botThreshold = ponuda * 0.7;
      const topThreshold = ponuda * 1.3;
  
      if (fieldValue > stanje) msg = "Nemate dovoljno novca da platite ovaj posao";
      else if (fieldValue < 1000 || fieldValue > 100000000) msg = "Iznos mora da bude između 1000 i 100 000 000 dinara";
      else if (Number.isNaN(fieldValue)) msg = "Dozvoljeni su samo brojevi";
      else if (fieldValue < botThreshold) msg = "Premala cena posla za izvođačevu ponudu"
      else if (fieldValue > topThreshold) msg = "Prevelika cena posla za izvođačevu ponudu"
      else valid = true;
  
      return valid || msg;
    },
  };
};

export function DodatnaCenaPrijavaValidation(trenutnoStanje: number) {
  return {
    valueAsNumber: true,
    validate: (fieldValue: number) => {
  
      let msg: string = "";
      let valid = false;
  
      if (fieldValue < 30 || fieldValue > 500)
        msg = "Dodatna uplata za prijavu mora da bude između 30 i 500 RSD";
      else if((fieldValue + minCenaPrijave) > trenutnoStanje)
        msg = "Nemate dovoljno novca za ovu prijavu";
      // else if (Number.isNaN(fieldValue)) msg = "Dozvoljeni su samo brojevi";
      else valid = true;
  
      return valid || msg;
    },
  };
}

export const ImeUseraValidation = {
  required: "Ime je obavezno polje",
  minLength: {
    value: 3,
    message: 'Mora barem 3 karaktera'
  },
  maxLength: {
    value: 15,
    message: 'Maksimum 15 karaktera'
  },
  pattern: {
    value: /^[a-zA-Z]+$/,
    message: "Ime mora da zadrzi samo slova",
  },
}