/*INICIO INVITAR EMPLEADO*/
async function enviarInvitacion() {
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
    const empresa = localStorage.getItem("userName");
    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const genero = document.getElementById("genero").value;
    const rol = document.getElementById("rol").value;

    const datosInvitacion = {
        correo: correo,
        contrasena: contrasena,
        empresa: empresa,
        nombre: nombre,
        apellidos: apellidos,
        genero: genero,
        rol: rol
    };

    const confirmInvite = confirm("¿Estás seguro de que deseas enviar la invitación?");

    if (confirmInvite) {
        try {
            console.log("Datos enviados", datosInvitacion);
            const respuesta = await fetch(`http://localhost:3000/administrarEmpleados`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosInvitacion),

            });
            const exitoso = await respuesta.json();
            console.log(exitoso);


            alert("Invitación enviada con éxito");
            window.location.href = "/HTML/administrarEmpleados.html";
        } catch (error) {
            console.log("Error:", error);
            alert("Error al enviar la invitación");
        }
    } else {
        alert("Cancelaste la acción de enviar la invitación.");
    }    
}

/*FIN DE INVITAR EMPLEADO*/


/*INICIO DE EDITAR EMPLEADO*/ 
async function correoEditarPerfilEmpleado() {
    const userName = localStorage.getItem("userName");
    console.log(userName);

    try {
        console.log("correoEditarPerfilEmpleado");
        const respuestaCorreo = await fetch(`http://localhost:3000/administrarEmpleados?empresa=${userName}`);
        const correos = await respuestaCorreo.json();
        console.log(correos);

        const correosHTML = document.getElementById("editarPerfilDropDown");
        correos.forEach(function (correo) {
            const option = document.createElement("option");
            option.value = correo.correo; // Set the value for the option
            option.textContent = correo.correo; // Set the visible text for the option
            correosHTML.appendChild(option);
        });

        correosHTML.addEventListener("change", function () {
            const selectedCorreo = correosHTML.value;
            cargarDatosPerfilColaboradorEditar(selectedCorreo);
        });


    } catch (error) {
        console.log("Error:", error);
        alert("Error al cargar los correos");
    }
}

async function cargarDatosPerfilColaboradorEditar(correo) {
    try {
        console.log("cargarDatosPerfilColaborador");
        const respuesta = await fetch(`http://localhost:3000/datosPerfilColaborador?correo=${correo}`);
        const colaborador = await respuesta.json();
        console.log(colaborador);

        correoHTML = document.getElementById("editarPerfilDropDown");
        document.getElementById("rolActualEditar").value = colaborador.rol; // Populate role input

    } catch (error) {
        console.log("Error:", error);
        alert("Error al cargar los datos del colaborador");
    }


    correoHTML.addEventListener("change", function () {
        const selectedCorreo = correoHTML.value;
        cargarDatosPerfilColaborador(selectedCorreo);
    });
}

async function editarPerfilEmpleado() {
    const correo = document.getElementById("editarPerfilDropDown").value;
    const rol = document.getElementById("editarRol").value;

    const datos = {
        editarPerfilDropdown: correo,
        editarRol: rol
    };

    const confirmEdit = confirm("¿Estás seguro de que deseas editar el perfil?");

    if (confirmEdit) {
        try {
            console.log("Datos enviados", datos);
            const respuesta = await fetch(`http://localhost:3000/administrarEmpleados/${correo}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos),
            });
            const exitoso = await respuesta.json();
            console.log(exitoso);
            alert("Perfil editado con éxito");
            window.location.href = "/HTML/administrarEmpleados.html";
        } catch (error) {
            console.log("Error:", error);
            alert("Error al editar el perfil");
        }
    } else {
        alert("Cancelaste la acción de editar el perfil.");
    }
}

/*FIN DE EDITAR EMPLEADO*/


/*INICIO ELIMINAR EMPLEADO*/
async function cargarDatosPerfilColaborador(correo) {
    try {
        console.log("cargarDatosPerfilColaborador");
        const respuesta = await fetch(`http://localhost:3000/datosPerfilColaborador?correo=${correo}`);
        const colaborador = await respuesta.json();
        console.log(colaborador);

        document.getElementById("nombreEliminar").value = colaborador.nombre; // Populate name input
        document.getElementById("rolEliminar").value = colaborador.rol; // Populate role input
        document.getElementById("apellidosEliminar").value = colaborador.apellidos; // Populate last name input
    } catch (error) {
        console.log("Error:", error);
        alert("Error al cargar los datos del colaborador");
    }
}

async function mostrarCorreoEliminarPerfilEmpleado() {
    const userName = localStorage.getItem("userName");
    try {
        console.log("correoEliminarPerfilEmpleado");
        const respuestaCorreo = await fetch(`http://localhost:3000/administrarEmpleados?empresa=${userName}`);
        const correos = await respuestaCorreo.json();
        console.log(correos);

        const correosHTML = document.getElementById("eliminarPerfilDropDown");
        correos.forEach(function (correo) {
            const option = document.createElement("option");
            option.value = correo.correo; // Set the value for the option
            option.textContent = correo.correo; // Set the visible text for the option
            correosHTML.appendChild(option);
        });

        correosHTML.addEventListener("change", function () {
            const selectedCorreo = correosHTML.value;
            cargarDatosPerfilColaborador(selectedCorreo);
        });

    } catch (error) {
        console.log("Error:", error);
        alert("Error al cargar los correos");
    }
}

async function eliminarPerfilEmpleado() {
    const correo = document.getElementById("eliminarPerfilDropDown").value;

    const dato = {
        eliminarPerfilDropDown: correo
    }

    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar el perfil?");

    if (confirmDelete) {
        try {
            console.log("Dato enviado", dato);
            const respuesta = await fetch(`http://localhost:3000/administrarEmpleados/${correo}`, {
                method: "DELETE",
            });


            console.log("Respuesta:", respuesta);
            const exitoso = await respuesta.json();
            console.log(exitoso);
            alert("Perfil eliminado con éxito");
            window.location.href = "/HTML/administrarEmpleados.html";
        } catch (error) {
            console.log("Error:", error);
            alert("Error al eliminar el perfil");
        }
    } else {
        alert("Cancelaste la acción de eliminar el perfil.");
    }
    
}
/*FIN ELIMINAR EMPLEADO*/

window.onload = function () {
    correoEditarPerfilEmpleado();
    mostrarCorreoEliminarPerfilEmpleado();

    const guardarCambiosButton = document.getElementById("editarCambios");
    guardarCambiosButton.addEventListener("click", editarPerfilEmpleado);
    const eliminarPerfilButton = document.getElementById("eliminarPerfil");
    eliminarPerfilButton.addEventListener("click", eliminarPerfilEmpleado);
    const invitarEmpleadosButton = document.getElementById("btnEnviarInvitacion");
    invitarEmpleadosButton.addEventListener("click", enviarInvitacion);
}



