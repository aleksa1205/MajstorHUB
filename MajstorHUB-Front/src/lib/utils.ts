import { redirect } from "react-router-dom";
import UserType from "./UserType";
import { FirmaDataUpdate, KorisnikDataUpdate, MajstorDataUpdate, userDataUpdateType } from "../api/DTO-s/updateSelfTypes";
import { userDataType } from "../api/DTO-s/responseTypes";
import { number } from "prop-types";

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

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                const base64String = reader.result.split(',')[1]; // Remove the data URL prefix
                const sanitizedBase64String = base64String.replace(/\s/g, ''); // Remove whitespace characters
                resolve(sanitizedBase64String);
            } else {
                reject(new Error('Failed to convert file to base64'));
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
};

export function formatBase64(file : string) {
    return file.split(',')[1].replace(/\s/g, '');
}

export function formatDouble(broj : number, append : string) : string {
    let msg = '';
    if(broj === 0)
        msg = '0 RSD';
    else if(broj > 1000)
        msg = `${Math.floor(broj / 1000)}K+ RSD`;
    else
        msg = `${Math.floor((broj / 100)) * 100}+ RSD`
    
    return msg + ' ' + append;
}

export function formatDoubleWithWhite(broj: number): string {
    let numberStr = Math.round(broj).toString();
    let result: string[] = [];

    let count = 1;
    for(let i = numberStr.length - 1; i >= 0; i--) {
        result.unshift(numberStr[i]);
        if(count === 3 && i !== 0) {
            result.unshift(' ');
            count = 0;
        }

        count++;
    }

    return result.join('');
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

export function getOglasUrl(id: string): string {
    return '/oglasi/' + id;
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
    const formattedDate: string = `${dayString}.${monthString}.${year}.`;

    return formattedDate;
}

export function formatDateBefore(date: Date): string {
    const now = new Date();
    
    let result: string = '';
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffMonths = Math.floor(diffDays / 30);  // Simplified month calculation


    if (diffMinutes < 60) {
        result = diffMinutes <= 1 ? 'pre 1 minut' : 'pre ' + diffMinutes + ' minuta';
    } else if (diffHours < 24) {
        result = diffHours === 1 ? 'pre sat vremena' : 'pre ' + diffHours + ' sata';
    } else if (diffDays < 31) {
        result = diffDays === 1 ? 'juče' : 'pre ' + diffDays + ' dana';
    } else {
        result = diffMonths === 1 ? 'pre mesec dana' : 'pre ' + diffMonths + ' meseci';
    }

    return result;
}

export function crop(url : string, aspectRatio: number) : Promise<HTMLCanvasElement> {
    // we return a Promise that gets resolved with our canvas element
    return new Promise((resolve) => {
        // this image will hold our source image data
        const inputImage = new Image();

        // we want to wait for our image to load
        inputImage.onload = () => {
            // let's store the width and height of our image
            const inputWidth = inputImage.naturalWidth;
            const inputHeight = inputImage.naturalHeight;

            // get the aspect ratio of the input image
            const inputImageAspectRatio = inputWidth / inputHeight;

            // if it's bigger than our target aspect ratio
            let outputWidth = inputWidth;
            let outputHeight = inputHeight;
            if (inputImageAspectRatio > aspectRatio) {
                outputWidth = inputHeight * aspectRatio;
            } else if (inputImageAspectRatio < aspectRatio) {
                outputHeight = inputWidth / aspectRatio;
            }

            // calculate the position to draw the image at
            const outputX = (outputWidth - inputWidth) * 0.5;
            const outputY = (outputHeight - inputHeight) * 0.5;

            // create a canvas that will present the output image
            const outputImage = document.createElement('canvas');

            // set it to the same size as the image
            outputImage.width = outputWidth;
            outputImage.height = outputHeight;

            // draw our image at position 0, 0 on the canvas
            const ctx = outputImage.getContext('2d');
            if(ctx !== null)
                ctx.drawImage(inputImage, outputX, outputY);
            resolve(outputImage);
        };

        // start loading our image
        inputImage.src = url;
    });
}