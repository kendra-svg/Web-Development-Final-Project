async function login(evento) {
    evento.preventDefault();
    var correo = document.getElementById("correo").value;
    var contrasena = document.getElementById("contrasena").value;
    var formularioValido = true;

    if (correo === '') {
        alert("El campo correo no puede estar vacío");
        formularioValido = false;
    }

    if (contrasena === '') {
        alert("El campo contraseña no puede estar vacío");
        formularioValido = false;
    }

    if (formularioValido === true) {
        const login = {
            correo: correo,
            contrasena: contrasena,
        };

        try {
            const respuesta = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(login),
            });

            if (respuesta.ok) {
                const loginConsultado = await respuesta.json();
                console.log(loginConsultado);
                localStorage.setItem('userName', loginConsultado.nombre);
                localStorage.setItem('userEmail', loginConsultado.correo);
                localStorage.setItem('empresa', loginConsultado.empresa);
                localStorage.setItem('rol', loginConsultado.rol);
                localStorage.setItem('userCV', loginConsultado.curriculum);

                if (loginConsultado.perfil === "admin") {
                    redirigirCuentaAdmin();
                } else if (loginConsultado.perfil === "colaborador") {
                    if (loginConsultado.rol === "Gerente") {
                        redirigirCuentaGerente();
                    } else if (loginConsultado.rol === "Reclutador") {    
                        redirigirCuentaReclutador();
                    }
                } else if (loginConsultado.perfil === "usuarioFinal") {
                    redirigirCuentaUsuarioFinal();
                }
            } else {
                alert("Correo o contraseña incorrectos");
            }
        } catch (error) {
            console.log("Error:", error);
            alert("Error al iniciar sesión");
        }
    }
}


function redirigirCuentaAdmin() {
    /* Esto es para cambiar llevarnos a donde sería el landing page de la cuenta de admin*/
    window.location.href = "./landingAdministrador.html";
}

function redirigirCuentaGerente() {
    window.location.href = "./landingGerente.html";
}

function redirigirCuentaReclutador() {
    window.location.href = "./landingReclutador.html";
}

function redirigirCuentaUsuarioFinal() {
    window.location.href = "./landingUsuarioFinal.html";
}

window.onload = function () {
    let formulario = document.getElementById('formularioInicioSesion');
    formulario.addEventListener('submit', login);
}