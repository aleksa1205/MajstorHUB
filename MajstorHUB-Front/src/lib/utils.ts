import { redirect } from "react-router-dom";
import UserType from "./UserType";
import { FirmaDataUpdate, KorisnikDataUpdate, MajstorDataUpdate, userDataUpdateType } from "../api/DTO-s/updateSelfTypes";
import { userDataType } from "../api/DTO-s/responseTypes";

export function isLoggedIn() {
    const data = localStorage.getItem('_auth');
    if(data === null)
        return false;
    else {
        const auth = JSON.parse(data);
        if(auth.userId == '')
            return false;
    }

    return true;
}

export async function requireAuth() {
    if(!isLoggedIn()) 
        throw redirect('/login?message=Morate da budete logovani');

    return null;
}

export function base64ToUrl(data : string) : string {
    const binaryData = atob(data);

    var arrayBuffer = new ArrayBuffer(binaryData.length);
    var uint8Array = new Uint8Array(arrayBuffer);
    for (var i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
    }

    var blob = new Blob([uint8Array], { type: 'image/png' });
    const url = URL.createObjectURL(blob);

    return url;
}

export function getProfileUrl(userType : UserType, id : string) : string {
    let url : string = '';
    if(userType === UserType.Nedefinisano)
        return url;

    switch (userType) {
        case UserType.Korisnik:
            url = '/klijenti'
            break;
        case UserType.Majstor:
            url = '/majstori'
            break;
        case UserType.Firma:
            url = '/firme'
            break;
        default:
            console.error('Pogresan tip prosledjen funkciji getProfileUrl');
            return '/';
    }

    return url + '/' + id;
}

export function getUpdateUserFromUserData(userData : userDataType) : userDataUpdateType {
    switch (userData.userType) {
        case UserType.Korisnik:
            const korisnik : KorisnikDataUpdate = {
                adresa: userData.adresa ?? '',
                brojTelefona: userData.brojTelefona ?? '',
                email: userData.email,
                opis: userData.opis,
                slika: userData.slika ?? '',
                datumRodjenja: userData.datumRodjenja ?? new Date(),
                ime: userData.ime ?? '',
                prezime: userData.prezime ?? '',
                userType: UserType.Korisnik
            };
            return korisnik;
        case UserType.Majstor:
            const majstor : MajstorDataUpdate = {
                adresa: userData.adresa ?? '',
                brojTelefona: userData.brojTelefona ?? '',
                email: userData.email,
                opis: userData.opis,
                slika: userData.slika ?? '',
                cenaPoSatu: userData.cenaPoSatu ?? 0,
                datumRodjenja: userData.datumRodjenja ?? new Date(),
                ime: userData.ime ?? '',
                prezime: userData.prezime ?? '',
                iskustvo: userData.iskustvo,
                struka: userData.struka,
                userType: UserType.Majstor
            }
            return majstor;
        case UserType.Firma:
            const firma: FirmaDataUpdate = {
                adresa: userData.adresa ?? '',
                brojTelefona: userData.brojTelefona ?? '',
                email: userData.email,
                opis: userData.opis,
                slika: userData.slika ?? '',
                cenaPoSatu: userData.cenaPoSatu ?? 0,
                naziv: userData.naziv ?? '',
                iskustvo: userData.iskustvo,
                struke: userData.struke,
                userType: UserType.Firma
            }
            return firma;
    }
}

export function formatDate(date : Date) : string {

// Get day, month, and year
    let day: number = date.getUTCDate();
    let month: number = date.getUTCMonth() + 1; // Months are zero-based, so add 1
    const year: number = date.getUTCFullYear();

    // Add leading zero to day and month if they are less than 10
    const dayString: string = day < 10 ? '0' + day : day.toString();
    const monthString: string = month < 10 ? '0' + month : month.toString();

    // Format the date as dd.mm.yyyy
    const formattedDate: string = `${dayString}.${monthString}.${year}`;

    return formattedDate;
}