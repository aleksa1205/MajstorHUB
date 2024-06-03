import { UseFormSetValue } from 'react-hook-form';
import { CreateOglasDTO, GetOglasDTO, OglasUpdateSelfDTO, getDuzinaPoslaDisplayName } from '../../../../api/DTO-s/Oglasi/OglasiDTO'
import { Iskustvo, Struka, getStrukaDisplayName } from '../../../../api/DTO-s/responseTypes';
import EditButton from '../../../Theme/Buttons/EditButton';
import classes from './PregledOglasa.module.css'
import { CreateOglasFormValues } from '../../../../routes/Oglasi/PostaviOglas';
import useOglasController, { ForbiddenError } from '../../../../api/controllers/useOglasController';
import { SessionEndedError } from '../../../../api/controllers/useUserControllerAuth';
import useLogout from '../../../../hooks/useLogout';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import EditOglasMain, { EditOglasFormType } from '../IzmeniOglas/EditOglasMain';
import { useState } from 'react';
import useModalAnimation from '../../../../hooks/useModalAnimation';

type PropsValues = {
    oglasData: CreateOglasDTO;
    oglasId?: string;
    preview?: boolean;
    setOglas?: React.Dispatch<React.SetStateAction<CreateOglasDTO | undefined>>
    updateOglas?: React.Dispatch<React.SetStateAction<GetOglasDTO | null>>
    prev?: () => void
    setValue?: UseFormSetValue<CreateOglasFormValues>
    setStruke?: React.Dispatch<React.SetStateAction<Struka[]>>
    struke?: Struka[],
    setEdit?: React.Dispatch<React.SetStateAction<boolean>>
    initialOglas?: GetOglasDTO,
}

export default function PregledOglasa({ oglasData, preview, prev, setOglas, updateOglas, setValue, oglasId, setEdit, initialOglas}: PropsValues) {
    const [formType, setFormType] = useState<EditOglasFormType>(EditOglasFormType.Nedefinisano);
    const { transition, closeModal, openModal } = useModalAnimation();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const { postavi, updateSelf } = useOglasController();
    const logoutUser = useLogout();
    const { showBoundary } = useErrorBoundary();
    const navigate = useNavigate();

    function nazadHandler() {
        setValue!('cena', oglasData.cena);
        setValue!('duzinaPosla', oglasData.duzinaPosla.toString());
        setValue!('iskustvo', oglasData.iskustvo.toString());
        setValue!('lokacija', oglasData.lokacija);
        setValue!('naslov', oglasData.naslov);
        setValue!('opis', oglasData.opis);
        setValue!('struke', oglasData.struke);
        //setStruke(oglasData.struke)
        prev!();
    }

    function nazadHandler2() {
        if(!initialOglas)
            throw new Error("Nisi postavio initial oglas");
        if(!updateOglas)
            throw new Error("Nisi postavio updateOglas");

        updateOglas(initialOglas);
        
        if(setEdit)
            setEdit(false);
        else
            navigate(-1);
    }

    async function postaviHandler() {
        try {
            setIsSubmitting(true);

            const data = await postavi(oglasData);
            navigate(`/success?message=Uspešno ste kreirali oglas&to=oglasi/${data}`);
        } catch (error) {
            if(error instanceof SessionEndedError)
                logoutUser();
            else
                showBoundary(error);
        }
        finally {
            setIsSubmitting(false);
        }
    }

    async function izmeniHandler() {
        if(!oglasId)
            throw new Error("nisi uneo id oglasa");
        try {
            setIsSubmitting(true);
            const data: OglasUpdateSelfDTO = {
                id: oglasId!,
                ...oglasData
            }

            await updateSelf(data);
            navigate(`/success?message=Uspešno ste ažurirali oglas&to=oglasi/${oglasId!}`);
        } catch (error) {
            if (error instanceof SessionEndedError) {
                logoutUser();
                } else if (error instanceof ForbiddenError) {
                    navigate('/forbidden');
                } else {
                showBoundary(error);
                }
        }
        finally {
            setIsSubmitting(false);
        }
    }

    function openOption(type: EditOglasFormType) {
        setFormType(type);
        openModal();
    }

    return (
        <div>
            {transition((style, show) => {
                return show ? (
                    <EditOglasMain style={style} close={closeModal} formType={formType} oglasData={oglasData} setOglas={preview ? setOglas! : updateOglas!} />
                ) : null
            })}

            <div className={`${classes.heading} container`}>
                <h2>Detalji Oglasa</h2>
                {!preview ? (
                        <button
                            onClick={izmeniHandler}
                            disabled={isSubmitting}
                            className={
                            "mainButtonSmall" + " " + `${isSubmitting ? "button--loading" : ""}`
                            }
                        >
                            <span className="button__text">Izmeni ovaj oglas</span>
                        </button>
                ) : (
                    <button
                        onClick={postaviHandler}
                        disabled={isSubmitting}
                        className={
                        "mainButtonSmall" + " " + `${isSubmitting ? "button--loading" : ""}`
                        }
                    >
                    <span className="button__text">Postavi ovaj oglas</span>
                </button>
                )}
            </div>

            <div className={`${classes.main} container`}>
                <section className={classes.naslov}>
                    <div className={classes.editContainer}>
                        <h3>{oglasData.naslov}</h3>
                        <EditButton onClick={() => openOption(EditOglasFormType.Naslov)} />
                    </div>
                </section>

                <section className={classes.opis}>
                    <div className={classes.editContainer}>
                        <div className={classes.opisDiv}>{oglasData.opis}</div>
                        <EditButton onClick={() => openOption(EditOglasFormType.Opis)} />
                    </div>
                </section>

                <section className={classes.secVestine}>
                    <div className={classes.editContainer}>
                        <h4>Veštine</h4>
                        <EditButton onClick={() => openOption(EditOglasFormType.Vestine)} />
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
                        <EditButton onClick={() => openOption(EditOglasFormType.IskustvoVreme)} />
                    </div>
                    <div>
                        {`${Iskustvo[oglasData.iskustvo]}, ${getDuzinaPoslaDisplayName(oglasData.duzinaPosla)}`}
                    </div>
                </section>

                <section >
                    <div className={classes.editContainer}>
                        <h4>Budžet</h4>
                        <EditButton onClick={() => openOption(EditOglasFormType.Budzet)} />
                    </div>
                    <div>
                        {oglasData.cena} dinara
                    </div>
                </section>

                <section>
                    <div className={classes.editContainer}>
                        <h4>Lokacija</h4>
                        <EditButton onClick={() => openOption(EditOglasFormType.Lokacija)} />
                    </div>
                    <div>
                        {oglasData.lokacija}
                    </div>
                </section>

                <section className={classes.btnContainer}>
                    {preview && (
                        <>
                            <button onClick={nazadHandler} className='secondaryButtonSmall'>Nazad</button>
                            <button
                                onClick={postaviHandler}
                                disabled={isSubmitting}
                                className={
                                "mainButtonSmall" + " " + `${isSubmitting ? "button--loading" : ""}`
                                }
                            >
                                <span className="button__text">Postavi oglas</span>
                            </button>
                        </>
                    )}
                    {!preview && (
                        <>
                            <button onClick={nazadHandler2} className='secondaryButtonSmall'>Nazad</button>
                            <button
                                onClick={izmeniHandler}
                                disabled={isSubmitting}
                                className={
                                "mainButtonSmall" + " " + `${isSubmitting ? "button--loading" : ""}`
                                }
                            >
                                <span className="button__text">Izmeni oglas</span>
                            </button>
                        </>
                    )}
                </section>
            </div>
        </div>
    )
}