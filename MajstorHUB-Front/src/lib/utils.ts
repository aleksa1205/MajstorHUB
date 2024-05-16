import { redirect } from "react-router-dom";
import UserType from "./UserType";

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