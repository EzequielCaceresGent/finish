import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import Nav from "./Nav";

export default function Desvios({user}) {
    const navigate = useNavigate();
    const [desvios, setDesvios] = useState(null);
    useEffect(() => {
        if (user.get() === null) 
            return navigate("/");
        const peticionDesvios = new XMLHttpRequest();
        peticionDesvios.open("GET", `http://localhost:4000/api/proyectos/${user.get().FK_proyectoAsignado}/desvios`);
        peticionDesvios.setRequestHeader("Authorization", `Basic ${user.get().token}`);
        peticionDesvios.onload = () => {
            console.log(peticionDesvios.status);
            const data = JSON.parse(peticionDesvios.response);
            if (data) 
                setDesvios(data);
        };
        peticionDesvios.send();
    }, []);
    const Div=styled.div`
        width: 100%;
        height: 90vh;
        background-color:  #31302F;
        color: white;
        display: flex;
        justify-content: center;
        flex-direction: column;
        .padre{
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: center;
            flex-direction: row;
            margin-top:10px ;
        }
        .hijo{
            display: flex;
            width: 30vh;
            height: auto;
            flex-direction:  column;
            border: solid #008CBA 2px;
            border-radius: 10px;     
            align-items:center;   
            padding: 10px;
        }
        p{
        margin: 0%;
       }
       #mas{
        background-color: #31302F;
        font-size: 12px;
        -webkit-transition-duration: 0.4s; 
        transition-duration: 1s;
        height: 5vh;
        border: none;
        color: white;
        border-radius: 10px;
       
    }
    #mas:hover {
    background-color: #008CBA; 
    }
    .font-link {
        font-family:  'Courier New', Courier, monospace;     
        }
    `
    return (

        <>
        <Nav user={user}></Nav>
        <Div>
            {desvios?.map(desvio =>
                <div className="padre">
                    <div className="hijo">
                        <h2 className="font-link">Nombre de desvio:</h2>
                    <p className="font-link">{desvio.nombreDesvio}</p>
                    <button className="font-link" id="mas" onClick={() => navigate(`/desvios/${desvio.PK_idDesvio}`, {state: {desvio:desvio}})}>Ver mas</button>
                    </div>
                </div>
            )
            ?? <p>no hay desvios</p>}
        </Div>
        </>
    );
}