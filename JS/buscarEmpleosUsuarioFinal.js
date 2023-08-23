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

async function empresasDropdown() {
  try {
    const respuestaEmpresas = await fetch("http://localhost:3000/nombreEmpresasBuscarEmpleos");
    const empresas = await respuestaEmpresas.json();
    console.log(empresas);

    const empresasHTML = document.getElementById("nombre");
    empresas.forEach(function (empresa) {
      const option = `<option value="${empresa.nombre}">${empresa.nombre}</option>`;
      empresasHTML.innerHTML += option;
    });
  } catch (error) {
    console.log("Error:", error);
    alert("Error al cargar las empresas");
  }
};

let infoEmpleoArray;

// Cambio HTML para que se muestren los empleos con ejemplo de DIV
async function empleosOverview(nombreEmpresa, rangoSalarialID) {
  try {

    let url = "http://localhost:3000/empleosOverview?";
    if (nombreEmpresa) {
      url += `nombreEmpresa=${nombreEmpresa}&`;
      console.log(url);
    }
    if (rangoSalarialID) {
      url += `rangoSalarialID=${rangoSalarialID}&`;
      console.log(url);
    }

    const respuestaEmpleos = await fetch(url);
    const empleos = await respuestaEmpleos.json();
    console.log(empleos);

    infoEmpleoArray = empleos.map((empleo) => {
      return {
        jobId: empleo._id,
        nombrePuesto: empleo.titulo,
        requisitosMinimos: empleo.requisitosMinimos,
        requisitosDeseados: empleo.requisitosDeseados,
        empresa: empleo.empresa,
      };
    });

    const empleosHTML = document.getElementById("puestos-overview");
    let i = 0;
    empleos.forEach(function (empleo) {
      const div = `
            <div class="seccion-puestos" id="puesto${i}">
                <h2>${empleo.titulo}</h2>
                <h3>Rango Salarial: ${empleo.rangoSalarial}</h3>
                <h3>Empresa: ${empleo.empresa}</h3>
                <div class="seccion-puesto-info">
                    <h4>Requisitos Mínimos</h4>
                    <p>${empleo.requisitosMinimos}</p>
                    <h4>Requisitos Deseados</h4>
                    <p>${empleo.requisitosDeseados}</p>
                </div>
                <div class="seccion-aplicar-boton">
                    <button type="click" data-job-index="${i}" id="aplicar${i}">Aplicar</button>
                </div>
            </div>
            `;
      empleosHTML.innerHTML += div;

      const botonAplicarEmpleosHTML = document.getElementById(`aplicar${i}`);
      
      botonAplicarEmpleosHTML.addEventListener("click", function (evento) {
        botonAplicar(evento, infoEmpleoArray);
        console.log("Boton aplicar");
      });

      i += 1;
    });

    

  } catch (error) {
    console.log("Error:", error);
    alert("Error al cargar los empleos");
  }
};

async function botonAplicar(evento) {
  if (evento.target.tagName === "BUTTON" && evento.target.id.startsWith("aplicar")) {
    const button = evento.target;
    const jobIndex = button.getAttribute("data-job-index");

    const infoEmpleo = infoEmpleoArray[jobIndex];
    console.log(infoEmpleo);

    const datosAplicacion = {
      nombrePuesto: infoEmpleo.nombrePuesto,
      nombreAplicante: localStorage.getItem("userName"),
      correoAplicante: localStorage.getItem("userEmail"),
      estadoAplicacion: "Enviada",
      requisitosMinimos: infoEmpleo.requisitosMinimos,
      requisitosDeseados: infoEmpleo.requisitosDeseados,
      empresa: infoEmpleo.empresa,
      cvAplicante: localStorage.getItem("userCV"),
    };

    console.log(datosAplicacion);

    // Display a confirmation dialog before sending the application
    const confirmApply = confirm("¿Estás seguro de que deseas aplicar para este trabajo?");

    if (confirmApply) {
      try {
        const respuesta = await fetch("http://localhost:3000/aplicacionesUsuarioFinal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosAplicacion),
        });

        if (respuesta.ok) {
          const aplicacionGuardada = await respuesta.json();
          console.log(aplicacionGuardada);
          alert("Aplicación enviada exitosamente");

          // Post to "notificaciones" endpoint with relevant information
          const notificacionData = {
            correoRecipiente: datosAplicacion.correoAplicante,
            titulo: "Nueva Aplicación",
            mensaje: `Se ha aplicado al puesto "${datosAplicacion.nombrePuesto}" exitosamente.`,
          };

          await fetch("http://localhost:3000/notificaciones", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificacionData),
          });

        } else {
          alert("Error al enviar la aplicación");
        }
      } catch (error) {
        console.log("Error:", error);
        alert("Error al enviar la aplicación");
      }
    } else {
      // User clicked "Cancel," do nothing or show a message
      alert("Cancelaste la acción de aplicar para este trabajo.");
    }
  }
};




window.onload = function () {

  rangosSalarialesDropdown();
  empresasDropdown();
  empleosOverview();

  const filtrarButton = document.getElementById("filtrar");
  filtrarButton.addEventListener("click", async function (evento) {
    evento.preventDefault();
    
    const nombreEmpresa = document.getElementById("nombre").value;
    const rangoSalarialID = document.getElementById("rango-salarial").value;

    const empleosHTML = document.getElementById("puestos-overview");
    empleosHTML.innerHTML = "";

    empleosHTML.removeEventListener("click", botonAplicar);

    empleosOverview(nombreEmpresa, rangoSalarialID);
  });

};