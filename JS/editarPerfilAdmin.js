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
              localStorage.setItem("newfotoPerfil", imgElement.src);
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

async function cargarDatosEmpresa() {
  const userEmail = localStorage.getItem('userEmail');

  try {
    const respuestaDatosPerfil = await fetch("http://localhost:3000/datosPerfilEmpresa?correo=" + userEmail);
    const datosPerfil = await respuestaDatosPerfil.json();
    console.log(datosPerfil);

    document.getElementById("nombreEmpresa").value = datosPerfil.nombre;
    document.getElementById("correoEmpresa").value = datosPerfil.correo;
    document.getElementById("descripcion").value = datosPerfil.descripcion;
    document.getElementById("fotoUsuario").src = datosPerfil.fotoPerfil;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
  }
}

async function actualizarDatosEmpresa() {
  const nombreEmpresa = document.getElementById("nombreEmpresa").value;
  const correoEmpresa = document.getElementById("correoEmpresa").value;
  const contrasena = document.getElementById("password1").value;
  const contrasena2 = document.getElementById("password2").value;
  const descripcion = document.getElementById("descripcion").value;
  var formularioValido = true;

  if (contrasena !== contrasena2) {
    alert('La clave y la confirmación de clave no coinciden.');
    formularioValido = false;
  }

  if (contrasena.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres");
    formularioValido = false;
  }

  if (formularioValido === true) {
    const datosEmpresa = {
      nombre: nombreEmpresa,
      correo: correoEmpresa,
      contrasena: contrasena,
      descripcion: descripcion,
      fotoPerfil: localStorage.getItem("newfotoPerfil"),
    };

    const confirmEdit = confirm("¿Estás seguro que deseas actualizar tus datos?");

    if (confirmEdit) {
      try {
        const respuesta = await fetch("http://localhost:3000/editarPerfilEmpresa", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosEmpresa),
        });

        const datosEmpresaActualizados = await respuesta.json();
        alert("Datos actualizados exitosamente");
        window.location.reload();
    
      } catch (error) {
        console.log("Error:", error);
      }
    } else {
      alert("Cancelaste la acción de actualizar tus datos.");
    }
  }
}

// Ejecutar la función al cargar la página
window.onload = function () {
  cargarFoto();
  cargarDatosEmpresa();
  let form = document.getElementById('editarPerfilEmpresa');
  form.addEventListener('submit', actualizarDatosEmpresa);
}