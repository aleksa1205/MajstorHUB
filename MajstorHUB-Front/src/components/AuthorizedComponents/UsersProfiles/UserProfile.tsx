import { useParams } from "react-router-dom";
import UserType from "../../../lib/UserType";
import { userDataType } from "../../../api/DTO-s/responseTypes";
import useAuth from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import useUserControllerAuth, {
  SessionEndedError,
} from "../../../api/controllers/useUserControllerAuth";
import useLogout from "../../../hooks/useLogout";
import { useErrorBoundary } from "react-error-boundary";
import useCurrUser from "../../../hooks/useCurrUser";
import Hamster from "../../Theme/Loaders/Hamster";
import { isAxiosError } from "axios";
import classes from "./UserProfile.module.css";
import { userDataUpdateType } from "../../../api/DTO-s/updateSelfTypes";
import { getUpdateUserFromUserData } from "../../../lib/utils";
import ProfileData from "./ProfileData";
import NotFoundImageUrl from '../../../../pictures/not-found.png';
import { ForbiddenError } from "../../../api/controllers/useOglasController";
import PrivateAccountUrl from "../../../../pictures/private_account.png";

type PropsValues = {
  typeFromUrl: UserType;
};

function UserProfile({ typeFromUrl }: PropsValues) {
  const { id } = useParams();

  const { auth } = useAuth();
  const { getById } = useUserControllerAuth(typeFromUrl);

  const logoutUser = useLogout();
  const { showBoundary } = useErrorBoundary();

  const currUserData = useCurrUser();
  const [success, setSuccess] = useState<boolean>(false);
  const [userData, setUserData] = useState<userDataType | null>(null);
  const [userDataUpdate, setUserDataUpdate] = useState<userDataUpdateType | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [notFound, setNotFound] = useState(id?.length !== 24);
  const [isCurrUser, setIsCurrUser] = useState<boolean>(id === auth.userId);
  const [forbidden, setForbidden] = useState<boolean>(false);

    useEffect(() => {
        const controller = new AbortController();

        async function startFetching() {
          try {
            setIsFetching(true);
  
            const data = await getById(id!, controller);
  
            if (data === false) {
              setIsFetching(false);
              setNotFound(true);
              return;
            }
  
            setUserData(data);
            setUserDataUpdate(getUpdateUserFromUserData(data));
            setIsFetching(false);
          } catch (error) {
            if (isAxiosError(error) && error.name === "CanceledError") {
              console.log("GetById zahtev canceled");
            } else if (error instanceof SessionEndedError) {
              logoutUser();
              setIsFetching(false);
            } else if (error instanceof ForbiddenError) {
              setForbidden(true);
              setIsFetching(false);
            } else {
              setIsFetching(false);
              showBoundary(error);
            }
          }
        }
  
        setIsCurrUser(id === auth.userId);
  
        if (!notFound) {
          if (isCurrUser) {
            if (currUserData.userData) {
              setUserData(currUserData.userData);
              setUserDataUpdate(getUpdateUserFromUserData(currUserData.userData));
            }
            if (
              currUserData.isFetching !== null &&
              typeof currUserData.isFetching !== "undefined"
            )
              setIsFetching(currUserData.isFetching);
          } else {
            startFetching();
          }
        }
  
        return function () {
          controller.abort();
        };
    }, [currUserData.isFetching, isCurrUser, id]);

  return (
    <main className={`${classes.main}`}>
      {notFound ? (
        <div className='container'>
            <div className={`${classes.center}`}>
            <img src={NotFoundImageUrl} alt="Not Found" />
            <h1>Nismo pronašli nalog koji tražite :(</h1>
            </div>
        </div>
      ) : isFetching ? (
        <div className='container'>
            <div className={`${classes.center}`}>
                <Hamster />
            </div>
        </div>
      ) : forbidden ? (
        <div className='container'>
            <div className={`${classes.center}`}>
                <img src={PrivateAccountUrl} alt="Private Account" />
                <h1>Ovaj nalog je privatan</h1>
            </div>
        </div>
      ) : (
        <>
          {userDataUpdate && (
            <ProfileData
              userData={userDataUpdate}
              userDataPriv={userData!}
              isCurrUser={isCurrUser}
              setUserData={setUserDataUpdate}
              setSuccess={setSuccess}
              success={success}
            />
          )}
        </>
      )}
    </main>
  );
}

export default UserProfile;
