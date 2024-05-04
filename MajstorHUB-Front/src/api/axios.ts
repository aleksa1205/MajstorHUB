import axios from "axios";
const BASE_URL = 'https://localhost:7163';

export default axios.create({
    baseURL: BASE_URL
});

// NE KORISTITI OVO NEGO POZOVI HOOK IZ FAJLA hooks/useAxiosPrivate.tsx
export const axiosPrivate =  axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});