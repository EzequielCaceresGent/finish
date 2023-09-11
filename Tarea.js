import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Nav from "./Nav";
const Div = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
    height: 90vh;
    background-color: #31302F;
    color: white;


    .font-link {
    font-family:  'Courier New', Courier, monospace;
  }
    .tarea{
        width: 35vh;
        height: 35vh;
        margin-top: 10px;
        display: flex;
        align-items: center;
        flex-direction: column;
        border: solid #008CBA 2px;
        border-radius: 10px;
    }
    h2{
        text-decoration: underline;
    }
   
    `;
export default function Tarea(props) {
    const navigate = useNavigate();
    const {state} = useLocation();
    const [tarea, setTarea] = useState(props.tarea ?? state.tarea);
    const {id} = useParams();
    // useEffect(() => {
    //     if (props.user === undefined) 
    //         return navigate("/");
    //     if (tarea !== undefined) 
    //         return;
    //     const peticionTarea = new XMLHttpRequest();
    //     peticionTarea.open("GET", `http://localhost:4000/api/empleados/${id}`);
    //     peticionTarea.setRequestHeader("Authorization", `Basic ${props.user?.get().token}`);
    //     peticionTarea.onload = () => {
    //         console.log(peticionTarea.status);
    //         const data = JSON.parse(peticionTarea.response);
    //         if (data) 
    //             setEmpleado(data);
    //     };
    // }, []);
    return (
        <>
        <Nav user={props.user}></Nav>
        <Div>
            <div className="tarea">
            <h2 className="font-link">Tarea a completar:</h2>
            <p  className="font-link">{tarea?.nombreTarea}</p>
            </div>
            
            <div className="tarea">
            <h2 className="font-link">Descripcion:</h2>
            <p className="font-link">{tarea?.descripcion}</p>
            </div>
            
        </Div>
        </>
    );
}