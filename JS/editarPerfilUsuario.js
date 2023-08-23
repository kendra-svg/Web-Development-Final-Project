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

async function cargarCV() {
  const buttonElement = document.getElementById("botoncv");

  let myWidget = cloudinary.createUploadWidget(
      {
          cloudName: "dobj7jqwu",
          uploadPreset: "preset.Rom",
          clientAllowedFormats: ["pdf"],
          maxFileSize: 3000000,
          resource_type: "raw",
      },
      (error, result) => {
          if (error) {
              console.error("Error uploading file:", error);
          } else if (result && result.event === "success") {
              localStorage.setItem("cv", result.info.secure_url);
              localStorage.setItem("userCV", result.info.secure_url)
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

async function cargarDatosPerfil() {
  const userEmail = localStorage.getItem("userEmail");

  try {
    const respuestaUsuario = await fetch(`http://localhost:3000/datosUsuarioFinal?correo=${userEmail}`);
    const usuario = await respuestaUsuario.json();
    console.log(usuario);

    document.getElementById("nombre").value = usuario.nombre;
    document.getElementById("apellidos").value = usuario.apellidos;
    document.getElementById("correo").value = usuario.correo;
    document.getElementById("genero").value = usuario.genero;

   /* document.getElementById("tituloExperiencia").value = usuario.experiencia.titulo;
    document.getElementById("empresa").value = usuario.experiencia.empresa;
    document.getElementById("fechaInicioExperiencia").value = (usuario.experiencia.fechaInicio.split("T")[0]);

    if (usuario.experiencia.fechaFin == null) {
      document.getElementById("fechaFinExperiencia").value = new Date().toISOString().split("T")[0];
    } else {
      document.getElementById("fechaFinExperiencia").value = (usuario.experiencia.fechaFin.split("T")[0]);
    }
    document.getElementById("descripcionTrabajo").value = usuario.experiencia.descripcion;


    document.getElementById("education").value = usuario.educacion.nivelEducativo;
    document.getElementById("institucion").value = usuario.educacion.institucion;
    document.getElementById("fechaInicioEducacion").value = (usuario.educacion.fechaInicioEducacion.split("T")[0]);

    if (usuario.educacion.fechaFinEducacion == null) {
      document.getElementById("fechaFinalEducacion").value = new Date().toISOString().split("T")[0];
    } else {
      document.getElementById("fechaFinalEducacion").value = (usuario.educacion.fechaFinEducacion.split("T")[0]);
    }

    document.getElementById("descripcionEducacion").value = usuario.educacion.descripcionEducacion; */

    document.getElementById("fotoUsuario").src = usuario.fotoPerfil;

  } catch (error) {
    console.log("Error:", error);
    alert("Error al cargar los datos del usuario");
  }    
}



async function editarPerfil(evento) {
  evento.preventDefault();

  var nombre = document.getElementById("nombre").value;
  var apellidos = document.getElementById("apellidos").value;
  var correo = document.getElementById("correo").value;
  var genero = document.getElementById("genero").value;
  var clave = document.getElementById("password1").value;
  var clave2 = document.getElementById("password2").value;

/*  var tituloExperiencia = document.getElementById("tituloExperiencia").value;
  var empresa = document.getElementById("empresa").value;
  var fechaInicioExperiencia = document.getElementById("fechaInicioExperiencia").value;
  var fechaFinExperiencia = document.getElementById("fechaFinExperiencia").value;
  var descripcionTrabajo = document.getElementById("descripcionTrabajo").value;

  var education = document.getElementById("education").value;
  var institucion = document.getElementById("institucion").value;
  var fechaInicioEducacion = document.getElementById("fechaInicioEducacion").value;
  var fechaFinalEducacion = document.getElementById("fechaFinalEducacion").value;
  var descripcionEducacion = document.getElementById("descripcionEducacion").value; */

  var fotoPerfil = localStorage.getItem("newfotoPerfil");
  var cv = localStorage.getItem("cv");

  var fechaActual = new Date();
  var fechaInicioLaboral = new Date(fechaInicioExperiencia);
  var fechaFinalizacionLaboral = new Date(fechaFinExperiencia);
  var fechaInicioAcademica = new Date(fechaInicioEducacion);
  var fechaFinalAcademica = new Date(fechaFinalEducacion);
  var formularioValido = true;

  if (clave !== clave2) {
    alert("Las contraseñas no coinciden");
    formularioValido = false;
  }

  if (clave.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres");
    formularioValido = false;
  }

  if (fechaInicioLaboral > fechaActual) {
    alert("La fecha de inicio de experiencia laboral no puede ser en el futuro");
    formularioValido = false;
  }

  if (fechaFinalizacionLaboral > fechaActual) {
    alert("La fecha de finalización de experiencia laboral no puede ser en el futuro");
    formularioValido = false;
  }

  if (fechaInicioAcademica > fechaActual) {
    alert("La fecha de inicio de educación no puede ser en el futuro");
    formularioValido = false;
  }

  if (fechaInicioLaboral > fechaFinalizacionLaboral) {
    alert("La fecha de inicio de experiencia laboral no puede ser posterior a la fecha de finalización");
    formularioValido = false;
  }

  if (fechaInicioAcademica > fechaFinalAcademica) {
    alert("La fecha de inicio de educación no puede ser posterior a la fecha de finalización");
    formularioValido = false;
  }

  if (formularioValido) {

    const usuarioFinal = {
      nombre: nombre,
      apellidos: apellidos,
      correo: correo,
      clave: clave,
      genero: genero,
      fotoPerfil: fotoPerfil,
      curriculum: cv,
    };

    const confirmEdit = confirm("¿Estás seguro de que deseas editar tu perfil?");

    if (confirmEdit) {
      try {
        const respuesta = await fetch('http://localhost:3000/editarPerfilUsuarioFinal', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(usuarioFinal)
        });

        const exitoso = await respuesta.json();
        if (exitoso) {
          alert('Usuario editado exitosamente');

          const notificacionData = {
            correoRecipiente: correo,
            titulo: "Perfil Editado",
            mensaje: `Tu perfil ha sido editado exitosamente.`,
          };

          await fetch("http://localhost:3000/notificaciones", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificacionData),
          });

          window.location.reload();

        } else {
          alert('Error al editar usuario');
        }
      } catch (error) {
        console.log('Error:', error);
        alert('Error al editar usuario');
      }
    } else {
      alert("Cancelaste la acción de editar tu perfil.");
    }
  }
};

window.onload = function () {
  cargarDatosPerfil();
  cargarFoto();
  cargarCV();
  experienciaLaboral();
  educacion();

  let botonEditarPerfil = document.getElementById("guardarPerfilBtn");
  botonEditarPerfil.addEventListener("click", editarPerfil);

  let botonAgregarExperiencia = document.getElementById("agregarExperiencia");
  botonAgregarExperiencia.addEventListener("click", agregarExperiencia);

  let botonAgregarEducacion = document.getElementById("agregarEducacion");
  botonAgregarEducacion.addEventListener("click", agregarEducacion);

  let fechaFinalizacionLaboral = document.getElementById("fechaFinExperiencia");
  let posicionActual = document.getElementById("posicionActual");
  fechaFinalizacionLaboral.addEventListener("input", function () {
    if (fechaFinalizacionLaboral.value !== "") {
      document.getElementById("posicionActual").disabled = true;
      document.getElementById("posicionActual").checked = false;
    } else {
      document.getElementById("posicionActual").disabled = false;
    }
  });

  posicionActual.addEventListener("change", function () {
    if (posicionActual.checked) {
      document.getElementById("fechaFinExperiencia").disabled = true;
      document.getElementById("fechaFinExperiencia").value = "";
    } else {
      document.getElementById("fechaFinExperiencia").disabled = false;
    }
  });


}

async function experienciaLaboral() {

  const correo = localStorage.getItem("userEmail");

  try {
    const response = await fetch(`http://localhost:3000/experiencia/${correo}`);
    const experiencias = await response.json();

    const tableBody = document.getElementById("tablaExperienciaBody");

    experiencias.forEach((experiencia) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${experiencia.titulo}</td>
        <td>${experiencia.empresa}</td>
        <td>${experiencia.fechaInicio}</td>
        <td>${experiencia.fechaFin}</td>
        <td>${experiencia.descripcion}</td>
        <td><button type="button" class="btn-eliminar" onclick="eliminarExperiencia(${experiencia.id})">Eliminar</button></td>
      `;
      tableBody.appendChild(newRow);
    });

  } catch (error) {
    console.log(error);
    alert("Error al cargar la experiencia laboral");
  }

};

async function agregarExperiencia() {
  
    const correo = localStorage.getItem("userEmail");
  
    const tituloExperiencia = document.getElementById("tituloExperiencia").value;
    const empresa = document.getElementById("empresa").value;
    const fechaInicioExperiencia = document.getElementById("fechaInicioExperiencia").value;
    const fechaFinExperiencia = document.getElementById("fechaFinExperiencia").value;
    const descripcionTrabajo = document.getElementById("descripcionTrabajo").value;
  
    const fechaActual = new Date();
    const fechaInicioLaboral = new Date(fechaInicioExperiencia);
    const fechaFinalizacionLaboral = new Date(fechaFinExperiencia);
  
    if (fechaInicioLaboral > fechaActual) {
      alert("La fecha de inicio de experiencia laboral no puede ser en el futuro");
    } else if (fechaFinalizacionLaboral > fechaActual) {
      alert("La fecha de finalización de experiencia laboral no puede ser en el futuro");
    } else if (fechaInicioLaboral > fechaFinalizacionLaboral) {
      alert("La fecha de inicio de experiencia laboral no puede ser posterior a la fecha de finalización");
    } else {
  
      const experiencia = {
        correo: correo,
        titulo: tituloExperiencia,
        empresa: empresa,
        fechaInicio: fechaInicioExperiencia,
        fechaFin: fechaFinExperiencia,
        descripcion: descripcionTrabajo,
      };

      const confirmacion = confirm("¿Estás seguro de que deseas agregar esta experiencia laboral?");

      if (confirmacion) {
      try {
        const response = await fetch("http://localhost:3000/experiencia/" + correo, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(experiencia),
        });
  
        const exitoso = await response.json();
        if (exitoso) {
          alert("Experiencia laboral agregada exitosamente");
          window.location.reload();
        } else {
          alert("Error al agregar experiencia laboral");
        }
      } catch (error) {
        console.log(error);
        alert("Error al agregar experiencia laboral");
      }
    } else {
      alert("Cancelaste la acción de agregar experiencia laboral.");
    }
  }
};

async function eliminarExperiencia(id) {

  const correo = localStorage.getItem("userEmail");
  const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta experiencia laboral?");

  if (confirmacion) {
    try {
      const response = await fetch("http://localhost:3000/experiencia/" + correo + "/" + id, {
        method: "DELETE",
      });

      const exitoso = await response.json();
      if (exitoso) {
        alert("Experiencia laboral eliminada exitosamente");
        window.location.reload();
      } else {
        alert("Error al eliminar experiencia laboral");
      }
    } catch (error) {
      console.log(error);
      alert("Error al eliminar experiencia laboral");
    }
  } else {
    alert("Cancelaste la acción de eliminar experiencia laboral.");
  }
};

async function educacion() {

  const correo = localStorage.getItem("userEmail");

  try {
    const response = await fetch(`http://localhost:3000/educacion/${correo}`);
    const educaciones = await response.json();

    const tableBody = document.getElementById("tbodyEducacion");

    educaciones.forEach((educacion) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${educacion.nivelEducativo}</td>
        <td>${educacion.institucion}</td>
        <td>${educacion.fechaInicio}</td>
        <td>${educacion.fechaFin}</td>
        <td>${educacion.descripcion}</td>
        <td><button type="button" class="btn-eliminar" onclick="eliminarEducacion(${educacion.id})">Eliminar</button></td>
      `;
      tableBody.appendChild(newRow);
    });

  } catch (error) {
    console.log(error);
    alert("Error al cargar la educación");
  }
};

async function agregarEducacion() {
  
    const correo = localStorage.getItem("userEmail");
  
    const nivelEducativo = document.getElementById("education").value;
    const institucion = document.getElementById("institucion").value;
    const fechaInicioEducacion = document.getElementById("fechaInicioEducacion").value;
    const fechaFinalEducacion = document.getElementById("fechaFinalEducacion").value;
    const descripcionEducacion = document.getElementById("descripcionEducacion").value;
  
    const fechaActual = new Date();
    const fechaInicio = new Date(fechaInicioEducacion);
    const fechaFinal = new Date(fechaFinalEducacion);
  
    if (fechaInicio > fechaActual) {
      alert("La fecha de inicio de educación no puede ser en el futuro");
    } else if (fechaInicio > fechaFinal) {
      alert("La fecha de inicio de educación no puede ser posterior a la fecha de finalización");
    } else {
  
      const educacion = {
        correo: correo,
        nivelEducativo: nivelEducativo,
        institucion: institucion,
        fechaInicio: fechaInicioEducacion,
        fechaFin: fechaFinalEducacion,
        descripcion: descripcionEducacion,
      };

      const confirmacion = confirm("¿Estás seguro de que deseas agregar esta educación?");
  
      if (confirmacion) {
        try {
          const response = await fetch("http://localhost:3000/educacion/" + correo, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(educacion),
          });
  
          const exitoso = await response.json();
          if (exitoso) {
            alert("Educación agregada exitosamente");
            window.location.reload();
          } else {
            alert("Error al agregar educación");
          }
        } catch (error) {
          console.log(error);
          alert("Error al agregar educación");
        }
      } else {
        alert("Cancelaste la acción de agregar educación.");
      }
    }
};

async function eliminarEducacion(id) {

  const correo = localStorage.getItem("userEmail");
  const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta educación?");

  if (confirmacion) {
    try {
      const response = await fetch("http://localhost:3000/educacion/" + correo + "/" + id, {
        method: "DELETE",
      });

      const exitoso = await response.json();
      if (exitoso) {
        alert("Educación eliminada exitosamente");
        window.location.reload();
      } else {
        alert("Error al eliminar educación");
      }
    } catch (error) {
      console.log(error);
      alert("Error al eliminar educación");
    }
  } else {
    alert("Cancelaste la acción de eliminar educación.");
  }
}