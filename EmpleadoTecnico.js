import { useEffect, useState } from "react";
import styled from "styled-components";
import Empleado from "./Empleado";
import Tarea from "./Tarea";
import { useNavigate } from "react-router-dom";
import TarjetaTarea from "./TarjetaTarea";
import Nav from "./Nav";

const Main = styled.main`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: row;
    background-color: #31302F ;
    color: white;
    padding-top: 10px;
    width: 100%;
    height: 90vh;
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

    #empleado{
    width: 35vh;
    border: solid #008CBA 2px;
    display: flex;
    border-radius: 5px;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    }
    #proyecto{
        display: flex;
        flex-direction: row;
        padding: 10px;
        border: solid #008CBA 2px;
        border-radius: 5px;
    }
    #p{
        padding: 10px;
    }
    #Carga{
        width: 50%;
        height: 100%;
        display: flex;
        border: solid #008CBA 2px;
        justify-content: center;
        align-items: center;
        
    }
    
    #empleado2{
    width: 30vh;
    height: 10vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
    }
    
`;


const DivEmployee = styled.div`
    display: flex;
    width: 100%;
    height: 100%;

    justify-content: space-between;
    align-items: center;

`;

export default function EmpleadoTecnico({user}) {
    const [employees, setEmployees] = useState(null);
    const [tasks, setTasks] = useState(null);
    const [project, setProject] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const employeeRequest = new XMLHttpRequest();
        // TODO check for null
        employeeRequest.open("GET", `http://localhost:4000/api/proyectos/${user.get().FK_proyectoAsignado}/empleados`);
        employeeRequest.setRequestHeader("Authorization", `Basic ${user.get().token}`);
        employeeRequest.onload = () => {
            const data = JSON.parse(employeeRequest.response);
            if (data) 
                setEmployees(data);
        };
        employeeRequest.send();
        const taskRequest = new XMLHttpRequest();
        taskRequest.open("GET", `http://localhost:4000/api/proyectos/${user.get().FK_proyectoAsignado}/tareas`);
        taskRequest.setRequestHeader("Authorization", `Basic ${user.get().token}`);
        taskRequest.onload = () => {
            const data = JSON.parse(taskRequest.response);
            console.log(data);
            if (data) 
                setTasks(data);
        };
        taskRequest.send();
        const projectRequest = new XMLHttpRequest();
        projectRequest.open("GET", `http://localhost:4000/api/proyectos/${user.get().FK_proyectoAsignado}`);
        projectRequest.setRequestHeader("Authorization", `Basic ${user.get().token}`);
        projectRequest.onload = () => {
            const data = JSON.parse(projectRequest.response);
            console.log(data);
            if (data) 
                setProject(data);
        };
        projectRequest.send();
    }, []);




    



    return (
        <>
        <Nav user={user}></Nav>
        <Main>
            <div id="proyecto">
                <p className="font-link" id="p">Nombre:{project?.nombre}</p>
                <p className="font-link" id="p">Proyecto:{project?.tipo}</p>
                <p className="font-link"id="p">HorasDisp:{project?.horasDisponibles}</p>
                <p className="font-link"id="p">EmpleadosDisp:{project?.empleadosDisponibles}</p>
                <p className="font-link"id="p">Presupuesto:{project?.presupuesto}</p>
            </div>
            <div id="empleado" >
                {tasks?.filter(task => task.completada === 0).map(task => <TarjetaTarea tarea={task} />) 
                ?? <p>No hay tareas pendientes</p>}
            </div>
            <div id="empleado">
                {employees?.map(employee => 
                    <DivEmployee>
                        <h1 className="font-link">{employee.nombre}</h1>
                        <button className="font-link" id="mas"
                         onClick={() => navigate(`/empleados/${employee.PK_FK_dniEmpleado}`, {state: {empleado: employee, tareas: tasks}})}>
                            Ver mas
                        </button>
                        <button className="font-link" id="mas" onClick={() => navigate("/tareas/nueva", {state: {empleado: employee}})}>Agregar tarea</button>
                    </DivEmployee>
                )
                ?? <p className="font-link">No hay empleados en este proyecto</p>}
            </div>
            <div id="empleado2">
                <div id="Carga">
                <button className="font-link" id="mas" onClick={() => navigate("/desvios/nuevo")}>Cargar desvio</button>
                </div>
                <div className="font-link" id="Carga">
                    <button className="font-link"id="mas" onClick={() => navigate("/desvios")}>Ver desvios</button>
                </div>
            </div>
            
        </Main>
        </>
    );
}