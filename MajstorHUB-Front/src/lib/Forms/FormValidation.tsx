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
    value: 50,
    message: "Maksimum 50 karaktera",
  },
  pattern: {
    value: /^[a-zA-Z\s]*$/,
    message: "Naslov mora da zadrzi samo slova",
  },
};

export const OpisOglasaValidation = {
  required: "Ovo je obavezno polje",
  minLength: {
    value: 50,
    message: "Mora barem 50 karaktera",
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

    if (fieldValue < 1000 || fieldValue > 1000000)
      msg = "Iznos mora da bude između 1000 i 1 000 000 dinara";
    else if (Number.isNaN(fieldValue)) msg = "Dozvoljeni su samo brojevi";
    else valid = true;

    return valid || msg;
  },
};
