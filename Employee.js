import { HashLink as Link } from "react-router-hash-link";import styled from "styled-components";
import Test from "./Test";

const Div = styled.div`
    display: flex;
    flex-direction: column;
    width: 30vw;
    height: 30vh;

`;

export default function Employee({employee, children}) {
    return (
        <Div>
            <h2>{employee.nombre}</h2>
            {children}
        </Div>
    );
}