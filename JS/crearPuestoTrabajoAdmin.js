async function rangosSalarialesDropdown() {
    try {
      const respuestaRangosSalariales = await fetch("http://localhost:3000/rangosSalariales");
      const rangosSalariales = await respuestaRangosSalariales.json();
      console.log(rangosSalariales);
  
      const rangosSalarialesHTML = document.getElementById("rango-salarial");
  
      rangosSalariales.forEach(function (rangoSalarial) {
        const option = `<option value="${rangoSalarial.id}">${rangoSalarial.rangoSalarial}</option>`;
        rangosSalarialesHTML.innerHTML += option;
      });
    } catch (error) {
      console.log("Error:", error);
      alert("Error al cargar los rangos salariales");
    }
};

async function crearPuestoTrabajo(evento) {
    evento.preventDefault();

    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    const empresa = userName;
    const titulo = document.getElementById("nombre").value;
    const visibilidad = document.getElementById("visibilidad").value;
    const rangoSalarialID = document.getElementById("rango-salarial").value;
    const rangoSalarial = document.getElementById("rango-salarial").options[document.getElementById("rango-salarial").selectedIndex].text;
    const requisitosMinimos = document.getElementById("requisitosMinimos").value;
    const requisitosDeseados = document.getElementById("requisitosDeseados").value;
    const correoGerente = userEmail;

    const puestoTrabajo = {
        empresa,
        titulo,
        visibilidad,
        rangoSalarialID,
        rangoSalarial,
        requisitosMinimos,
        requisitosDeseados,
        correoGerente,
    };

    const confirmacion = confirm("¿Estás seguro de que deseas crear el puesto de trabajo?");

    if (confirmacion) {
        try {
            const respuestaCrearPuestoTrabajo = await fetch("http://localhost:3000/empleos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(puestoTrabajo),
            });

            const puestoTrabajoCreado = await respuestaCrearPuestoTrabajo.json();
            console.log(puestoTrabajoCreado);

            if (puestoTrabajoCreado) {
                alert("Puesto de trabajo creado exitosamente");

                const notificacionData = {
                    correoRecipiente: puestoTrabajo.correoGerente,
                    titulo: "Nuevo puesto de trabajo",
                    mensaje: "Se ha creado el puesto de trabajo '" + puestoTrabajo.titulo +"'.",
                };

                await fetch("http://localhost:3000/notificaciones", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(notificacionData),
                });

                window.location.href = "administrarPuestosAdmin.html";
            } else {
                alert("Error al crear el puesto de trabajo");
            }
        } catch (error) {
            console.log("Error:", error);
            alert("Error al crear el puesto de trabajo");
        }
    } else {
        alert("Se canceló la creación del puesto de trabajo");
    }
};



window.onload = function () {
    rangosSalarialesDropdown();
    
    let form = document.getElementById("crearPuestoForm");
    form.addEventListener("submit", crearPuestoTrabajo)   
};