import { useErrorBoundary } from "react-error-boundary";
import { PrijavaZaAdminaDTO } from "../../../api/DTO-s/Admin/AdminDTOs"
import useAdminController from "../../../api/controllers/useAdminController";
import useLogout from "../../../hooks/useLogout";
import UserType from "../../../lib/UserType";
import { useId, useState } from "react";
import { SessionEndedError } from "../../../api/controllers/useUserControllerAuth";
import { PopUpMessage } from "../../../hooks/usePopUpMessage";
import classes from './Prijava.module.css';

type PropsValues = {
    prijava: PrijavaZaAdminaDTO;
    setPopUpMessage: React.Dispatch<React.SetStateAction<PopUpMessage | null>>
    refetch: () => void;
}

export default function PrijavaCard({ prijava, setPopUpMessage, refetch }: PropsValues) {
    const { naziv, userId, userType } = prijava;

    const { enrolAsAdmin, rejectAdmin } = useAdminController();
    const logoutUser = useLogout();
    const { showBoundary } = useErrorBoundary();
    const [isFetching, setIsFetching] = useState<boolean>(false);

    async function enrol() {
        try {
            setIsFetching(true);

            await enrolAsAdmin(userId, userType);
            setPopUpMessage({
                message: `Uspešno ste odobrili korisnika ${naziv} kao admina`,
                type: 'success'
            })
        } catch (error) {
            if(error instanceof SessionEndedError) {
                logoutUser();
            }
            else
                showBoundary(error);
        }
        finally {
            setIsFetching(false);
            refetch();
        }
    }

    async function reject() {
        try {
            setIsFetching(true);

            await rejectAdmin(userId);
            setPopUpMessage({
                message: `Uspešno ste odbili prijavu korisnika ${naziv}`,
                type: 'success'
            })
        } catch (error) {
            if(error instanceof SessionEndedError) {
                logoutUser();
            }
            else
                showBoundary(error);
        }
        finally {
            setIsFetching(false);
            refetch();
        }
    }
    return (
        <div className={classes.card}>
            <div>
                <h4>{naziv}</h4>
                <p>{UserType[userType]}</p>
            </div>
            <div>
                <button
                    onClick={enrol}
                    disabled={isFetching}
                    className={
                    "mainButtonSmall" + " " + `${isFetching ? "button--loading" : ""}`
                    }
                >
                    <span className="button__text">Odobri zahtev</span>
                </button>
                <button
                    onClick={reject}
                    disabled={isFetching}
                    className={
                    "secondaryButtonSmall" + " " + `${isFetching ? "button--loading" : ""}`
                    }
                >
                    <span className="button__text">Odbij zahterv</span>
                </button>
            </div>
        </div>
    )
}