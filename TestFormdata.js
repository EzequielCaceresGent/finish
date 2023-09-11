function handleSubmit1(event) {
    event.preventDefault();
    const request = new XMLHttpRequest();
    request.open("PATCH", "http://localhost:4000/api/propuestas/2");
    request.setRequestHeader("Authorization", "Basic dGVjbmljYTp0ZWNuaWNh");
    request.onload = (progress) => {
        console.log(request.status);
        console.log(request.response);
    };
    request.send(new FormData(event.target));

}

function handleSubmit2(event) {
    event.preventDefault();
    const request = new XMLHttpRequest();
    request.open("POST", "http://localhost:4000/api/proyectos");
    request.setRequestHeader("Authorization", "Basic YnJ1aDpicnVo");
    request.onload = (progress) => {
        console.log(request.status);
        console.log(request.response);
    };
    request.send(new FormData(event.target));

}
export default function TestFormdata() {
    return (
        <>
            <form onSubmit={handleSubmit1} method="patch" encType="multipart/form-data">
                <input type="file" name="technicalProposal" accept=".pdf" />
                <button type="submit">submit</button>
            </form>
            <form onSubmit={handleSubmit2} method="patch" encType="multipart/form-data">
                <label htmlFor="associatedProposal">associatedProposal</label>
                <input type="number" name="associatedProposal" id="associatedProposal" />
                <input type="file" name="roadmap" accept=".pdf" />
                <input type="date" name="deadline" id="" />
                <input type="date" name="startDate" id="" />
                <input type="text" name="name" id="" />
                <input type="number" name="availableHours" id="" />
                <input type="number" name="availableEmployees" id="" />
                <input type="number" name="budget" id="" />
                <select name="type">
                    <option value="Proyecto">Proyecto</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                </select>
                <button type="submit">submit</button>
            </form>
        </>
    );
}