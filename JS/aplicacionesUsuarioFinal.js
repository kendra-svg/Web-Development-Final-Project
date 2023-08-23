async function cargarAplicaciones() {
    const userEmail = localStorage.getItem("userEmail");

    try {
        const respuestaAplicaciones = await fetch(`http://localhost:3000/aplicacionesUsuarioFinal?correoAplicante=` + userEmail);
        const aplicaciones = await respuestaAplicaciones.json();
        console.log(aplicaciones);

        const aplicacionesHTML = document.getElementById("aplicaciones-usuario");

        let i = 0;
        aplicaciones.forEach(function (aplicacion) {
            const formattedDate = new Date(aplicacion.createdAt).toLocaleString();
            const section = `
                <section class="seccion-aplicaciones" id="${aplicacion._id}">
                    <div class="notification">
                        <div class="textarea">
                            <h1 class="textarea">
                                <span class="icon">&#10132;</span> ${aplicacion.nombrePuesto}
                            </h1>
                            <div class="container2">
                                <h3>Día de Postulación: ${formattedDate}</h3>
                                <h3>Estado: ${aplicacion.estadoAplicacion}</h3>
                                <h3>Requisitos Mínimos</h3>
                                <p>${aplicacion.requisitosMinimos}</p>
                                <h3>Requisitos Deseados</h3>
                                <p>${aplicacion.requisitosDeseados}</p>
                            </div>
                            <div class="boton2">
                                <button type="submit" id="eliminar${i}">Retirar postulación</button>
                            </div>
                        </div>
                    </div>
                </section>
                `;
            aplicacionesHTML.innerHTML += section;
            i += 1;
        });

        aplicacionesHTML.addEventListener("click", function (evento) {
            botonEliminar(evento, aplicaciones);
        });

    } catch (error) {
        console.log("Error:", error);
        alert("Error al cargar las aplicaciones");
    }
}

async function botonEliminar(evento, aplicaciones) {
    if (evento.target.tagName === "BUTTON" && evento.target.id.startsWith("eliminar")) {
        const button = evento.target;
        const buttonIndex = Number(button.id.replace("eliminar", ""));
        const aplicacion = aplicaciones[buttonIndex];
        const aplicacionId = aplicacion._id;

        // Display a confirmation dialog before deleting the application
        const confirmDelete = confirm("¿Estás seguro de que deseas retirar la postulación?");

        if (confirmDelete) {
            try {
                const respuesta = await fetch(`http://localhost:3000/aplicacionesUsuarioFinal/${aplicacionId}`, {
                    method: "DELETE",
                });
                const data = await respuesta.json();
                console.log(data);
                alert("Se ha retirado la postulación");

                if (respuesta) {
                    const notificacionData = {
                        correoRecipiente: aplicacion.correoAplicante,
                        titulo: "Postulación Retirada",
                        mensaje: `Se ha retirado la postulación al puesto "${aplicacion.nombrePuesto}".`,
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
                    alert("Error al retirar la postulación");
                }
            } catch (error) {
                console.log("Error:", error);
                alert("Error al retirar la postulación");
            }
        } else {
            // User clicked "Cancel," do nothing or show a message
            alert("Cancelaste la acción de retirar la postulación.");
        }
    }
}


window.onload = function () {
    cargarAplicaciones();
}


