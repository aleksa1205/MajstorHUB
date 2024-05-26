import { useEffect, useState } from "react";
import UserType from "../../../lib/UserType";
import FilterForm from "./FilterForm";
import UserCard from "./UserCard";
import { userDataType } from "../../../api/DTO-s/responseTypes";

type PropsValues = {
    type : UserType
}

function FilterUsers({type} : PropsValues) {
    const [users, setUsers] = useState<userDataType[]>([]);

    useEffect(() => console.log(users), [users])

    return (
        <main className="container">
            <FilterForm type={type} setUsers={setUsers} />
            {users.length === 0 && (
                <h2>Unesite parametre za pretragu</h2>
            )}
            <UserCard />
        </main>
    )
}

export default FilterUsers;