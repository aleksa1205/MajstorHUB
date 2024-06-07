import { useForm } from "react-hook-form";
import ModalAnimated from "../../../Theme/Modal/ModalAnimated";
import frClasses from '../../../FormStyles/Form.module.css';
import classes from './PrijaviSeForm.module.css';
import { IoClose } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import { CreatePrijavaDTO } from "../../../../api/DTO-s/Prijave/PrijaveDTO";
import useCurrUser from "../../../../hooks/useCurrUser";
import { CenaOglasaValidation, DodatnaCenaPrijavaValidation, OpisOglasaValidation } from "../../../../lib/Forms/FormValidation";
import { formatDoubleWithWhite } from "../../../../lib/utils";
import usePrijavaController, { minCenaPrijave } from "../../../../api/controllers/usePrijavaController";
import { useParams } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import useLogout from "../../../../hooks/useLogout";
import { SessionEndedError } from "../../../../api/controllers/useUserControllerAuth";
import InfoBox from "../../../Theme/Boxes/InfoBox";

type PropsValues = {
    style: any;
    close: () => void;
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

type FormValues = CreatePrijavaDTO & {
    minBid: number;
}

export default function PrijaviSeForm({ close, style, setSuccessMessage }: PropsValues) {
    const { id } = useParams();

    const { register, handleSubmit, formState, watch, setError } = useForm<FormValues>();
    const { errors, isSubmitting, isValid } = formState;

    const { userData, refetchUser } = useCurrUser();
    const { novacNaSajtu } = userData!;

    const { prijaviSe } = usePrijavaController();
    const { showBoundary } = useErrorBoundary();
    const logoutUser = useLogout();

    const ponuda = watch('ponuda');
    const bid = watch('bid');

    async function onSubmit(values: FormValues) {
        const { bid: enteredBid, opis, ponuda } = values;
        try {
            if(!id)
                throw new Error("Id oglasa nije lepo procitan");

            const bid = enteredBid ? enteredBid + minCenaPrijave : minCenaPrijave;

            if(bid > novacNaSajtu) {
                setError("minBid", {
                    type: "manual",
                    message: "Nemate dovoljno novca za ovu prijavu"
                })
                return;
            }

            const dto: CreatePrijavaDTO = {
                bid,
                opis,
                ponuda,
                oglasId: id
            }

            const data = await prijaviSe(dto);
            if (data === true) {
                setSuccessMessage('Uspešno ste se prijavili na oglas');
            }
            else {
                setSuccessMessage('Greška pri prijavljivanju na oglas, zamisli da je ova poruka crvene boje');
            }
            refetchUser!();
            close();
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
                        <h3>Prijavite se na oglas</h3>
                        <IoClose onClick={close} size='2rem' />
                    </div>
                </section>

                <section style={{overflow: 'scroll', height: window.innerWidth < 1000 ? '60vh' : '600px'}} className={classes.scroll}>
                        <h4>Ponuda za oglas</h4>
                        <p>Koliko želite da naplatite klijentu za ovaj posao, ovo nije finalna cena, možete kasnije da se dogovarate za tačnu cenu posla.</p>
                        <input
                            className={errors.ponuda ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                            id="ponuda"
                            placeholder='50000'
                            {...register("ponuda", CenaOglasaValidation)}
                        />
                        <p className={frClasses.pError}>
                            {errors.ponuda?.message && <MdErrorOutline />}
                            {errors.ponuda?.message}
                        </p>

                        <h4>Opis prijave</h4>
                        <p>
                            Napišite kako bi ste rešili problem koji ima klijent, možete da napišete kako ste za nekog prethodnog vašeg klijenta rešili sličan problem.
                        </p>
                        <p>
                            Ovo je najbitnije polje za prijavu na oglas, klijenta zanima samo jedna stvar: kako da reši problem.
                        </p>
                        <p>
                            Ukoliko uspete da u prve dve rečenice ubedite klijenta da ste vi prava osoba za ovaj problem posao vam je zagarantovan.
                        </p>
                        <textarea
                            className={errors.opis ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                            id="opis"
                            placeholder='Moj tim i ja smo se uspešno izborili sa sličnim projektima asfaltiranja puta, donoseći rešenja koja garantuju dugotrajnost i kvalitet. Naša iskustva su nas naučila kako da efikasno upravljamo resursima, minimizujemo prekide u saobraćaju i osiguramo visok standard bezbednosti na gradilištu. Spremni smo da primenimo naše veštine i ekspertizu kako bismo vaših 3km puta pretvorili u glatku, pouzdanu površinu koja će izdržati test vremena.'
                            rows={10}
                            {...register("opis", OpisOglasaValidation)}
                        />
                        <p className={frClasses.pError}>
                            {errors.opis?.message && <MdErrorOutline />}
                            {errors.opis?.message}
                        </p>

                        <h4>Cena prijave</h4>
                        <p>Vaše stanje: {formatDoubleWithWhite(novacNaSajtu)} RSD</p>
                        <label className={frClasses.label}>Minimalna cena prijave</label>
                        <input type="text" className={frClasses.input} disabled value={minCenaPrijave}/>
                        <p className={frClasses.pError}>
                            {errors.minBid?.message && <MdErrorOutline />}
                            {errors.minBid?.message}
                        </p>
                        <p>Ukoliko želite da vaša prijava bude jedna od prvih koju klijent vidi kada otvori sve prijave, možete da platite više za prijavu.</p>
                        <label htmlFor="bid" className={frClasses.label}>Uplati dodatno za prijavu</label>
                        <input
                            className={errors.bid ? `${frClasses.error} ${frClasses.input}` : frClasses.input}
                            id="bid"
                            placeholder='100'
                            {...register("bid", DodatnaCenaPrijavaValidation(novacNaSajtu))}
                        />
                        <p className={frClasses.pError}>
                            {errors.bid?.message && <MdErrorOutline />}
                            {errors.bid?.message}
                        </p>

                        <InfoBox>
                            <p>Klijent vas može odmah zaposliti nakon prijave.</p>
                            <p>Vaš broj telefona i email adresa će biti vidljivi klijentu kada otvori vašu prijavu.</p>
                            <p>Klijent bi vas trebao kontaktirati ako je zainteresovan. Ako vas zaposli pre nego što stupite u kontakt, to se može smatrati pokušajem prevare i imate pravo da ga prijavite.</p>
                        </InfoBox>
                        <div className={classes.review}>
                            <h4>Pregledajte ponovo vašu prijavu pre slanja</h4>
                            <p>Ponuda: {!Number.isNaN(ponuda) && isValid ? formatDoubleWithWhite(ponuda) : '0'} RSD</p>
                            <p>Cena prijave: {!Number.isNaN(bid) && isValid ? bid + minCenaPrijave : minCenaPrijave} RSD</p>
                            <p>Stanje nakon plaćanja oglasa: {!Number.isNaN(bid) && isValid ? formatDoubleWithWhite(novacNaSajtu - bid - minCenaPrijave) : formatDoubleWithWhite(novacNaSajtu - minCenaPrijave)} RSD</p>
                        </div>
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
                            <span className="button__text">Save</span>
                        </button>
                    </div>
                </section>
            </form>
        </ModalAnimated>
    )
}