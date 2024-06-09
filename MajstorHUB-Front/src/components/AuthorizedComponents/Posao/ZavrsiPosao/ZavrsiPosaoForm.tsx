import { GetByZapocetiDTO, ZavrsiPosaoDTO } from "../../../../api/DTO-s/Posao/PosloviDTO";
import ModalAnimated from "../../../Theme/Modal/ModalAnimated";
import frClasses from "../../../FormStyles/Form.module.css";
import classes from "./ZavrsiPosaoForm.module.css";
import { useForm } from "react-hook-form";
import useIsSmallScreen from "../../../../hooks/useIsSmallScreen";
import { IoClose } from "react-icons/io5";
import {  useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import UserType from "../../../../lib/UserType";
import { Rating } from "@mui/material";
import { MdErrorOutline } from "react-icons/md";
import { OpisRecenyijeValidation } from "../../../../lib/Forms/FormValidation";
import { useErrorBoundary } from "react-error-boundary";
import useLogout from "../../../../hooks/useLogout";
import usePosaoController from "../../../../api/controllers/usePosaoController";
import { SessionEndedError } from "../../../../api/controllers/useUserControllerAuth";
import { PopUpMessage } from "../../../../hooks/usePopUpMessage";
import { formatDoubleWithWhite } from "../../../../lib/utils";

type PropsValues = {
    style: any;
    close: () => void;
    posao: GetByZapocetiDTO;
    setPopUpMessage: React.Dispatch<React.SetStateAction<PopUpMessage | null>>;
    refetchPoslovi(): void;
}

type FormValues = {
    opisRecenzije: string;
}

export default function ZavrsiPosaoForm(props: PropsValues) {
    const { close, posao, style, setPopUpMessage, refetchPoslovi } = props;
    const { izvodjacNaziv, korisnikNaziv } = posao;

    const { auth: { userType } } = useAuth();
    const { register, handleSubmit, formState } = useForm<FormValues>();
    const { errors, isSubmitting } = formState;

    const [ocena, setOcena] = useState<number | null>(4.5);

    const isSmallScreen = useIsSmallScreen(450);

    const { showBoundary } = useErrorBoundary();
    const logoutUser = useLogout();
    const { zavrsiByIzvodjac, zavrsiByKorisnik } = usePosaoController();

    async function onSubmit(values: FormValues) {
        const { opisRecenzije } = values;
        try {
            if (!ocena)
                throw new Error("Ocena iz nekog razloga je null");

            const dto: ZavrsiPosaoDTO = {
                posao: posao.posaoId,
                recenzija: {
                    ocena,
                    opisRecenzije
                }
            }

            if (userType === UserType.Korisnik) {
                await zavrsiByKorisnik(dto);
                const isFinished = posao.recenzije.recenzijaIzvodjaca !== null;
                setPopUpMessage({
                    message: isFinished 
                        ? "Posao je uspešno završen. Izvođač vam je ostavio recenziju, koju možete videti na vašem profilu." 
                        : "Posao je uspešno završen. Izvođač treba da vam ostavi recenziju da bi posao bio potpuno završen.",
                    type: 'success',
                    dontClose: true
                });
            }
            else {
                await zavrsiByIzvodjac(dto);
                const isFinished = posao.recenzije.recenzijaKorisnika !== null;
                setPopUpMessage({
                    message: isFinished 
                        ? `Posao je uspešno završen. Uplaćeno vam je ${formatDoubleWithWhite(posao.cena)} RSD. Klijent vam je ostavio recenziju, koju možete videti na vašem profilu.` 
                        : "Posao je uspešno završen. Klijent treba da vam ostavi recenziju da bi posao bio potpuno završen.",
                    type: 'success',
                    dontClose: true
                });
            }
            
            setTimeout(() => {
                refetchPoslovi()
                close();
            }, 1000);
        } catch (error) {
            if (error instanceof SessionEndedError)
                logoutUser();
            else
                showBoundary(error);
        }
    }

    return (
        <ModalAnimated onClose={close} style={style}>
            <form className={`${frClasses.form} ${classes.form}`} noValidate onSubmit={handleSubmit(onSubmit)}>
                <section>
                    <div className={frClasses.header}>
                        <h3>Završite posao</h3>
                        <IoClose onClick={close} size='2rem' />
                    </div>
                </section>

                <section>
                    <h4>
                        Ocenite {' '}
                        {userType === UserType.Korisnik && `Izvođača ${izvodjacNaziv.split(" ")[0]}`}
                        {userType !== UserType.Korisnik && `Klijenta ${korisnikNaziv.split(" ")[0]}`}
                    </h4>
                    <p>
                        Budite iskreni pri ocenjivanju korisnika, izabarite ocenu od 1 do 5.
                    </p>

                    <Rating
                        name="ocena"
                        size="large"
                        precision={0.5}
                        value={ocena}
                        onChange={(_, newValue) => {
                            setOcena(newValue);
                        }}
                        sx={{ gap: '0' }}
                    />

                    <h4>Unesite opis recenzije</h4>
                    <p>
                        Potrudite se da opis bude iskren i deskriptivan. Ovo polje nije obavezno.
                    </p>
                    <textarea
                        className={errors.opisRecenzije ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                        id="opis"
                        rows={4}
                        placeholder="Rad sa ovim korisnikom je pravo zadovoljstvo. Veoma je komunikativan i iskren, što olakšava saradnju."
                        {...register("opisRecenzije", OpisRecenyijeValidation)}
                    />
                    <p className={frClasses.pError}>
                        {errors.opisRecenzije?.message && <MdErrorOutline />}
                        {errors.opisRecenzije?.message}
                    </p>

                </section>

                <section>
                    <div className={frClasses.btnContainer}>
                        <button className='secondLink' onClick={close} type='button'>Cancel</button>
                        <button
                            disabled={isSubmitting}
                            className={
                            "mainButtonSmall" + " " + `${isSubmitting ? "button--loading" : ""}`
                            }
                            >
                            <span className="button__text">{!isSmallScreen ? 'Sačuvaj' : 'Sačuvaj'}</span>
                        </button>
                    </div>
                </section>

            </form>
        </ModalAnimated>
    )
}