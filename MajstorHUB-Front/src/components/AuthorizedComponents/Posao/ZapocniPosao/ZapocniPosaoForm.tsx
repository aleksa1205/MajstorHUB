import { useForm } from "react-hook-form";
import ModalAnimated from "../../../Theme/Modal/ModalAnimated";
import frClasses from '../../../FormStyles/Form.module.css';
import classes from '../../Prijava/PrijaviSe/PrijaviSeForm.module.css';
import { IoClose } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import useCurrUser from "../../../../hooks/useCurrUser";
import { CenaPoslaValidation, DatumPoslaValidation } from "../../../../lib/Forms/FormValidation";
import { formatDate, formatDoubleWithWhite } from "../../../../lib/utils";
import { useErrorBoundary } from "react-error-boundary";
import useLogout from "../../../../hooks/useLogout";
import { SessionEndedError } from "../../../../api/controllers/useUserControllerAuth";
import InfoBox from "../../../Theme/Boxes/InfoBox";
import { IzvodjacOnPrijava } from "../../Prijava/PrijaveNaOglasu/PrijaveWithIzv";
import UserType from "../../../../lib/UserType";
import { useState } from "react";
import Checkbox from "../../../Theme/Checkbox/Checkbox";
import usePosaoController from "../../../../api/controllers/usePosaoController";
import { CreatePosaoDTO } from "../../../../api/DTO-s/Posao/PosloviDTO";
import useAuth from "../../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useIsSmallScreen from "../../../../hooks/useIsSmallScreen";

type PropsValues = {
    style: any;
    close: () => void;
    // setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
    izvodjac: IzvodjacOnPrijava;
    oglasId: string;
    oglasOpis: string;
    cenaOglasa: number;
    setSuccess(message: string): void;
}

type FormValues = {
    cena: number;
    datum: Date;
    allow: boolean
}

export default function ZapocniPosaoForm({ close, style, izvodjac, oglasId, oglasOpis, cenaOglasa }: PropsValues) {
    const { register, handleSubmit, formState, watch, setError, clearErrors } = useForm<FormValues>();
    const { errors, isSubmitting, isValid } = formState;
    const [ allow, setAllow ] = useState<boolean>(false);
    const navigate = useNavigate();

    const { userData, refetchUser } = useCurrUser();
    const { novacNaSajtu } = userData!;

    const { auth } = useAuth();

    const { zapocniPosao } = usePosaoController();
    const { showBoundary } = useErrorBoundary();
    const logoutUser = useLogout();

    const cenaPosla = watch('cena');
    const datumPosla = watch('datum');

    const isSmallScreen = useIsSmallScreen(450);

    async function onSubmit(values: FormValues) {
        const { cena, datum } = values;
        try {
            if (!allow) {
                setError('allow', {
                    type: 'manual',
                    message: 'Morate da se složite da ste kontaktirali izvođača'
                })
                return;
            }

            const dto: CreatePosaoDTO = {
                cena,
                zavrsetakRadova: datum,
                izvodjac: izvodjac.izvodjacId,
                tipIzvodjaca: izvodjac.tipIzvodjaca,
                oglas: oglasId,
                opis: oglasOpis,
                prijava: izvodjac.prijava,
                korisnik: auth.userId
            }

            await zapocniPosao(dto);
            
            // setSuccess("Uspešno ste započeli posao");
            navigate("/success?message=Uspešno ste započeli posao&to=dashboard", { replace: true })

            refetchUser!();
            close();
        } catch (error) {
            if (error instanceof SessionEndedError)
                logoutUser();
            else
                showBoundary(error);
        }
    }

    function allowHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setAllow(e.target.checked);
        if (e.target.checked)
            clearErrors('allow');
    }

    return (
        <ModalAnimated onClose={close} style={style}>
            <form className={`${frClasses.form} ${classes.form}`} noValidate onSubmit={handleSubmit(onSubmit)}>
                <section>
                    <div className={frClasses.header}>
                        <h3>Zaposlite {izvodjac.tipIzvodjaca === UserType.Majstor ? 'majstora' : 'firmu'} {izvodjac.naziv}</h3>
                        <IoClose onClick={close} size='2rem' />
                    </div>
                </section>

                <section style={{overflow: 'scroll', height: window.innerWidth < 1000 ? '60vh' : '600px'}} className={classes.scroll}>
                    <InfoBox>
                        <p>Dogovorite se sa izvođačem pre nego što započnete posao.</p>
                        <p>Na svakoj prijavi stoji email i, eventualno, broj telefona izvođača. Kontaktirajte ga kako biste sklopili dogovor.</p>
                        <p>Ukoliko započnete posao sa izvođačem bez prethodnog kontakta, izvođač će vas verovatno prijaviti.</p>
                    </InfoBox>
                    <Checkbox htmlFor="allow" text="Kontaktirao/la sam izvođača i dogovorili smo se oko cene i datuma">
                        <input id="allow" type="checkbox" onChange={allowHandler} />
                    </Checkbox>
                    <p className={frClasses.pError}>
                        {errors.allow?.message && <MdErrorOutline />}
                        {errors.allow?.message}
                    </p>
                    {allow && (
                        <>
                            <h4>Cena posla</h4>
                            <p>Finalna cena posla. Ova suma će se odmah nakon prijave posla skinuti sa vašeg računa.</p>
                            <p>Suma neće odmah biti uplaćena izvođaču već kada on završi posao.</p>
                            <p style={{fontWeight: 'bold'}}>Cena na oglasu: {formatDoubleWithWhite(cenaOglasa)} RSD</p>
                            <p style={{fontWeight: 'bold'}}>Cena koju izvođač nudi: {formatDoubleWithWhite(izvodjac.ponuda)} RSD</p>
                            <input
                                className={errors.cena ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                                id="cena"
                                placeholder='50000'
                                {...register("cena", CenaPoslaValidation(izvodjac.ponuda, novacNaSajtu))}
                            />
                            <p className={frClasses.pError}>
                                {errors.cena?.message && <MdErrorOutline />}
                                {errors.cena?.message}
                            </p>

                            <h4>Rok za posao</h4>
                            <p>
                                Unesite rok do kada izvođač mora da završi posao, onako kako ste se dogovorili sa njim.
                            </p>
                            <input
                                className={errors.datum ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                                id="datum"
                                type="date"
                                {...register("datum", DatumPoslaValidation)}
                            />
                            <p className={frClasses.pError}>
                                {errors.datum?.message && <MdErrorOutline />}
                                {errors.datum?.message}
                            </p>

                            <div className={classes.review}>
                                <h4>Pregledajte ponovo posao</h4>
                                <p>Ponuda: {!Number.isNaN(cenaPosla) && isValid ? formatDoubleWithWhite(cenaPosla) : '0'} RSD</p>
                                <p>Datum završetka posla: {isValid ? formatDate(new Date(datumPosla)) : formatDate(new Date())} RSD</p>
                                <p>Vaše stanje: {formatDoubleWithWhite(novacNaSajtu)} RSD</p>
                                <p>Stanje nakon plaćanja posla: {!Number.isNaN(cenaPosla) && isValid ? formatDoubleWithWhite(novacNaSajtu - cenaPosla) : formatDoubleWithWhite(novacNaSajtu)} RSD</p>
                            </div>
                        </>
                    )}
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
                            <span className="button__text">{!isSmallScreen ? 'Zaposli izvođača' : 'Zaposli'}</span>
                        </button>
                    </div>
                </section>
            </form>
        </ModalAnimated>
    )
}