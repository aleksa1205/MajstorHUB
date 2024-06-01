import { useState } from "react";
import UserType from "../../../lib/UserType";
import FilterForm from "./FilterForm";
import UserCard from "./UserCard";
import { userDataType } from "../../../api/DTO-s/responseTypes";
import Hand from "../../Theme/Loaders/Hand";
import NotFound from '../../../../pictures/serach no data.jpg'
import classes from './FilterUser.module.css'
import useAuth from "../../../hooks/useAuth";

type PropsValues = {
    type : UserType
}

function FilterUsers({type} : PropsValues) {
    const [users, setUsers] = useState<userDataType[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const { auth } = useAuth();

    return (
        <main className={`${classes.main} container`}>
            <FilterForm type={type} setUsers={setUsers} setIsFetching={setIsFetching} />
            {isFetching && (
                <div className={classes.center}>
                    <Hand />
                </div>
            )}
            {(users.length === 0 && !isFetching) && (
                <div className={classes.notFoundCont}>
                    <img src={NotFound} alt="Not Found" />
                    <h3>Nema rezultata koji odgovaraju vašem pretraživanju.</h3>
                    <p>Molimo pokušajte da modifikujete svoje pretraživanje kako biste dobili više rezultata.</p>
                </div>
            )}
            <div className={classes.userCards}>
                {!isFetching && users.map(user => {
                    return <UserCard key={user.id} userData={user} currUserId={auth.userId} />
                })}
            </div>
        </main>
    )
}

export default FilterUsers;