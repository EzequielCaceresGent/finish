import styled from "styled-components";

const Div = styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;

    p {
        flex-grow: 3;
    }

    div > p {
        width: 100%;
        flex-grow: 1;
    }
`;

export default function Vacation({vacation}) {
    return (
        <Div>
            <p>Nombre: {vacation.employee.nombre}</p>
            <div>
                <p>Desde: {vacation.desde}</p>
                <p>Hasta: {vacation.hasta}</p>
            </div>
        </Div>
    );
}