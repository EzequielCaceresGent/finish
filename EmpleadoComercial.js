import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmpleadoComercial({user}) {
    const [propuestas, setPropuestas] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (user.get() === null) 
            return navigate("/");

        const peticionPropuestas = new XMLHttpRequest();
        peticionPropuestas.open("GET", `http://localhost:4000/api/propuestas`);
        peticionPropuestas.setRequestHeader("Authorization", `Basic ${props.user.get().token}`);
        peticionPropuestas.onload = () => {
            console.log(peticionPropuestas.status);
            const data = JSON.parse(peticionPropuestas.response);
            if (data) 
                setPropuestas(data);
        };
    }, []);

    return (
        <div>
            {propuestas?.map(propuesta => 
                <div>
                    <p>{propuesta.nombrePropuesta}</p>
                    <button onClick={() => navigate(`/propuestas/${propuesta.PK_idPropuesta}`, {state: {propuesta: propuesta}})}>ver detalle</button>
                </div>
            )
            ?? <p>no hay propuestas</p>}
        </div>
    );
}