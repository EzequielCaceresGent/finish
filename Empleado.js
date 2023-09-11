import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Tarea from "./Tarea";
import { useLocation } from "react-router-dom";
import TarjetaTarea from "./TarjetaTarea";
import Nav from "./Nav";

export default function Empleado(props) {
    const navigate = useNavigate();
    
    const {state} = useLocation();
    const [empleado, setEmpleado] = useState(props.empleado ?? state?.empleado);
    const [tareas, setTareas] = useState(props.tareas ?? state?.tareas);
    const [vacaciones, setVacaciones] = useState(props.vacaciones ?? state?.vacaciones);
    
    const {id} = useParams();

    useEffect(() => {
        if (props.user === undefined) 
            return navigate("/");
        if (empleado !== undefined) 
            return;
        const employeeRequest = new XMLHttpRequest();
        employeeRequest.open("GET", `http://localhost:4000/api/empleados/${id}`);
        employeeRequest.setRequestHeader("Authorization", `Basic ${props.user?.get().token}`);
        employeeRequest.onload = () => {
            console.log(employeeRequest.status);
            const data = JSON.parse(employeeRequest.response);
            if (data) 
                setEmpleado(data);
        };
    }, []);
    const Div=styled.div`
    width: 100%;
    height: 90vh;
    background-color:#31302F ;
    display: flex;
    color: white;
    justify-content: space-evenly;
    align-items: center;
  

    .font-link {
    font-family:  'Courier New', Courier, monospace;
  }
    .disposicion{
        width: 40vh;
        height: 50vh;
        border: solid #008CBA 2px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .tareasDisposicion{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
    }
    `


    return (
        <>
        <Nav user={props.user}></Nav>
        <Div>
            <div className="disposicion">
            <h2 className="font-link">{empleado?.nombre ?? "cargando"}</h2>
            <p className="font-link">{empleado?.apellido}</p>
            <p className="font-link">{empleado?.telefono}</p>
            <p className="font-link">{empleado?.direccion}</p>
            <p className="font-link">{empleado?.email}</p>
            <p className="font-link">{empleado?.fechaNacimiento}</p>
            </div>
            <div className="disposicion">
            <div className="tareasDisposicion">
            {tareas
                ?.filter(tarea => tarea.FK_empleadoAsignado === empleado.PK_FK_dniEmpleado)
                .map(tarea => <TarjetaTarea tarea={tarea} />)}
            {/* {vacaciones?.map(vacacion => <Vacacion vacacion={vacacion} />)} */}
            </div>
            
            </div>
        </Div>
        </>
    );
}