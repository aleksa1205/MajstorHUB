import { UseFormSetValue } from 'react-hook-form';
import { CreateOglasDTO, getDuzinaPoslaDisplayName } from '../../../../api/DTO-s/Oglasi/OglasiDTO'
import { Iskustvo, getStrukaDisplayName } from '../../../../api/DTO-s/responseTypes';
import EditButton from '../../../Theme/Buttons/EditButton';
import classes from './PregledOglasa.module.css'
import { CreateOglasFormValues } from '../../../../routes/Oglasi/PostaviOglas';
import useOglasController from '../../../../api/controllers/useOglasController';
import { SessionEndedError } from '../../../../api/controllers/useUserControllerAuth';
import useLogout from '../../../../hooks/useLogout';
import { useErrorBoundary } from 'react-error-boundary';

type PropsValues = {
    oglasData: CreateOglasDTO;
    preview?: boolean;
    setOglas?: React.Dispatch<React.SetStateAction<CreateOglasDTO | undefined>>
    prev?: () => void
    setValue?: UseFormSetValue<CreateOglasFormValues>
}

export default function PregledOglasa({ oglasData, preview, prev, setOglas, setValue}: PropsValues) {

    const { postavi } = useOglasController();
    const logoutUser = useLogout();
    const { showBoundary } = useErrorBoundary();

    function nazadHandler() {
        setValue!('cena', oglasData.cena);
        setValue!('duzinaPosla', oglasData.duzinaPosla.toString());
        setValue!('iskustvo', oglasData.iskustvo.toString());
        setValue!('lokacija', oglasData.lokacija);
        setValue!('naslov', oglasData.naslov);
        setValue!('opis', oglasData.opis);
        setValue!('struke', oglasData.struke);
        prev!();
    }

    async function postaviHandler() {
        try {
            await postavi(oglasData);
        } catch (error) {
            if(error instanceof SessionEndedError)
                logoutUser();
            else
                showBoundary(error);
        }
    }

    function izmeniHandler() {

    }

    return (
        <div>
            <div className={`${classes.heading} container`}>
                <h2>Detalji Oglasa</h2>
                {!preview ? (
                    <button className='mainButtonSmall'>Ažuriraj ovaj oglas</button>
                ) : (
                    <button onClick={postaviHandler} className='mainButtonSmall'>Postavi ovaj oglas</button>
                )}
            </div>

            <div className={`${classes.main} container`}>
                <section className={classes.naslov}>
                    <div className={classes.editContainer}>
                        <h3>{oglasData.naslov}</h3>
                        <EditButton />
                    </div>
                </section>

                <section className={classes.opis}>
                    <div className={classes.editContainer}>
                        <div>{oglasData.opis}</div>
                        <EditButton />
                    </div>
                </section>

                <section className={classes.secVestine}>
                    <div className={classes.editContainer}>
                        <h4>Veštine</h4>
                        <EditButton />
                    </div>
                    <div>
                        {oglasData.struke.map(el => {
                            return (
                                <div key={el} className={classes.vestina}>{getStrukaDisplayName(el)}</div>
                            )
                        })}
                    </div>
                </section>

                <section >
                    <div className={classes.editContainer}>
                        <h4>Iskustvo i Vreme trajanja posla</h4>
                        <EditButton />
                    </div>
                    <div>
                        {`${Iskustvo[oglasData.iskustvo]}, ${getDuzinaPoslaDisplayName(oglasData.duzinaPosla)}`}
                    </div>
                </section>

                <section >
                    <div className={classes.editContainer}>
                        <h4>Budžet</h4>
                        <EditButton />
                    </div>
                    <div>
                        {oglasData.cena} dinara
                    </div>
                </section>

                <section>
                    <div className={classes.editContainer}>
                        <h4>Lokacija</h4>
                        <EditButton />
                    </div>
                    <div>
                        {oglasData.lokacija}
                    </div>
                </section>

                <section className={classes.btnContainer}>
                    {preview && (
                        <>
                            <button onClick={nazadHandler} className='secondaryButtonSmall'>Nazad</button>
                            <button onClick={postaviHandler} className='mainButtonSmall'>Postavi ovaj oglas</button>
                        </>
                    )}
                    {!preview && (
                         <button className='mainButtonSmall'>Izmeni ovaj oglas</button>
                    )}
                </section>
            </div>
        </div>
    )
}