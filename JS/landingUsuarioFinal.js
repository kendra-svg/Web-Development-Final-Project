// HTML
async function puestosRecientes() {
    try {
        const respuestaEmpleos = await fetch("http://localhost:3000/empleosLanding");
        const empleos = await respuestaEmpleos.json();
        console.log(empleos);

        const empleosHTML = document.getElementById("lista-empleos"); 

        empleos.forEach(function (empleo) {
            const div = 
            `
            <div class="puesto">
                <p>${empleo.empresa}</p>
                <p>${empleo.titulo}</p>
                <p>${empleo.rangoSalarial}</p>
            </div>
            `;
            empleosHTML.innerHTML += div;
        });
    } catch (error) {
        console.log("Error:", error);
        alert("Error al cargar los empleos");
    }
};

async function empresasOverview() {
    try {
        const respuestaEmpresas = await fetch("http://localhost:3000/nombreEmpresasLanginUsuarios");
        const empresas = await respuestaEmpresas.json();
        console.log(empresas);

        const empresasHTML = document.getElementById("lista-empresas");
        empresas.forEach(function (empresa) {
            const div = 
            `
            <div class="empresa">
                <p>${empresa.nombre}</p>
            </div>
            `;
            empresasHTML.innerHTML += div;
        });
    } catch (error) {
        console.log("Error:", error);
        alert("Error al cargar las empresas");
    }
};

window.onload = function (){
    puestosRecientes();
    empresasOverview();
};

