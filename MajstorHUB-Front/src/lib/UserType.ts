// OPREZ
// NE MENJATI KORISNIKA MAJSTORA I FRIMU, ONI MORAJU DA IMAJU TU VREDNOST KOJA PISE
// korisnik = 0, majstor = 1, firma = 2, admin = 3

enum UserType {
    Nedefinisano = -1,
    Korisnik = 0,
    Majstor = 1,
    Firma = 2,
    Admin = 3,
    Izvodjac = 4,
    Uspesno = 5,
    Neuspesno = 6
}

export default UserType;

export function userToPath(userType : UserType) : string {
    switch (userType) {
        case UserType.Korisnik:
            return 'Korisnik';            
        case UserType.Majstor:
            return 'Majstor';
        case UserType.Firma:
            return 'Firma';
        default:
            console.error("Ovaj tip usera nije podrzan od strane userToPah funkcije");
            return 'Nedefinisano';
    }
}

export function pathToUser(path : string) : UserType {
    switch (path) {
        case 'Korisnik':
            return UserType.Korisnik;
        case 'Majstor':
            return UserType.Majstor;
        case 'Firma':
            return UserType.Firma;
        default:
            console.error("Ovaj tip usera nije podrzan od strane pathToUser funkcije");
            return UserType.Nedefinisano;
    }
}