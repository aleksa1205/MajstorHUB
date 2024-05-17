import {  useParams } from "react-router-dom";
import UserType from "../../../lib/UserType";
import { userDataType } from "../../../api/DTO-s/responseTypes";
import useAuth from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import useUserControllerAuth, { SessionEndedError } from "../../../api/controllers/useUserControllerAuth";
import useLogout from "../../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";
import useCurrUser from "../../../hooks/useCurrUser";
import Hamster from "../../Loaders/Hamster";
import { isAxiosError } from "axios";
import classes from './UserProfile.module.css'
import { userDataUpdateType } from "../../../api/DTO-s/updateSelfTypes";
import { getUpdateUserFromUserData } from "../../../lib/utils";
import ProfileData from "./ProfileData";

type PropsValues = {
    typeFromUrl: UserType;
}

function UserProfile({ typeFromUrl } : PropsValues) {
    const { id } = useParams();

    const { auth } = useAuth();
    const { getById } = useUserControllerAuth(typeFromUrl);

    const logoutUser = useLogout();
    const { showBoundary } = useErrorBoundary();

    const currUserData = useCurrUser();
    const [userData, setUserData] = useState<userDataType | null>(null);
    const [userDataUpdate, setUserDataUpdate] = useState<userDataUpdateType | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [notFound, setNotFound] = useState(id?.length !== 24);


    const isCurrUser = id === auth.userId;

    useEffect(function() {
        const controller = new AbortController();

        async function startFetching() {
            try {
                setIsFetching(true);

                const data = await getById(id!, controller);

                if(data === false) {
                    setIsFetching(false);
                    setNotFound(true);
                    return;
                }
                
                setUserData(data);
                setUserDataUpdate(getUpdateUserFromUserData(data));
                setIsFetching(false);
            } catch (error) {
                if(isAxiosError(error) && error.name === 'CanceledError') {
                    console.log('GetById zahtev canceled');
                }
                else if(error instanceof SessionEndedError) {
                    logoutUser();
                    setIsFetching(false);
                }
                else {
                    setIsFetching(false);
                    showBoundary(error)
                }
            }
        }

        if(!notFound) {
            if(isCurrUser) {
                if(currUserData.userData) {
                    setUserData(currUserData.userData);
                    setUserDataUpdate(getUpdateUserFromUserData(currUserData.userData));
                }
                if(currUserData.isFetching !== null && typeof currUserData.isFetching !== 'undefined')
                    setIsFetching(currUserData.isFetching);
    
            } else {
                startFetching();
            }
        }

        return function() {
            controller.abort();
        }

    }, [currUserData.isFetching]);

    return (
        <div className="container">

            {notFound ? (
                <div className={classes.center}>
                    <h1>Nismo pronasli user-a kog trazite :(</h1>
                </div>
            ) : 
             isFetching ? (
                <div className={classes.center}>
                    <Hamster />
                </div>
             ) : 
             (
                <main className={classes.main}>
                    {userDataUpdate &&
                        <ProfileData userData={userDataUpdate} isCurrUser={isCurrUser} />
                    }
                </main>
             )
            }
        </div>
    )
}

export default UserProfile;
