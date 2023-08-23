async function mostrarEmpleosEmpresa() {
    const userName = localStorage.getItem("userName");
    console.log(userName);

    try {
        const respuestaPuestosEmpresa = await fetch("http://localhost:3000/empleosAdmin?empresa=" + userName);
        const puestosEmpresa = await respuestaPuestosEmpresa.json();
        console.log(puestosEmpresa);

        let i = 0;
        const empleosHTML = document.getElementById("empleos-publicados");
        puestosEmpresa.forEach(function (puestoEmpresa) {
            const section = 
            `
            <section class="seccion-puestos">
                <div>
                    <div>
                        <h3>${puestoEmpresa.titulo}</h3>
                        <h4>${puestoEmpresa.rangoSalarial}</h4>
                        <h4>${puestoEmpresa.empresa}</h4>
                    </div>
                    <div class="informacion-puesto">
                        <h4>Visibilidad: ${puestoEmpresa.visibilidad}</h4>
                        <h4>Requisitos Mínimos</h4>
                        <p>${puestoEmpresa.requisitosMinimos}</p>
                        <h4>Requisitos Deseados</h4>
                        <p>${puestoEmpresa.requisitosDeseados}</p>
                    </div>
                    <div class="container-botones-admin">
                        <button class="btn-admin-puesto" onclick="editarPuesto('${puestoEmpresa._id}')">Editar</button>
                        <button class="btn-admin-puesto" type="submit" id="eliminar${i}">Eliminar</button>
                    </div>
                </div>
            <div class="botones-puestos">
            `;
            empleosHTML.innerHTML += section;
            i += 1;
        });

        empleosHTML.addEventListener("click", function (evento) {
            botonEliminar(evento, puestosEmpresa);
        });

    } catch (error) {
        console.log("Error:", error);
        alert("Error al cargar los puestos");
    }
};

async function botonEliminar(evento, puestosEmpresa) {
    if (evento.target.tagName === "BUTTON" && evento.target.id.startsWith("eliminar")) {
        const button = evento.target;
        const buttonIndex = Number(button.id.replace("eliminar", ""));
        const puestoEmpresa = puestosEmpresa[buttonIndex];
        const puestoEmpresaId = puestoEmpresa._id;

        // Display a confirmation dialog before deleting the job
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar el puesto?");

        if (confirmDelete) {
            try {
                const respuesta = await fetch("http://localhost:3000/empleosAdmin/" + puestoEmpresaId, {
                    method: "DELETE",
                });

                const datosRespuesta = await respuesta.json();
                console.log(datosRespuesta);

                if (datosRespuesta) {
                    alert("Puesto eliminado exitosamente");

                    const notificacionData = {
                        correoRecipiente: puestoEmpresa.correoGerenete,
                        titulo: "Puesto de trabajo eliminado",
                        mensaje: "Se ha eliminado el puesto de trabajo '" + puestoEmpresa.titulo + "'.",
                    };

                    await fetch("http://localhost:3000/notificaciones", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(notificacionData),
                    });

                    window.location.reload();
                } else {
                    alert("Error al eliminar el puesto");
                }
            } catch (error) {
                console.log("Error:", error);
            }
        } else {
            alert("Cancelaste la acción de eliminar el puesto.");
        }
    }
}

async function editarPuesto(puestoId) {
    localStorage.setItem("puestoId", puestoId);
    window.location.href = "editarPuestoTrabajoAdmin.html";
}

window.onload = function () {
    mostrarEmpleosEmpresa();
};