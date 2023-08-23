async function recuperarClave(evento) {
    evento.preventDefault();
    var correo = document.getElementById("correo").value;
    const token = generarToken();
    var clave = token;
    console.log(clave);

    try {
        const respuesta = await fetch("http://localhost:3000/recuperarClave", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ correo, clave }),
        });

        if (respuesta.ok) {
            const recuperarClave = await respuesta.json();
            console.log(recuperarClave);
            alert("Se ha enviado un correo con su nueva contraseña");
            window.location.href = "login.html";
        } else {
            alert("Correo no registrado");
        }

    }
    catch (error) {
        console.log("Error:", error);
        alert("Error al recuperar contraseña");
    }
};

// Función para generar un token aleatorio
function generarToken() {
    return Math.random().toString(36).substr(2, 10);
};

window.onload = function () {
    let form = document.getElementById("formRecuperarClave");
    form.addEventListener("submit", recuperarClave);
};