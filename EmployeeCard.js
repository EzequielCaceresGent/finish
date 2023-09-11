import styled from "styled-components";
import Overlay from "./Overlay";
import { useState } from "react";
import Vacation from "./Vacation";
import Employee from "./Employee";

const Div = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;
export default function EmployeeCard({employee, vacationRequests}) {
    const [showEmployee, setShowEmployee] = useState(false);
    const filteredVacations = vacationRequests.filter(
        request => employee.PK_dni === request.employee.PK_dni && 
                    ["Aprobado", "Rechazado"].includes(request.estado));
    return (
        <>
        <Div>
            <h2>{employee.nombre}</h2>
            <button onClick={() => setShowEmployee(!showEmployee)}>Historial</button>
        </Div>
        <Overlay show={showEmployee}>
            <Employee employee={employee}>
                {filteredVacations.map(vacation => <Vacation vacation={vacation} />)}
            </Employee>
            <button onClick={() => setShowEmployee(!showEmployee)}>close</button>
        </Overlay>
        </>
    );
}