import Blokirani from "../../components/AuthorizedComponents/Admin/Blokirani";
import PrijaveZaAdmina from "../../components/AuthorizedComponents/Admin/PrijaveZaAdmina";
import SvePrijave from "../../components/AuthorizedComponents/Reports/SvePrijave";
import { AdminRoles } from "../../context/AuthProvider";
import useAuth from "../../hooks/useAuth"
import usePopUpMessage from "../../hooks/usePopUpMessage";

export default function AdminDashboard() {
    const { auth: { admin } } = useAuth();
    const { PopUpComponent, setPopUpMessage } = usePopUpMessage();
    return (
        <div className="container">
            <PopUpComponent />
            <main>
                <SvePrijave />
                <Blokirani />
                {admin === AdminRoles.SudoAdmin && (
                    <PrijaveZaAdmina setPopUpMessage={setPopUpMessage}/>
                )}
            </main>
        </div>
    )
}