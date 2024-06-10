import EditImePrezime from "./EditImePrezime";
import EditAdresa from "./EditAdresa";
import EditStruka from "./EditStruka";
import { userDataUpdateType } from "../../../../api/DTO-s/updateSelfTypes";
import EditSlika from "./EditSlika";
import EditBrojTelefona from "./EditBrojTelefona";
import EditDatumRodjenja from "./EditDatumRodjenja";
import EditOpis from "./EditOpis";
import ModalAnimated from "../../../Theme/Modal/ModalAnimated";
import EditCenaPoSatu from "./EditCenaPoSatu";
import EditIskustvo from "./EditIskustvo";
import EditStruke from "./EditStruke";
import EditImeFirme from "./EditNaziv";
import ReportForm from "../../Reports/ReportFrom";
import { PopUpMessage } from "../../../../hooks/usePopUpMessage";
import UserType from "../../../../lib/UserType";

type PropsValues = {
    formType: EditUserFormType,
    close: () => void,
    updateUser: React.Dispatch<React.SetStateAction<userDataUpdateType | null>>,
    userData: userDataUpdateType;
    style: any;
    setMessage: React.Dispatch<React.SetStateAction<PopUpMessage | null>>
    userId: string;
    userType: UserType
}

export enum EditUserFormType {
    Nedefinisano,
    ImePrezime,
    ImeFirme,
    Slika,
    Adresa,
    Opis,
    Struka,
    Struke,
    BrojTelefona,
    DatumRodjenja,
    Iskustvo,
    CenaPoSatu,
    Report
}

function EditUserFormContext({ formType, close, updateUser, userData, style, setMessage, userId, userType } : PropsValues) {
    
    let res;
    switch (formType) {
        case EditUserFormType.ImePrezime:
            res = <EditImePrezime close={close} updateUser={updateUser} userData={userData} />
            break;
        case EditUserFormType.Adresa:
            res = <EditAdresa close={close} updateUser={updateUser} userData={userData} />
            break;
        case EditUserFormType.Struka:
            res = <EditStruka close={close} updateUser={updateUser} userData={userData} />
            break;
        case EditUserFormType.Slika:
            res = <EditSlika close={close} updateUser={updateUser} userData={userData} />
            break;
        case EditUserFormType.BrojTelefona:
            res = <EditBrojTelefona close={close} updateUser={updateUser} userData={userData} />
            break;
        case EditUserFormType.DatumRodjenja:
            res = <EditDatumRodjenja close={close} updateUser={updateUser} userData={userData} />
            break;
        case EditUserFormType.Opis:
            res = <EditOpis close={close} updateUser={updateUser} userData={userData} />
            break;
        case EditUserFormType.CenaPoSatu:
            res = <EditCenaPoSatu close={close} updateUser={updateUser} userData={userData} />
            break;
        case EditUserFormType.Iskustvo: 
            res = <EditIskustvo close={close} updateUser={updateUser} userData={userData} />
            break;
        case EditUserFormType.Struke:
            res = <EditStruke close={close} updateUser={updateUser} userData={userData} />
            break;
        case EditUserFormType.ImeFirme:
            res = <EditImeFirme close={close} updateUser={updateUser} userData={userData} />
            break;
        case EditUserFormType.Report:
            res = <ReportForm close={close} setMessage={setMessage} userId={userId} userType={userType}/>
            break;
        default:
            break;
    }

    return (
        <ModalAnimated style={style} onClose={close} >
            {res}
        </ModalAnimated>
    )
}

export default EditUserFormContext;