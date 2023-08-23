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


function redirigirCuentaEmpresa() {
    // Esto es para cambiar llevarnos a donde sería el landing page de la cuenta de empresa
    window.location.href = "login.html";
}

async function registrarEmpresa(evento) {
    evento.preventDefault();
    var nombre = document.getElementById('nombre').value;
    var correo = document.getElementById('email').value;
    var clave = document.getElementById('clave').value;
    var confirmarClave = document.getElementById('confirmarClave').value;
    var fotoPerfil = localStorage.getItem("fotoPerfil");
    var formularioValido = true;

    if (clave !== confirmarClave) {
        alert('La clave y la confirmación de clave no coinciden.');
        formularioValido = false;
    }

    if (clave.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        formularioValido = false;
    }

    if (formularioValido === true) {

        const empresa = {
            nombre: nombre,
            correo: correo,
            contrasena: clave,
            fotoPerfil: fotoPerfil,
        };

        try {
            const respuesta = await fetch("http://localhost:3000/registrarEmpresas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(empresa),
            });

            const empresaGuardada = await respuesta.json();
            console.log(empresaGuardada);
            alert("Empresa registrada exitosamente");
            redirigirCuentaEmpresa();

        } catch (error) {
            console.log("Error:", error);
            alert("Error al registrar la empresa");
        }

    }
}

window.onload = function () {
    cargarFoto();

    let formulario = document.getElementById('formularioDatosEmpresa');
    formulario.addEventListener('submit', registrarEmpresa);

}