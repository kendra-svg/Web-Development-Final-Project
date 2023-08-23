async function mostrarNotificaciones() {
    const userEmail = localStorage.getItem("userEmail");

    try {
        const respuestaNotificaciones = await fetch(`http://localhost:3000/notificaciones?correoRecipiente=` + userEmail);
        const notificaciones = await respuestaNotificaciones.json();
        console.log(notificaciones);

        const notificacionesHTML = document.getElementById("seccion-notificaciones");

        let i = 0;
        notificaciones.forEach(function (notificacion) {
            const formattedDate = new Date(notificacion.createdAt).toLocaleString();
            const section = `
                <section class="container1" id="${notificacion._id}">
                    <div class="notification success">
                        <div class="textarea">
                            <p>${formattedDate}</p>
                            <p>${notificacion.titulo}</p>
                            <p class="container2">${notificacion.mensaje}</p>
                            <button type="submit" id="eliminar${i}" >Eliminar</button>
                        </div>     
                    </div>
                </section>
                `;
            notificacionesHTML.innerHTML += section;
            i += 1;
        });

        notificacionesHTML.addEventListener("click", function (evento) {
            botonEliminar(evento, notificaciones);
        });

    } catch (error) {
        console.log("Error:", error);
        alert("Error al cargar las notificaciones");
    }
}

async function botonEliminar(evento, notificaciones) {
    if (evento.target.tagName === "BUTTON" && evento.target.id.startsWith("eliminar")) {
        const button = evento.target;
        const buttonIndex = Number(button.id.replace("eliminar", ""));
        const notificacion = notificaciones[buttonIndex];
        const notificacionId = notificacion._id;

        // Display a confirmation dialog before deleting the notification
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar la notificación?");

        if (confirmDelete) {
            try {
                const respuesta = await fetch(`http://localhost:3000/notificaciones/${notificacionId}`, {
                    method: "DELETE",
                });

                if (respuesta.ok) {
                    const notificacionEliminada = await respuesta.json();
                    console.log(notificacionEliminada);
                    alert("Notificación eliminada exitosamente");
                    location.reload();
                } else {
                    alert("Error al eliminar la notificación");
                }
            } catch (error) {
                console.log("Error:", error);
                alert("Error al eliminar la notificación");
            }
        }
    }
}

window.onload = function () {
    mostrarNotificaciones();
}