// OPREZ
// NE MENJATI KORISNIKA MAJSTORA I FRIMU, ONI MORAJU DA IMAJU TU VREDNOST KOJA PISE
// korisnik = 0, majstor = 1, firma = 2

enum UserType {
    Nedefinisano = -1,
    Korisnik = 0,
    Majstor = 1,
    Firma = 2,
    Izvodjac = 3,
    Uspesno = 4,
    Neuspesno = 5
}

export default UserType;