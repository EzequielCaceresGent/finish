import { useEffect } from "react";
import styled from "styled-components";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";

export default function NuevoDesvio({user}) {
    const navigate = useNavigate();
    useEffect(() => {
        if (user.get() === null) 
            return navigate("/");
        if (user.get().FK_proyectoAsignado === null) 
            return navigate("/");
    });
    function handleSubmit(event) {
        event.preventDefault();
        const postDetour = new XMLHttpRequest();
        postDetour.open("POST", `http://localhost:4000/api/proyectos/${user.get().FK_proyectoAsignado}/desvios`);
        postDetour.setRequestHeader("Authorization", `Basic ${user.get().token}`);
        postDetour.setRequestHeader('Content-Type', 'application/json');
        postDetour.onload = () => {
            console.log(postDetour.status);
            console.log(postDetour.response);
        };
        postDetour.send(JSON.stringify(Object.fromEntries(new FormData(event.target))));
    }

    const Div=styled.div`
        width: 100%;
        height: 90vh;
        background-color: #31302F;
         #mas{
        background-color: #31302F;
        font-size: 12px;
        -webkit-transition-duration: 0.4s; 
        transition-duration: 1s;
        height: 5vh;
        width: 10vh;
        border: none;
        color: white;
        border-radius: 10px;
       
    }
    #mas:hover {
    background-color: #008CBA; 
    }
    form{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        background-color:#31302F ;
        color: white;
    }
    input{
        width: 7vw;
        box-sizing: border-box;
        padding: 12px 20px;
        margin: 8px 0;
        border: solid #008CBA 2px;
        border-radius: 4px;
        
    }
    .font-link {
    font-family:  'Courier New', Courier, monospace;
  }
    `

    
    return (
        <>
        <Nav user={user} />
        <Div>
        <form onSubmit={handleSubmit}>
            <label className="font-link"  htmlFor="newDeadline">Fecha:</label>
            <input type="date" name="newDeadline" id="newDeadline" />
            <label className="font-link"  htmlFor="hourCost">Costo X Hora:</label>
            <input type="number" name="hourCost" id="hourCost" />
            <label className="font-link"  htmlFor="employeeCost">CostoEmpleado:</label>
            <input type="number" name="employeeCost" id="employeeCost" />
            <label className="font-link"  htmlFor="budgetCost">Presupuesto:</label>
            <input type="number" name="budgetCost" id="budgetCost" />
            <label className="font-link"  htmlFor="detail">Detalles:</label>
            <input type="text" name="detail" id="detail" />
            <label className="font-link"  htmlFor="name">Nombre:</label>
            <input type="text" name="name" id="name" />
            <button className="font-link"  id="mas" type="submit">Subir</button>
        </form>
        </Div>
        </>
    );
}