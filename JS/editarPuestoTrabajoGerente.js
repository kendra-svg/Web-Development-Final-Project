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

const puestoId = localStorage.getItem("puestoId");

async function infoPuestoEditar() {

  try {
    const respuestaPuesto = await fetch("http://localhost:3000/empleosGerente/" + puestoId);
    const puesto = await respuestaPuesto.json();
    console.log(puesto);

    document.getElementById("nombre").value = puesto.titulo;
    document.getElementById("visibilidad").value = puesto.visibilidad;
    document.getElementById("rango-salarial").value = puesto.rangoSalarialID;
    document.getElementById("requisitosMinimos").value = puesto.requisitosMinimos;
    document.getElementById("requisitosDeseados").value = puesto.requisitosDeseados;

  } catch (error) {
    console.log("Error:", error);
    alert("Error al cargar el puesto");
  } 
};

async function editarPuesto(evento) {
    evento.preventDefault();
    const puestoTrabajo = {
        empresa: localStorage.getItem("empresa"),
        titulo: document.getElementById("nombre").value,
        visibilidad: document.getElementById("visibilidad").value,
        rangoSalarialID: document.getElementById("rango-salarial").value,
        rangoSalarial: document.getElementById("rango-salarial").options[document.getElementById("rango-salarial").selectedIndex].text,
        requisitosMinimos: document.getElementById("requisitosMinimos").value,
        requisitosDeseados: document.getElementById("requisitosDeseados").value,
        correoGerente: localStorage.getItem("userEmail"),
    };

    const confirmacion = confirm("¿Estás seguro de que deseas editar el puesto de trabajo?");

    if (confirmacion) {
        try {
            const respuestaEditarPuestoTrabajo = await fetch("http://localhost:3000/empleosGerente/" + puestoId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(puestoTrabajo),
            });

            const puestoTrabajoEditado = await respuestaEditarPuestoTrabajo.json();
            console.log(puestoTrabajoEditado);

            if (puestoTrabajoEditado) {
                alert("Puesto de trabajo editado exitosamente");

                const notificacionData = {
                  correoRecipiente: puestoTrabajo.correoGerente,
                  titulo: "Puesto de trabajo editado",
                  mensaje: "Se ha editado el puesto de trabajo '" + puestoTrabajo.titulo +"'.",
                };

                await fetch("http://localhost:3000/notificaciones", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(notificacionData),
                });

                window.location.href = "administrarPuestosGerente.html";
            } else {
                alert("Error al editar el puesto de trabajo");
            }
        } catch (error) {
            console.log("Error:", error);
            alert("Error al editar el puesto de trabajo");
        }
    } else {
        alert("Se canceló la edición del puesto de trabajo");
    } 
};


window.onload = function () {
    rangosSalarialesDropdown();
    infoPuestoEditar();

    let form = document.getElementById("editarPuestoForm");
    form.addEventListener("submit", editarPuesto);
};