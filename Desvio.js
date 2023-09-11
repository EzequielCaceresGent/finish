import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from 'styled-components';
import Nav from "./Nav";

export default function Desvio(props) {
    const {state} = useLocation();
    const [desvio, setDesvio] = useState(props.desvio ?? state?.desvio);
    const Div=styled.div`
        height: 90vh;
        width: 100%;
        background-color: #31302F;
        p,h2{
            margin: 0px;
            color: white;
        }
        .font-link {
        font-family:  'Courier New', Courier, monospace;     
        }
        #desvio{
            width: auto;
            height: 30vh;
            border: solid #008CBA 2px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-evenly;
        }
    
    `
    return (
           <> 
           <Nav user={props.user}></Nav>
        <Div>
            <br></br>
            <div id="desvio">
            <h2 className="font-link"> Detalle de desvio:</h2>
            <p className="font-link">  {desvio?.detalle}</p>
            <h2 className="font-link"> Fecha de desvio:</h2>
            <p className="font-link">{desvio?.fecha}</p>
            <h2 className="font-link"> Coste de empleados Disponible:</h2>
            <p className="font-link">{desvio?.costeEmpleadosDisponibles}</p>
            </div>

           
        </Div>
        </>
    );
}