import { useState } from "react";
import UserType from "../../../lib/UserType";
import { BasicInfoSection } from "./UserProfile";
import { KorisnikDataUpdate, FirmaDataUpdate, MajstorDataUpdate } from "../../../api/DTO-s/updateSelfTypes";

type PropsValues = {
    userType: UserType;
    userData : KorisnikDataUpdate | MajstorDataUpdate | FirmaDataUpdate
}

function KorisnikProfile({ userType, userData } : PropsValues) {
    const [userDataUpdate, setUserDataUpdate] = useState<KorisnikDataUpdate | MajstorDataUpdate | FirmaDataUpdate>({

    });
    
    return (
        <BasicInfoSection
    )
}

export default KorisnikProfile;