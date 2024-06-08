import { IoClose } from 'react-icons/io5';
import classes from '../../../FormStyles/Form.module.css';
import ModalAnimated from '../../../Theme/Modal/ModalAnimated';
import DropDown from '../../../Theme/DropDown/DDSelect';
import { useForm } from 'react-hook-form';
import useOglasController, { ForbiddenError } from '../../../../api/controllers/useOglasController';
import { useNavigate } from 'react-router-dom';
import { SessionEndedError } from '../../../../api/controllers/useUserControllerAuth';
import useLogout from '../../../../hooks/useLogout';
import { useErrorBoundary } from 'react-error-boundary';

type PropsValues = {
    style: any;
    close: () => void,
    oglasId: string;
}

type FormValues = {
    value: number;
}

export default function DeleteForm({ style, close, oglasId }: PropsValues) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<FormValues>({defaultValues: {value: -1}});
    const navigate = useNavigate();
    const { deleteSelf } = useOglasController();
    const logoutUser = useLogout();
    const {showBoundary} = useErrorBoundary();

    const value = watch('value');

    const formStyle: React.CSSProperties = {
        width: '46rem',
        padding: '1.5rem 2rem'
    }

    async function onSubmit() {
        try {
            await deleteSelf(oglasId);
            navigate('/success?message=Uspešno ste zatvorili oglas&to=dashboard', { replace: true });
        } catch (error) {
            if (error instanceof SessionEndedError) {
            logoutUser();
            } else if (error instanceof ForbiddenError) {
                navigate('/forbidden');
            } else {
            showBoundary(error);
            }
        }
    }
    
    return (
        <ModalAnimated style={style} onClose={close} >
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form} noValidate style={formStyle}>
                <div className={classes.header} >
                    <h3>Zatvori Oglas</h3>
                    <IoClose onClick={close} size='2rem' />
                </div>
                <p>Iskoristite ovo da zatvorite ovaj posao, trenutne prijave neće biti obrisane.</p>
                <br />
                <label className={classes.label} htmlFor="razlog">Razlog zatvaranje oglasa</label>
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
                    <option value={0}>Budžetska ograničenja</option>
                    <option value={1}>Projekat je otkazan</option>
                    <option value={2}>Nedovoljno kvalifikovanih kandidata</option>
                    <option value={3}>Privremeno zatvaranje pozicije</option>
                    <option value={4}>Drugi razlozi</option>
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
                    <span className="button__text">Zatvori Oglas</span>
                </button>
                </div>
            </form>
        </ModalAnimated>
    )
}