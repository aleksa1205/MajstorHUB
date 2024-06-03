import UserType from "../lib/UserType";

export function requiresRole(userRole: UserType, requiredRole: UserType) {
    return userRole === requiredRole;
}

export function requiresKorisnik(userRole: UserType) {
    return requiresRole(userRole, UserType.Korisnik);
}

export function requiresMajstor(userRole: UserType) {
    return requiresRole(userRole, UserType.Majstor);
}

export function requiresFirma(userRole: UserType) {
    return requiresRole(userRole, UserType.Firma);
}