import { useForm } from 'react-hook-form';
import { CreateReportDTO, GetRazlogPrijaveDisplaName, RazlogPrijave } from '../../../api/DTO-s/Report/ReportDTOs';
import classes from '../../FormStyles/Form.module.css';
import { IoClose } from "react-icons/io5";
import DropDown from '../../Theme/DropDown/DDSelect';
import { useErrorBoundary } from 'react-error-boundary';
import UserType from '../../../lib/UserType';
import { PopUpMessage } from '../../../hooks/usePopUpMessage';
import useReportController from '../../../api/controllers/useReportController';

type PropsValues = {
    close: () => void,
    setMessage: React.Dispatch<React.SetStateAction<PopUpMessage | null>>
    userId: string;
    userType: UserType
}

type FromValues = {
    razlog: RazlogPrijave,
    opis: string;
}

function ReportForm({ close, setMessage, userId, userType }: PropsValues) {
    const form = useForm<FromValues>({defaultValues: {
        razlog: RazlogPrijave.Ostalo,
    }});
    const { register, handleSubmit, formState } = form;
    const { errors, isSubmitting } = formState;
    const { showBoundary } = useErrorBoundary();
    const { report } = useReportController();

    async function submit(values: FromValues) {
        const { opis, razlog } = values;

        const data: CreateReportDTO = {
            opis,
            razlog,
            prijavljeni: userId,
            tipPrijavljenog: userType
        }

        try {
            await report(data)
            setMessage({
                message: `Uspešno ste prijavili korisnika. Neko od admina će uskoro pogledati prijavu`,
                type: 'success'
            })
            close(); 
        } catch (error) {
            showBoundary(error);
        }
    }

    return (
            <form style={{width: '46rem'}} className={classes.form} noValidate onSubmit={handleSubmit(submit)} >
                <section>
                    <div className={classes.header}>
                        <h3>Prijavite Korisnika</h3>
                        <IoClose onClick={close} size='2rem' />
                    </div>
                </section>

                <section>
                    <h4>Razlog prijave</h4>
                    <DropDown>
                    <select
                        className={errors.razlog ? `${classes.error}` : ""}
                        id="struka"
                        {...register("razlog", {
                            valueAsNumber: true,
                            required: 'Ovo je obavezno polje',
                        })}
                    >
                        <option value={RazlogPrijave.Ostalo}>{GetRazlogPrijaveDisplaName(RazlogPrijave.Ostalo)}</option>
                        <option value={RazlogPrijave.LazanProfil}>{GetRazlogPrijaveDisplaName(RazlogPrijave.LazanProfil)}</option>
                        <option value={RazlogPrijave.NarusavanjePrivatnosti}>{GetRazlogPrijaveDisplaName(RazlogPrijave.NarusavanjePrivatnosti)}</option>
                        <option value={RazlogPrijave.NeprihvatljivSadrzaj}>{GetRazlogPrijaveDisplaName(RazlogPrijave.NeprihvatljivSadrzaj)}</option>
                        <option value={RazlogPrijave.Pretnje}>{GetRazlogPrijaveDisplaName(RazlogPrijave.Pretnje)}</option>
                        <option value={RazlogPrijave.Spam}>{GetRazlogPrijaveDisplaName(RazlogPrijave.Spam)}</option>
                        <option value={RazlogPrijave.NezavrseniProjekti}>{GetRazlogPrijaveDisplaName(RazlogPrijave.NezavrseniProjekti)}</option>
                    </select>
                    </DropDown>

                    <h4>Opišite prijavu</h4>
                    <textarea
                        className={errors.opis ? `${classes.error} ${classes.input}` : classes.input}
                        id="opis"
                        rows={4}
                        placeholder="Sadržaj recenzije sadrži neprikladne reči"
                        {...register("opis")}
                    />
                </section>

                <section>
                    <div className={classes.btnContainer}>
                        <button className='secondLink' onClick={close} type='button'>Odustani</button>
                        <button
                            disabled={isSubmitting}
                            className={
                            "mainButtonSmall" + " " + `${isSubmitting ? "button--loading" : ""}`
                            }
                            >
                            <span className="button__text">Pusti prijavu</span>
                        </button>
                    </div>
                </section>
            </form>
    )
}

export default ReportForm;