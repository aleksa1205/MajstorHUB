import { createContext } from "react";
import { CreateOglasDTO, GetOglasDTO } from "../../../../api/DTO-s/Oglasi/OglasiDTO";
import ModalAnimated from "../../../Theme/Modal/ModalAnimated"
import EditNaslov from "./EditNaslov";
import EditOpis from "./EditOpis";
import EditCena from "./EditCena";
import EditIskustvoVreme from "./EditIskustvoVreme";
import EditLokacija from "./EditLokacija";
import EditVestine from "./EditVestine";

export enum EditOglasFormType {
    Nedefinisano,
    Naslov,
    Opis,
    Vestine,
    IskustvoVreme,
    Budzet,
    Lokacija
}

type PropsValues = {
    formType: EditOglasFormType,
    style: any
    oglasData: CreateOglasDTO;
    setOglas: React.Dispatch<React.SetStateAction<CreateOglasDTO | undefined>> | React.Dispatch<React.SetStateAction<GetOglasDTO | null>>
    close: () => void,
}

type EditOglasFormContext = {
    oglasData: CreateOglasDTO;
    setOglas: React.Dispatch<React.SetStateAction<CreateOglasDTO | undefined>> | React.Dispatch<React.SetStateAction<GetOglasDTO | null>>
    close: () => void,
}

export const EditOglasFormContext = createContext<EditOglasFormContext | null>(null)

export default function EditOglasMain({ close, formType, oglasData, style, setOglas }: PropsValues) {
    
    const defaultValues : EditOglasFormContext = {
        close,
        setOglas,
        oglasData
    }

    let res = <></>;
    switch (formType) {
        case EditOglasFormType.Naslov:
            res = <EditNaslov /> 
            break;
        case EditOglasFormType.Opis:
            res = <EditOpis />
            break;
        case EditOglasFormType.Budzet:
            res = <EditCena />
            break;
        case EditOglasFormType.IskustvoVreme:
            res = <EditIskustvoVreme />
            break;
        case EditOglasFormType.Lokacija:
            res = <EditLokacija />
            break;
        case EditOglasFormType.Vestine:
            res = <EditVestine />
            break;
    }

    return (
        <EditOglasFormContext.Provider value={defaultValues}>
            <ModalAnimated onClose={close} style={style}>
                {res}
            </ModalAnimated>
        </EditOglasFormContext.Provider>
    )
}