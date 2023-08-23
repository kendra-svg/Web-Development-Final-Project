async function cargarFoto() {
    const buttonElement = document.getElementById("botonFoto");
    const imgElement = document.getElementById("fotoUsuario");


    let myWidget = cloudinary.createUploadWidget(
        {
            cloudName: "dobj7jqwu",
            uploadPreset: "preset.Rom",
            clientAllowedFormats: ["jpg", "png", "jpeg"],
            maxFileSize: 3000000,
        },
        (error, result) => {

            if (!error && result && result.event === "success") {
                imgElement.src = result.info.secure_url;
                localStorage.setItem("fotoPerfil", imgElement.src);
                console.log(imgElement.src);
                console.log("Done! Here is the image info: ", result.info);
            }
        }
    );

    buttonElement.addEventListener(
        "click",
        function () {
            myWidget.open();
        },
        false
    );

};

async function cargarCV() {
    const buttonElement = document.getElementById("botoncv");
    const iframeElement = document.getElementById("vistaPDF");

    let myWidget = cloudinary.createUploadWidget(
        {
            cloudName: "dobj7jqwu",
            uploadPreset: "preset.Rom",
            clientAllowedFormats: ["pdf"],
            maxFileSize: 3000000,
        },
        (error, result) => {
            if (error) {
                console.error("Error uploading file:", error);
            } else if (result && result.event === "success") {
                localStorage.setItem("cv", result.info.secure_url);
                console.log("Done! Here is the PDF info:", result.info);
                alert("El archivo se ha subido correctamente");
            }
        }
    );

    buttonElement.addEventListener(
        "click",
        function () {
            myWidget.open();
        },
        false
    );

};

async function crearCuentaUsuarioFinal(evento) {
    evento.preventDefault();

    var nombre = document.getElementById('nombre').value;
    var apellidos = document.getElementById('apellido').value;
    var genero = document.getElementById('opcionesGenero').value;
    var correo = document.getElementById('email').value;
    var clave = document.getElementById('clave').value;
    var confirmarClave = document.getElementById('confirmarClave').value;

    var centroEducativo = document.getElementById("centroEducativo").value;
    var nivelEducativo = document.getElementById("gradoAcademico").value;
    var fechaInicioAcademica = document.getElementById("fechaInicioAcademica").value;
    var fechaFinalAcademica = document.getElementById("fechaFinalAcademica").value;

    var empresa = document.getElementById("empresa").value;
    var tituloEmpresa = document.getElementById("tituloEmpresa").value;
    var fechaInicioLaboral = document.getElementById("fechaInicioLaboral").value;
    var fechaFinalizacionLaboral = document.getElementById("fechaFinalizacionLaboral").value;
    var descripcionRol = document.getElementById("descripcionRol").value;
    var fotoPerfil = localStorage.getItem("fotoPerfil");
    var cv = localStorage.getItem("cv");
    console.log(fotoPerfil);
    console.log(cv);

    var fechaActual = new Date();
    var fechaInicioElegidaAcademica = new Date(fechaInicioAcademica);
    var fechaInicioElegidaLaboral = new Date(fechaInicioLaboral);
    var fechaFinalizacionElegidaLaboral = new Date(fechaFinalizacionLaboral);
    var formularioValido = true;

    if (clave !== confirmarClave) {
        alert('La clave y la confirmación de clave no coinciden.');
        formularioValido = false;
    }

    if (clave.length < 6) {
        console.log("Entro a validacion de longitud de clave")
        alert("La contraseña debe tener al menos 6 caracteres");
        formularioValido = false;
    }

    if (fechaInicioElegidaAcademica > fechaActual) {
        alert("La fecha de inicio no puede ser mayor a la fecha actual en la sección de educación");
        formularioValido = false;
    }

    if (fechaFinalAcademica < fechaInicioAcademica) {
        alert("La fecha final no puede ser menor a la fecha de inicio en la sección de educación");
        formularioValido = false;
    }

    if (fechaInicioElegidaLaboral > fechaActual) {
        alert("La fecha de inicio no puede ser mayor a la fecha actual en la sección de experiencia laboral");
        formularioValido = false;
    }

    if (fechaFinalizacionElegidaLaboral > fechaActual) {
        alert("La fecha de finalización no puede ser mayor a la fecha actual en la sección de experiencia laboral");
        formularioValido = false;
    }

    if (formularioValido === true) {

        const experiencia = [
            {
                id: generateUniqueId(),
                titulo: tituloEmpresa,
                empresa: empresa,
                fechaInicio: fechaInicioLaboral,
                fechaFin: fechaFinalizacionLaboral,
                descripcion: descripcionRol
            }
        ];
        
        const educacion = [
            {
                id: generateUniqueId(),
                nivelEducativo: nivelEducativo,
                institucion: centroEducativo,
                fechaInicio: fechaInicioAcademica,
                fechaFin: fechaFinalAcademica
            }
        ];
        
        const usuarioFinal = {
            nombre: nombre,
            apellidos: apellidos,
            correo: correo,
            clave: clave,
            genero: genero,
            experiencia: experiencia,
            educacion: educacion,
            fotoPerfil: fotoPerfil,
            curriculum: cv,
        };

        try {
            const respuesta = await fetch('http://localhost:3000/registrarUsuarioFinal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuarioFinal)
            });

            const exitoso = await respuesta.json();
            if (exitoso) {
                alert('Usuario creado exitosamente');
                window.location.href = "./login.html";
            } else {
                alert('Error al crear usuario');
            }
        }
        catch (error) {
            console.log('Error:', error);
            alert('Error al crear usuario');
        }
    }
}



window.onload = function () {
    cargarFoto();
    cargarCV();


    let formulario = document.getElementById('formularioGeneralUsuario');
    formulario.addEventListener('submit', crearCuentaUsuarioFinal);


    let fechaFinalizacionLaboral = document.getElementById("fechaFinalizacionLaboral");
    let actualmenteTrabaja = document.getElementById("actualmenteTrabaja");
    /*let sinExperiencia = document.getElementById("sinExperiencia");*/

    fechaFinalizacionLaboral.addEventListener('input', function () {
        if (fechaFinalizacionLaboral.value !== '') {
            actualmenteTrabaja.disabled = true;
            actualmenteTrabaja.checked = false;
        } else {
            actualmenteTrabaja.disabled = false;
        }
    });

    actualmenteTrabaja.addEventListener('change', function () {
        if (actualmenteTrabaja.checked) {
            fechaFinalizacionLaboral.disabled = true;
            fechaFinalizacionLaboral.value = '';
        } else {
            fechaFinalizacionLaboral.disabled = false;
        }
    });

};

generateUniqueId = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
    return randomNumber.toString();
}