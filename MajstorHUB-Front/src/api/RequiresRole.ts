import UserType from "../lib/UserType";

export function requiresRole(userRole: UserType, requiredRole: UserType[]) {
    return requiredRole.includes(userRole);
}

export function requiresKorisnik(userRole: UserType) {
    return requiresRole(userRole, [UserType.Korisnik]);
}

export function requiresMajstor(userRole: UserType) {
    return requiresRole(userRole, [UserType.Majstor]);
}

export function requiresFirma(userRole: UserType) {
    return requiresRole(userRole, [UserType.Firma]);
}

export function requiresIzvodjac(userRole: UserType) {
    return requiresRole(userRole, [UserType.Firma, UserType.Majstor]);
}

export function requiresOsoba(userRole: UserType) {
    return requiresRole(userRole, [UserType.Majstor, UserType.Korisnik])
}