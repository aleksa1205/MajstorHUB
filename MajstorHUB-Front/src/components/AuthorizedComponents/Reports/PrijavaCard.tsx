import { useErrorBoundary } from "react-error-boundary";
import { GetRazlogPrijaveDisplaName, ReportDto } from "../../../api/DTO-s/Report/ReportDTOs"
import UserType from "../../../lib/UserType";
import {  formatDateBefore } from "../../../lib/utils";
import ShowMore from "../../Theme/ShowMoreContainer/ShowMore";
import classes from "./Prijava.module.css";
import useReportController from "../../../api/controllers/useReportController";
import useModalAnimation from "../../../hooks/useModalAnimation";
import ConfirmBan from "../UsersProfiles/EditUserForms/ConfirmBan";
import useAdminController from "../../../api/controllers/useAdminController";
import { useState } from "react";
import { PopUpMessage } from "../../../hooks/usePopUpMessage";

type PropsValues = {
    prijava: ReportDto,
    refetch: () => void;
    setPopUpMessage: React.Dispatch<React.SetStateAction<PopUpMessage | null>>
}

export default function PrijavaCard({ prijava, refetch, setPopUpMessage }: PropsValues) {
    const { inicijator,
            tipInicijatora,
            prijavljeni,
            tipPrijavljenog,
            datumPrijave,
            razlog,
            opis
    } = prijava;

    const [tip, setTip] = useState<'inicijator' | 'prijavljeni'>('inicijator');

    const { deleteReport } = useReportController();
    const { blockUser } = useAdminController();
    const { showBoundary} = useErrorBoundary();

    async function deleteHandler() {
        try {
            await deleteReport(prijava.id);
            setPopUpMessage({
                message: 'Uspešno ste obrisali prijavu',
                type: 'success'
            })
            refetch();
        } catch (error) {
            showBoundary(error);
        }
    }

    const { closeModal, openModal, transition } = useModalAnimation();

    async function blockInicijator() {
        try {
            await blockUser(inicijator, tipInicijatora);
            setPopUpMessage({
                message: 'Uspešno ste blokirali inicijatora prijave',
                type: 'success'
            })
        } catch (error) {
                showBoundary(error);
        }
    }

    async function blockPrijavljeni() {
        try {
            await blockUser(prijavljeni, tipPrijavljenog);
            setPopUpMessage({
                message: 'Uspešno ste blokirali prijavljenog',
                type: 'success'
            })
        } catch (error) {
                showBoundary(error);
        }
    }

    function blockInicijatorHandler() {
        setTip('inicijator')
        openModal();
    }

    function blockPrijavljenHandler() {
        setTip('prijavljeni')
        openModal();
    }

    return (
        <>
            {transition((style, show) => {
                return show ? (
                    <>
                        {tip === 'inicijator' && (
                            <ConfirmBan callback={blockInicijator} close={closeModal} style={style} />
                        )}
                        {tip === 'prijavljeni' && (
                            <ConfirmBan callback={blockPrijavljeni} close={closeModal} style={style} />
                        )}                
                    </>

                ) : null;
            })}

            <div className={classes.card}>
                <p>Prijavljeno pre {formatDateBefore(datumPrijave)}</p>

                <div className={classes.users}>
                    <div>
                        <h4>Inicijator</h4>
                        <p>{inicijator}</p>
                        <p>{UserType[tipInicijatora]}</p>
                    </div>

                    <div>
                        <h4>Prijavljeni</h4>
                        <p>{prijavljeni}</p>
                        <p>{UserType[tipPrijavljenog]}</p>
                    </div>
                </div>

                <div>
                    <p>Tip prijave: {GetRazlogPrijaveDisplaName(razlog)}</p>
                    {opis && (
                        <ShowMore text={opis} />
                    )}
                </div>

                <div className={classes.buttons}>
                    <button onClick={blockInicijatorHandler} className="mainButtonSmall">Blokiraj inicijatora</button>
                    <button onClick={blockPrijavljenHandler} className="mainButtonSmall">Blokiraj prijavljenog</button>
                    <button onClick={deleteHandler} className="secondaryButtonSmall">Obrisi ovu prijavu</button>
                </div>
            </div>
        </>
    )
}