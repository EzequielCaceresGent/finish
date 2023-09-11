import { useEffect, useState } from "react";
import styled from 'styled-components';
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "./Nav";

export default function NuevaTarea({user}) {
    const {state} = useLocation();
    const navigate = useNavigate();
    const [empleado, setEmpleado] = useState(state?.empleado);
    useEffect(() => {
        if (user.get() === null) 
            return navigate("/");
        if (user.get().FK_proyectoAsignado === null) 
            return navigate("/");
    });
    function handleSubmit(event) {
        event.preventDefault();
        const peticionSubirTarea = new XMLHttpRequest();
        peticionSubirTarea.open("POST", `http://localhost:4000/api/empleados/${empleado.PK_FK_dniEmpleado}/tareas`);
        peticionSubirTarea.setRequestHeader("Authorization", `Basic ${user.get().token}`);
        peticionSubirTarea.setRequestHeader('Content-Type', 'application/json');
        peticionSubirTarea.onload = () => {
            console.log(peticionSubirTarea.status);
            console.log(peticionSubirTarea.response);
        };
        peticionSubirTarea.send(JSON.stringify(Object.fromEntries(new FormData(event.target))));
    }
    const Div=styled.div`
        width: 100%;
        height: 90vh;
        background-color:  #31302F;
        color: white;
        .font-link {
        font-family:  'Courier New', Courier, monospace;     
        }  
        #mas{
        background-color: #31302F;
        font-size: 12px;
        -webkit-transition-duration: 0.4s; 
        transition-duration: 1s;
        height: 5vh;
        border: none;
        padding: 10px;
        margin: 10px;
        border-radius: 10px;
        color: white;
        
    }
    #mas:hover {
    background-color: #008CBA; 
    }   
    input{
        width: 7vw;
        box-sizing: border-box;
        padding: 12px 20px;
        margin: 8px 0;
        border: solid #008CBA 2px;
        border-radius: 4px;
        
    }    
    form{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        background-color:#31302F ;
        color: white;
    } 
    `
    return (
        <>
        <Nav user={user}></Nav>
        <Div>
        <form onSubmit={handleSubmit}>
            <label className="font-link" htmlFor="name">Nombre:</label>
            <input type="text" name="name" id="name" />
            <label className="font-link" htmlFor="hours">Horas:</label>
            <input type="number" name="hours" id="hours" />
            <label className="font-link" htmlFor="description">Descripcion:</label>
            <input type="text" name="description" id="description" />
            <button id="mas" className="font-link" type="submit">Subir</button>
        </form>
        </Div>
        </>
    );
}