import classes from '../../../FormStyles/Form.module.css';
import usePrijavaController from '../../../../api/controllers/usePrijavaController';
import useLogout from '../../../../hooks/useLogout';
import { useErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { SessionEndedError } from '../../../../api/controllers/useUserControllerAuth';
import ModalAnimated from '../../../Theme/Modal/ModalAnimated';
import DropDown from '../../../Theme/DropDown/DDSelect';
import { IoClose } from 'react-icons/io5';
import useCurrUser from '../../../../hooks/useCurrUser';
import InfoBox from '../../../Theme/Boxes/InfoBox';

type PropsValues = {
    style: any;
    close: () => void,
    oglasId: string;
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>
}

type FormValues = {
    value: number;
}


export default function ObrisiPrijavuForm({ close, oglasId, style, setSuccessMessage }: PropsValues) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<FormValues>({defaultValues: {value: -1}});
    const { refetchUser } = useCurrUser();
    const { deleteSelf } = usePrijavaController();
    const logoutUser = useLogout();
    const {showBoundary} = useErrorBoundary();

    const value = watch('value');

    const formStyle: React.CSSProperties = {
        width: '46rem',
        padding: '1.5rem 2rem'
    }

    async function onSubmit() {
        try {
            const data = await deleteSelf(oglasId);
            if(data === true) {
                setSuccessMessage("Uspešno ste obrisali svoju prijavu")
            }
            else {
                setSuccessMessage("Greška pri brisanju prijave, zamisli da je ovo crvene boje")
            }
            refetchUser!();
            close();
        } catch (error) {
            if (error instanceof SessionEndedError) {
            logoutUser();
            } else {
            showBoundary(error);
            }
        }
    }
    
    return (
        <ModalAnimated style={style} onClose={close} >
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form} noValidate style={formStyle}>
                <div className={classes.header} >
                    <h3>Obiši Prijavu</h3>
                    <IoClose onClick={close} size='2rem' />
                </div>
                <p>Preporuka je da ne brišete svoje prijave, ali ukoliko mislite da je brisanje neophodno, to možete ovde uraditi.</p>
                <InfoBox>
                    <p>Nećemo refundirati vaš novac ukoliko obrišete prijavu.</p>
                </InfoBox>
                <br />
                <label className={classes.label} htmlFor="razlog">Razlog brisanja prijave</label>
                <DropDown>
                <select
                    className={errors.value ? `${classes.error} ${classes.input}` : classes.input}
                    id="struka"
                    {...register("value", {
                        valueAsNumber: true,
                        required: true,
                    })}
                >
                    <option value={-1}>Izaberite Opciju</option>
                    <option value={0}>Našao/la sam drugi posao</option>
                    <option value={1}>Lični razlozi</option>
                    <option value={2}>Posao nije onakav kakvim sam ga očekivao/la</option>
                    <option value={3}>Nesporazum sa klijentom</option>
                    <option value={4}>Pronašao/la sam bolju priliku</option>
                    <option value={5}>Drugi razlog</option>
                </select>
                </DropDown>

                <div className={classes.btnContainer}>
                    <button onClick={close} type='button' className='secondLink'>Izađi</button>
                    <button
                    disabled={isSubmitting || value === -1}
                    className={
                    "mainButtonSmall" + " " + `${isSubmitting ? "button--loading" : ""}`
                    }
                    >
                    <span className="button__text">Obriši prijavu</span>
                </button>
                </div>
            </form>
        </ModalAnimated>
    )
}