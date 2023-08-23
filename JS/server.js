const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

// Modelos
const RangosSalarialesModel = require("./models/rangosSalariales");
const EmpleosModel = require("./models/empleos");
const AdminsModel = require("./models/usuarioAdmin");
const GenerosModel = require("./models/genero");
const UsuarioColaboradorModel = require("./models/usuarioColaborador");
const Aplicaciones = require("./models/aplicaciones");
const UsuarioFinalModel = require("./models/usuarioFinal");
const Notificaciones = require("./models/notificaciones");
const InvitacionesPuestos = require("./models/invitacionesPuestosTrabajo");

// Configuración
const app = express();
app.use(express.json());
app.use(cors());

const cloudinary = require('cloudinary').v2;
      
cloudinary.config({ 
  cloud_name: 'dobj7jqwu', 
  api_key: '394851558792411', 
  api_secret: 'ZK3jjb9PWQbckkUrgvKC3CZuMOQ' 
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'contratame.ya.trabajos@gmail.com',
        pass: 'xdxearacnncfyfpb'
    }
});


// Conexión a la base de datos
mongoose.connect("mongodb+srv://admin:Q9lvp68kolzGS7dB@cluster0.pzmtrxf.mongodb.net/?retryWrites=true&w=majority");

// Rutas
app.get("/rangosSalariales", async function (req, res) {
    console.log("Atendiendo solicitud GET /rangosSalariales");
    try {
        console.log("Consultando rangos salariales en la base de datos");
        const rangosSalariales = await RangosSalarialesModel.find({});
        console.log("Rangos salariales:", rangosSalariales);

        res.status(200).send(rangosSalariales);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.post("/rangosSalariales", async function (req, res) {
    console.log("Atendiendo solicitud POST /rangosSalariales");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const rangoSalarial = RangosSalarialesModel({
        id: req.body.id,
        rangoSalarial: req.body.rangoSalarial
    });

    try {
        console.log("Guardando rango salarial en la base de datos");
        const rangoSalarialGuardado = await rangoSalarial.save();
        console.log("Rango salarial guardado:", rangoSalarialGuardado);
        res.status(201).send(rangoSalarialGuardado);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.get("/empleosGerente", async function (req, res) {
    console.log("Atendiendo solicitud GET /empleosGerente");

    try {
        const empresa = req.query.empresa;
        const correo = req.query.correoGerente;
        console.log('Consultando empleos de la empresa ' + empresa + ' y usuario ' + correo + ' en la base de datos');

        const empleos = await EmpleosModel.find({empresa: empresa, correoGerente: correo});
        console.log ("Empleos:", empleos);
        res.status(200).send(empleos);

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.get("/empleosGerente/:id", async function (req, res) {
    console.log("Atendiendo solicitud GET /empleosGerente/:id");

    try {
        console.log ("Consultando empleo en la base de datos");
        const empleo = await EmpleosModel.findById(req.params.id);
        console.log ("Empleo:", empleo);
        res.status(200).send(empleo);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.put("/empleosGerente/:id", async function (req, res) {
    console.log("Atendiendo solicitud PUT /empleosGerente/:id");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const empleo = {
        empresa: req.body.empresa,
        titulo: req.body.titulo,
        visibilidad: req.body.visibilidad,
        rangoSalarialID: req.body.rangoSalarialID,
        rangoSalarial: req.body.rangoSalarial,
        requisitosMinimos: req.body.requisitosMinimos,
        requisitosDeseados: req.body.requisitosDeseados,
        correoGerente: req.body.correoGerente
    };

    try {
        console.log("Actualizando empleo en la base de datos");
        const empleoActualizado = await EmpleosModel.findByIdAndUpdate(req.params.id, empleo, { new: true });
        console.log("Empleo actualizado:", empleoActualizado);
        res.status(201).send(empleoActualizado);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.delete("/empleosGerente/:id", async function (req, res) {
    console.log("Atendiendo solicitud DELETE /empleosGerente/:id");

    try {
        console.log("Eliminando empleo de la base de datos");
        const empleoEliminado = await EmpleosModel.findByIdAndDelete(req.params.id);
        console.log("Empleo eliminado:", empleoEliminado);
        res.status(200).send(empleoEliminado);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.get("/empleosAdmin", async function (req, res) {
    console.log("Atendiendo solicitud GET /empleosAdmin");

    try {
        const empresa = req.query.empresa;
        console.log('Consultando empleos de la empresa ' + empresa + ' en la base de datos');
        const empleos = await EmpleosModel.find({empresa: empresa});
        console.log ("Empleos:", empleos);
        res.status(200).send(empleos);

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.get("/empleosAdmin/:id", async function (req, res) {
    console.log("Atendiendo solicitud GET /empleosAdmin/:id");

    try {
        console.log ("Consultando empleo en la base de datos");
        const empleo = await EmpleosModel.findById(req.params.id);
        console.log ("Empleo:", empleo);
        res.status(200).send(empleo);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.put("/empleosAdmin/:id", async function (req, res) {
    console.log("Atendiendo solicitud PUT /empleosAdmin/:id");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const empleo = {
        empresa: req.body.empresa,
        titulo: req.body.titulo,
        visibilidad: req.body.visibilidad,
        rangoSalarialID: req.body.rangoSalarialID,
        rangoSalarial: req.body.rangoSalarial,
        requisitosMinimos: req.body.requisitosMinimos,
        requisitosDeseados: req.body.requisitosDeseados,
        correoGerente: req.body.correoGerente
    };

    try {
        console.log("Actualizando empleo en la base de datos");
        const empleoActualizado = await EmpleosModel.findByIdAndUpdate(req.params.id, empleo, { new: true });
        console.log("Empleo actualizado:", empleoActualizado);
        res.status(201).send(empleoActualizado);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.delete("/empleosAdmin/:id", async function (req, res) {
    console.log("Atendiendo solicitud DELETE /empleosAdmin/:id");

    try {
        console.log("Eliminando empleo de la base de datos");
        const empleoEliminado = await EmpleosModel.findByIdAndDelete(req.params.id);
        console.log("Empleo eliminado:", empleoEliminado);
        res.status(200).send(empleoEliminado);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.get("/empleosLanding", async function (req, res) {
    console.log("Atendiendo solicitud GET /empleosLanding");
    try {
        console.log("Consultando empleos en la base de datos");
        const empleos = (await EmpleosModel.find({}, { titulo: 1, rangoSalarial: 1, empresa: 1 }).limit(8));
        console.log("Empleos:", empleos);
        res.status(200).send(empleos);

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.post("/empleos", async function (req, res) {
    console.log("Atendiendo solicitud POST /empleos");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const empleo = EmpleosModel({
        empresa: req.body.empresa,
        titulo: req.body.titulo,
        visibilidad: req.body.visibilidad,
        rangoSalarialID: req.body.rangoSalarialID,
        rangoSalarial: req.body.rangoSalarial,
        requisitosMinimos: req.body.requisitosMinimos,
        requisitosDeseados: req.body.requisitosDeseados,
        correoGerente: req.body.correoGerente
    });

    try {
        console.log("Guardando empleo en la base de datos");
        const empleoGuardado = await empleo.save();
        console.log("Empleo guardado:", empleoGuardado);
        res.status(201).send(empleoGuardado);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.get("/nombreEmpresasLanginUsuarios", async function (req, res) {
    console.log("Atendiendo solicitud GET /nombreEmpresasLanginUsuarios");

    try {
        console.log("Consultando nombres de empresas en la base de datos");
        const nombreEmpresas = (await AdminsModel.find({}, { nombre: 1 }).limit(6));
        console.log("Nombre de empresas:", nombreEmpresas);
        res.status(200).send(nombreEmpresas);

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.get("/nombreEmpresasBuscarEmpleos", async function (req, res) {
    console.log("Atendiendo solicitud GET /nombreEmpresasBuscarEmpleos");

    try {
        console.log("Consultando nombres de empresas en la base de datos");
        const nombreEmpresas = await AdminsModel.find({}, { nombre: 1 });
        console.log("Nombre de empresas:", nombreEmpresas);
        res.status(200).send(nombreEmpresas);

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.post("/registrarEmpresas", async function (req, res) {
    console.log("Atendiendo solicitud POST /registrarEmpresas");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const empresa = AdminsModel({
        nombre: req.body.nombre,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        descripcion: req.body.descripcion,
        fotoPerfil: req.body.fotoPerfil,
    });

    try {
        console.log("Guardando empresa en la base de datos");
        const empresaGuardada = await empresa.save();
        console.log("Empresa guardada:", empresaGuardada);
        res.status(201).send(empresaGuardada);

        const mailOptions = {
            from: 'contratame.ya.trabajos@gmail.com',
            to: req.body.correo,
            subject: 'Perfil de empresa creado exitosamente!',
            text: `Hola ${req.body.nombre},\n\nTu perfil de empresa fue creado exitosamente!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error al enviar el correo de notificación:', error);
            } else {
              console.log('Correo de notificación enviado:', info.response);
            }
        }); 

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.get("/empleosOverview", async function (req, res) {
    console.log("Atendiendo solicitud GET /empleosOverview");

    try {
        console.log("Consultando empleos en la base de datos");

        const query = { visibilidad: 'Pública' };

        if (req.query.nombreEmpresa) {
            query.empresa = req.query.nombreEmpresa;
            console.log("Query:", query);
        }

        if (req.query.rangoSalarialID) {
            query.rangoSalarialID = req.query.rangoSalarialID;
            console.log("Query:", query);
        }

        const empleos = await EmpleosModel.find(query);
        console.log("Empleos:", empleos);
        res.status(200).send(empleos);

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }

});

app.post("/generos", async function (req, res) {
    console.log("Atendiendo solicitud POST /generos");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const genero = GenerosModel({
        id: req.body.id,
        genero: req.body.genero
    });

    try {
        console.log("Guardando genero en la base de datos");
        const generoGuardado = await genero.save();
        console.log("Genero guardado:", generoGuardado);
        res.status(201).send(generoGuardado);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.get("/generosEditarPerfil", async function (req, res) {
    console.log("Atendiendo solicitud GET /generosEditarPerfil");
    try {
        console.log("Consultando generos en la base de datos");
        const generos = await GenerosModel.find({});
        console.log("Generos:", generos);
        res.status(200).send(generos);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }

});

app.post("/login", async function (req, res) {
    console.log("Atendiendo solicitud POST /login");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const login = {
        correo: req.body.correo,
        contrasena: req.body.contrasena,
    };

    try {
        console.log("Consultando login en la base de datos");
        const adminLogin = await AdminsModel.findOne({ correo: login.correo, contrasena: login.contrasena });
        const colaboradorLogin = await UsuarioColaboradorModel.findOne({ correo: login.correo, contrasena: login.contrasena });
        const usuarioFinalLogin = await UsuarioFinalModel.findOne({ correo: login.correo, clave: login.contrasena });

        if (adminLogin) {
            console.log("Login de admin:", adminLogin);
            res.status(200).send({
                perfil: "admin",
                nombre: adminLogin.nombre,
                correo: adminLogin.correo,
            });
        } else if (colaboradorLogin) {
            console.log("Login de colaborador:", colaboradorLogin);
            res.status(200).send({
                perfil: "colaborador",
                empresa: colaboradorLogin.empresa,
                nombre: colaboradorLogin.nombre,
                correo: colaboradorLogin.correo,
                rol: colaboradorLogin.rol,
            });
        } else if (usuarioFinalLogin) {
            console.log("Login de usuario final:", usuarioFinalLogin);
            res.status(200).send({
                perfil: "usuarioFinal",
                nombre: usuarioFinalLogin.nombre,
                correo: usuarioFinalLogin.correo,
                curriculum: usuarioFinalLogin.curriculum,
            });
        } else {
            console.log("Login incorrecto");
            res.status(401).send({ error: "Correo o contraseña incorrectos" });
        }


    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.post("/registrarUsuarioColaborador", async function (req, res) {
    console.log("Atendiendo solicitud POST /registrarUsuarioColaborador");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const usuarioColaborador = UsuarioColaboradorModel({
        empresa: req.body.empresa,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        genero: req.body.genero,
        rol: req.body.rol
    });

    try {
        console.log("Guardando usuario colaborador en la base de datos");
        const usuarioColaboradorGuardado = await usuarioColaborador.save();
        console.log("Usuario colaborador guardado:", usuarioColaboradorGuardado);
        res.status(201).send(usuarioColaboradorGuardado);

        const mailOptions = {
            from: 'contratame.ya.trabajos@gmail.com',
            to: req.body.correo,
            subject: 'Perfil de usuario creado exitosamente!',
            text: `Hola ${req.body.nombre},\n\nTu perfil de usuario fue creado exitosamente!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error al enviar el correo de notificación:', error);
            } else {
              console.log('Correo de notificación enviado:', info.response);
            }
        }); 

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.get("/datosUsuarioFinal", async function (req, res) {
    console.log("Atendiendo solicitud GET /datosUsuarioFinal");

    try {
        const userEmail = req.query.correo;
        console.log('Consultando informacion del usuario final ' + userEmail + 'en la base de datos');
        const usuariosFinales = await UsuarioFinalModel.findOne({ correo: userEmail });
        console.log('Usuarios finales:', usuariosFinales);
        res.status(200).send(usuariosFinales);

    } catch (error) {
        console.log('Error:', error);
        res.status(500).send(error);
    }
});


app.post("/registrarUsuarioFinal", async function (req, res) {
    console.log("Atendiendo solicitud POST /registrarUsuarioFinal");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const usuarioFinal = UsuarioFinalModel({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        clave: req.body.clave,
        correo: req.body.correo,
        genero: req.body.genero,
        experiencia: req.body.experiencia,
        educacion: req.body.educacion,
        fotoPerfil: req.body.fotoPerfil,
        curriculum: req.body.curriculum,
    });

    try {
        console.log("Guardando usuario final en la base de datos");
        const usuarioFinalGuardado = await usuarioFinal.save();
        console.log("Usuario final guardado:", usuarioFinalGuardado);
        res.status(201).send(usuarioFinalGuardado);

        const mailOptions = {
            from: 'contratame.ya.trabajos@gmail.com',
            to: req.body.correo,
            subject: 'Perfil de usuario creado exitosamente!',
            text: `Hola ${req.body.nombre},\n\nTu perfil de usuario fue creado exitosamente!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error al enviar el correo de notificación:', error);
            } else {
              console.log('Correo de notificación enviado:', info.response);
            }
        }); 
        
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.put('/editarPerfilUsuarioFinal', async function (req, res) {
    console.log("Atendiendo solicitud PUT /editarPerfilUsuarioFinal");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const usuarioFinal = {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        clave: req.body.clave,
        correo: req.body.correo,
        genero: req.body.genero,
        fotoPerfil: req.body.fotoPerfil,
        curriculum: req.body.curriculum,
    };

    try {
        console.log("Actualizando usuario final en la base de datos");
        const usuarioFinalActualizado = await UsuarioFinalModel.findOneAndUpdate({ correo: usuarioFinal.correo }, usuarioFinal, { new: true });
        console.log("Usuario final actualizado:", usuarioFinalActualizado);
        res.status(201).send(usuarioFinalActualizado);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.get("/aplicacionesUsuarioFinal", async function (req, res) {
    console.log("Atendiendo solicitud GET /aplicacionesUsuario");

    try {
        console.log("Consultando aplicaciones en la base de datos");
        const aplicaciones = (await Aplicaciones.find({ correoAplicante: req.query.correoAplicante })).reverse();
        console.log("Aplicaciones:", aplicaciones);
        res.status(200).send(aplicaciones);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.delete("/aplicacionesUsuarioFinal/:id", async function (req, res) {
    console.log("Atendiendo solicitud DELETE /aplicacionesUsuarioFinal/:id");

    try {
        console.log("Eliminando aplicacion de la base de datos");
        const aplicacionEliminada = await Aplicaciones.findByIdAndDelete(req.params.id);
        console.log("Aplicacion eliminada:", aplicacionEliminada);
        res.status(200).send(aplicacionEliminada);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.post("/aplicacionesUsuarioFinal", async function (req, res) {
    console.log("Atendiendo solicitud POST /aplicacionesUsuarioFinal");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const aplicacion = Aplicaciones({
        nombrePuesto: req.body.nombrePuesto,
        nombreAplicante: req.body.nombreAplicante,
        correoAplicante: req.body.correoAplicante,
        estadoAplicacion: req.body.estadoAplicacion,
        requisitosMinimos: req.body.requisitosMinimos,
        requisitosDeseados: req.body.requisitosDeseados,
        empresa: req.body.empresa,
        cvAplicante: req.body.cvAplicante,
    });
    console.log("Aplicacion:", aplicacion);

    try {
        console.log("Guardando aplicacion en la base de datos");
        const aplicacionGuardada = await aplicacion.save();
        console.log("Aplicacion guardada:", aplicacionGuardada);
        res.status(201).send(aplicacionGuardada);

        const mailOptions = {
            from: 'contratame.ya.trabajos@gmail.com',
            to: req.body.correoAplicante,
            subject: 'Notificación de aplicación',
            text: `Hola ${req.body.nombreAplicante},\n\nHas aplicado al puesto "${req.body.nombrePuesto}" exitosamente.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error al enviar el correo de notificación:', error);
            } else {
                console.log('Correo de notificación enviado:', info.response);
            }
        });

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});


app.get('/datosPerfilEmpresa', async function (req, res) {
    console.log("Atendiendo solicitud GET /datosPerfilEmpresa");

    try {
        const userEmail = req.query.correo;
        console.log('Consultando informacion de la empresa ' + userEmail + 'en la base de datos');
        const empresas = await AdminsModel.findOne({ correo: userEmail });
        console.log('Empresas:', empresas);
        res.status(200).send(empresas);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send(error);
    }
});

app.put('/editarPerfilEmpresa', async function (req, res) {
    console.log("Atendiendo solicitud PUT /editarPerfilEmpresa");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const empresa = {
        nombre: req.body.nombre,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        descripcion: req.body.descripcion,
        fotoPerfil: req.body.fotoPerfil,
    };

    try {
        console.log("Actualizando empresa en la base de datos");
        const empresaActualizada = await AdminsModel.findOneAndUpdate({ correo: empresa.correo }, empresa, { new: true });
        console.log("Empresa actualizada:", empresaActualizada);
        res.status(201).send(empresaActualizada);

        const notificacionData = {
            correoRecipiente: req.body.correo,
            titulo: "Datos de perfil actualizados",
            mensaje: "Se han actualizado los datos de tu perfil.",
          };

        await fetch("http://localhost:3000/notificaciones", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificacionData),
        });

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.get("/notificaciones", async function (req, res) {
    console.log("Atendiendo solicitud GET /notificaciones");

    try {
        console.log("Consultando notificaciones en la base de datos");
        const notificaciones = (await Notificaciones.find({ correoRecipiente: req.query.correoRecipiente })).reverse();
        console.log("Notificaciones:", notificaciones);
        res.status(200).send(notificaciones);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.post("/notificaciones", async function (req, res) {
    console.log("Atendiendo solicitud POST /notificaciones");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const notificacion = Notificaciones({
        correoRecipiente: req.body.correoRecipiente,
        titulo: req.body.titulo,
        mensaje: req.body.mensaje
    });

    try {
        console.log("Guardando notificacion en la base de datos");
        const notificacionGuardada = await notificacion.save();
        console.log("Notificacion guardada:", notificacionGuardada);
        res.status(201).send(notificacionGuardada);

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.delete("/notificaciones/:id", async function (req, res) {
    console.log("Atendiendo solicitud DELETE /notificaciones/:id");

    try {
        console.log("Eliminando notificacion de la base de datos");
        const notificacionEliminada = await Notificaciones.findByIdAndDelete(req.params.id);
        console.log("Notificacion eliminada:", notificacionEliminada);
        res.status(200).send(notificacionEliminada);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});

app.get('/datosPerfilColaborador', async function (req, res) {
    console.log("Atendiendo solicitud GET /datosPerfilColaborador");

    try {
        const userEmail = req.query.correo;
        console.log('Consultando informacion del colaborador ' + userEmail + 'en la base de datos');
        const colaboradores = await UsuarioColaboradorModel.findOne({ correo: userEmail });
        console.log('Colaboradores:', colaboradores);
        res.status(200).send(colaboradores);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send(error);
    }
});

app.put('/editarPerfilColaborador', async function (req, res) {
    console.log("Atendiendo solicitud PUT /editarPerfilColaborador");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const colaborador = {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        rol: req.body.rol,
        genero: req.body.genero,
        contrasena: req.body.contrasena,
        fotoPerfil: req.body.fotoPerfil,
    };

    try {
        console.log("Actualizando colaborador en la base de datos");
        const colaboradorActualizado = await UsuarioColaboradorModel.findOneAndUpdate({ correo: colaborador.correo }, colaborador, { new: true });
        console.log('Colaborador actualizado:', colaboradorActualizado);
        res.status(201).send(colaboradorActualizado);
    } catch (error) {
        console.log("Error:", error);
        res.status(201).send(error);
    }
});

app.get("/administrarEmpleados", async function (req, res) {
    console.log("Atendiendo solicitud GET /administrarEmpleados");
    const empresa = req.query.empresa;
    console.log("Empresa:", empresa);

    try {
        console.log("Consultando empleados en la base de datos");
        const empleados = await UsuarioColaboradorModel.find({empresa: empresa}, { correo: 1, empresa: 1, nombre: 1, rol: 1});
        console.log("Empleados:", empleados);
        res.status(200).send(empleados);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});


app.put("/administrarEmpleados/:correo", async function (req, res) {
    console.log("Atendiendo solicitud PUT /administrarEmpleados");

    const correoSeleccionado = req.params.correo; // Obtener el correo seleccionado desde los parámetros de la URL
    console.log("Correo seleccionado:", correoSeleccionado);
    
    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const nuevoRol = req.body.editarRol; // Obtener el nuevo rol desde el cuerpo de la solicitud

    try {
        console.log("Actualizando empleado en la base de datos");
        const empleadoActualizado = await UsuarioColaboradorModel.findOneAndUpdate(
            { correo: correoSeleccionado }, // Buscar por el correo seleccionado
            { rol: nuevoRol }, // Actualizar el rol
            { new: true }
        );

      /*  const notificacionAdmin = {
            correoRecipiente: localStorage.getItem("userEmail"),
            titulo: "Se ha cambiado el rol de un empleado",
            mensaje: "Se ha cambiado el rol de " + req.body.correo + " a " + req.body.rol + ".",
          };
    
        await fetch("http://localhost:3000/notificaciones", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificacionAdmin),
        }); */

        const notificacionColaborador = {
            correoRecipiente: correoSeleccionado,
            titulo: "Te han cambiado el rol",
            mensaje: "Se te ha cambiado el rol a " + nuevoRol + ".",
          };
    
        await fetch("http://localhost:3000/notificaciones", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificacionColaborador),
        });

        console.log("Empleado actualizado:", empleadoActualizado);
        res.status(201).json(empleadoActualizado);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json(error);
    }
});

app.post("/invitarUsuarioAPuesto", async function (req, res) {
    console.log("Atendiendo solicitud POST /invitarUsuarioAPuesto");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const invitacion = InvitacionesPuestos({
        idPuesto: req.body.idPuesto,
        nombrePuesto: req.body.nombrePuesto,
        correoInvitado: req.body.correoInvitado,
        nombreAdministrador: req.body.nombreAdministrador,
        correoAdministrador: req.body.correoAdministrador,
        empresa: req.body.empresa,
    });

    try {
        console.log("Guardando invitacion en la base de datos");
        const invitacionGuardada = await invitacion.save();
        console.log("Invitacion guardada:", invitacionGuardada);
        res.status(201).send(invitacionGuardada);

        const notificacionUsuarioFinal = {
            correoRecipiente: req.body.correoInvitado,
            titulo: "Invitación a puesto " + req.body.nombrePuesto,
            mensaje: "El usuario '" + req.body.nombreAdministrador + "' te ha invitado a aplicar al puesto '" 
            + req.body.nombrePuesto + "' en la empresa " + req.body.empresa + ".",
          };
    
        await fetch("http://localhost:3000/notificaciones", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificacionUsuarioFinal),
        });

        const notificacionAdmin = {
            correoRecipiente: req.body.correoAdministrador,
            titulo: "Invitación a puesto " + req.body.nombrePuesto,
            mensaje: "Invitación al puesto de '"+ req.body.nombrePuesto +"' enviada existosamente al usuario '" + req.body.correoInvitado + "'.",
          };
    
        await fetch("http://localhost:3000/notificaciones", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificacionAdmin),
        });

        const mailUsuarioFinal = {
            from: 'contratame.ya.trabajos@gmail.com',
            to: req.body.correoInvitado,
            subject: "Invitación a puesto " + req.body.nombrePuesto,
            text: "Hola! \n\nTe informamos que el usuario '" + req.body.nombreAdministrador 
            + "' te ha invitado a aplicar al puesto '" + req.body.nombrePuesto + "' en la empresa " + req.body.empresa 
            + ".\n\nPara ver la invitación, ingresa a la plataforma.\n\nSaludos,\n\nEl equipo de Contrátame Ya.",
        };

        transporter.sendMail(mailUsuarioFinal, (error, info) => {
            if (error) {
              console.log('Error al enviar el correo de notificación:', error);
            } else {
              console.log('Correo de notificación enviado:', info.response);
            }
        }); 

        const mailAdmin = {
            from: 'contratame.ya.trabajos@gmail.com',
            to: req.body.correoAdministrador,
            subject: "Invitación a puesto " + req.body.nombrePuesto,
            text: "Invitación al puesto de '"+ req.body.nombrePuesto +"' enviada existosamente al usuario '" + req.body.correoInvitado + "'.",
        };

        transporter.sendMail(mailAdmin, (error, info) => {
            if (error) {
              console.log('Error al enviar el correo de notificación:', error);
            } else {
              console.log('Correo de notificación enviado:', info.response);
            }
        }); 


    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }

});

app.get("/administrarAplicaciones", async function (req, res) {
    console.log("Atendiendo solicitud GET /administrarAplicaciones");

    try {
        console.log("Consultando aplicaciones en la base de datos");
        const aplicaciones = await Aplicaciones.find({empresa: req.query.empresa});
        console.log("Aplicaciones:", aplicaciones);
        res.status(200).send(aplicaciones);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});


app.put("/recuperarClave", async function (req, res) {
    console.log("Atendiendo solicitud PUT /recuperarClave");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const correo = req.body.correo;
    const contrasena = req.body.clave;

    try {
        // Check user type and update password accordingly
        const adminLogin = await AdminsModel.findOne({ correo: correo });
        const colaboradorLogin = await UsuarioColaboradorModel.findOne({ correo: correo });
        const usuarioFinalLogin = await UsuarioFinalModel.findOne({ correo: correo });

        if (adminLogin) {
            console.log("Usuario encontrado:", adminLogin);
            await AdminsModel.findOneAndUpdate({ correo: correo }, { contrasena: contrasena }, { new: true });
        } else if (colaboradorLogin) {
            console.log("Usuario encontrado:", colaboradorLogin);
            await UsuarioColaboradorModel.findOneAndUpdate({ correo: correo }, { contrasena: contrasena }, { new: true });
        } else if (usuarioFinalLogin) {
            console.log("Usuario encontrado:", usuarioFinalLogin);
            await UsuarioFinalModel.findOneAndUpdate({ correo: correo }, { clave: contrasena }, { new: true });
        } else {
            console.log("Usuario no encontrado");
            return res.status(404).send("Usuario no encontrado");
        }

        console.log("Clave actualizada en la base de datos");
        res.status(200).json({ message: "Clave actualizada correctamente" });

        const recuperarEmail = {
            from: 'contratame.ya.trabajos@gmail.com',
            to: req.body.correo,
            subject: "Recuperación de clave",
            text: "Hola! \n\nTe informamos que tu clave ha sido actualizada exitosamente. \n\nTe nueva clave temporal es: " + req.body.clave + "\n\nSaludos,\n\nEl equipo de Contrátame Ya."
        };

        transporter.sendMail(recuperarEmail, (error, info) => {
            if (error) {
              console.log('Error al enviar el correo de notificación:', error);
            } else {
              console.log('Correo de notificación enviado:', info.response);
            }
        }); 
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
});


app.delete("/administrarEmpleados/:correo", async function (req, res) {
    console.log("Atendiendo solicitud DELETE /administrarEmpleados");

    const correoSeleccionadoDelete = req.params.correo; // Obtener el correo seleccionado desde los parámetros de la URL
    console.log("Correo seleccionado:", correoSeleccionadoDelete);
    

    try {
        console.log("Eliminando empleado de la base de datos");
        const empleadoEliminado = await UsuarioColaboradorModel.findOneAndDelete({ correo: correoSeleccionadoDelete });
        console.log("Empleado eliminado:", empleadoEliminado);


        res.status(200).json(empleadoEliminado);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json(error);
    }
});


app.post("/administrarEmpleados", async function (req, res) {
    console.log("Atendiendo solicitud POST /administrarEmpleados");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const invitacionEmpleado = UsuarioColaboradorModel({
        empresa: req.body.empresa,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        contrasena: req.body.contrasena,
        genero: req.body.genero,
        rol: req.body.rol,

    });

    console.log("Empleado a crear:", invitacionEmpleado);


    try {
        console.log("Creando empleado en la base de datos");
        const empleadoCreado = await UsuarioColaboradorModel.create(invitacionEmpleado);

  /*      const notificacionAdmin = {
            correoRecipiente: localStorage.getItem("userEmail"),
            titulo: "Se ha enviado una invitación a un nuevo empleado",
            mensaje: "Se ha enviado una invitación a" + req.body.nombre + " " + req.body.apellidos + " para que sea " + req.body.rol + " de la empresa " + req.body.empresa + ".",
          };
    
        await fetch("http://localhost:3000/notificaciones", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificacionAdmin),
        }); */

        const notificacionColaborador = {
            correoRecipiente: req.body.correo,
            titulo: "Te han invitado a ser parte de una empresa",
            mensaje: "Te han invitado a ser " + req.body.rol + " de la empresa " + req.body.empresa + ".",
          };
    
        await fetch("http://localhost:3000/notificaciones", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificacionColaborador),
        });

        const mailOptions = {
            from: 'contratame.ya.trabajos@gmail.com',
            to: req.body.correo,
            subject: `Invitación a ser ${req.body.rol} de ${req.body.empresa}`,
            text: `Hola ${req.body.nombre} ${req.body.apellidos}, te invitamos a ser ${req.body.rol} de la empresa ${req.body.empresa} en la plataforma Contrátame Ya. Para ingresar a la plataforma, utiliza el siguiente correo y contraseña: ${req.body.correo} y ${req.body.contrasena}. ¡Te esperamos!`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                alert("Error al enviar la invitación");
            } else {
                console.log('Cuerpo del correo enviado:', info.response);
            }
        });
        console.log("Empleado creado:", empleadoCreado);
        res.status(200).json(empleadoCreado);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json(error);
    }
});

app.get("/experiencia/:correo", async function (req, res) {
    try {
        console.log(req.params.correo);
        console.log("Consultando experiencias en la base de datos");
        const usuario = await UsuarioFinalModel.findOne({ correo: req.params.correo });
        console.log("Experiencias:", usuario.experiencia);
        res.status(200).json(usuario.experiencia);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Error al obtener las experiencias" });
    }
});


app.put("/experiencia/:correo", async function (req, res) {
    console.log("Atendiendo solicitud PUT /experiencia");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const correoSeleccionado = req.params.correo; // Obtener el correo seleccionado desde los parámetros de la URL
    console.log("Correo seleccionado:", correoSeleccionado);

    const experiencia = {
        id: generateUniqueId(),
        titulo: req.body.titulo,
        empresa: req.body.empresa,
        fechaInicio: req.body.fechaInicio,
        fechaFin: req.body.fechaFin,
        descripcion: req.body.descripcion,
    };

    try {
        console.log("Actualizando experiencia en la base de datos");
        const usuarioActualizado = await UsuarioFinalModel.findOneAndUpdate({ correo: correoSeleccionado }, { $push: { experiencia: experiencia } }, { new: true });
        console.log("Usuario actualizado:", usuarioActualizado);
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json(error);
    }
});

generateUniqueId = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
    return randomNumber.toString();
}


app.delete("/experiencia/:correo/:id", async function (req, res) {
    console.log("Atendiendo solicitud DELETE /experiencia");
  
    const correoSeleccionado = req.params.correo;
    console.log("Correo seleccionado:", correoSeleccionado);
  
    const idSeleccionado = parseInt(req.params.id);
    console.log("Id seleccionado:", idSeleccionado);
  
    try {
      console.log("Eliminando experiencia en la base de datos");
      const usuario = await UsuarioFinalModel.findOne({ correo: correoSeleccionado });
      
      if (!usuario) {
        console.log("Usuario no encontrado");
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // Find the index of the experiencia with the given ID in the array
      const experienciaIndex = usuario.experiencia.findIndex(exp => exp.id == idSeleccionado);
      console.log("Experiencia array:", usuario.experiencia);
        console.log("Experiencia index:", experienciaIndex);
  
      if (experienciaIndex === -1) {
        console.log("Experiencia no encontrada");
        return res.status(404).json({ message: "Experiencia no encontrada" });
      }
  
      // Use $pull to remove the experiencia with the given ID from the array
      usuario.experiencia.splice(experienciaIndex, 1);
  
      // Save the updated document
      const experienciaEliminada = await usuario.save();
  
      console.log("Experiencia eliminada:", experienciaEliminada);
      res.status(200).json(experienciaEliminada);
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json(error);
    }
  });
  

app.get("/educacion/:correo", async function (req, res) {
    console.log("Atendiendo solicitud GET /educacion");

    try {
        console.log("Consultando educacion en la base de datos");
        const usuario = await UsuarioFinalModel.findOne({ correo: req.params.correo });
        console.log("Educacion:", usuario.educacion);
        res.status(200).json(usuario.educacion);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: "Error al obtener la educacion" });
    }
});

app.put("/educacion/:correo", async function (req, res) {
    console.log("Atendiendo solicitud PUT /educacion");

    if (!req.body) {
        console.log("El cuerpo de la solicitud no tiene contenido");
        return res.status(400).send("El cuerpo de la solicitud no tiene contenido");
    }

    const correoSeleccionado = req.params.correo; // Obtener el correo seleccionado desde los parámetros de la URL
    console.log("Correo seleccionado:", correoSeleccionado);

    const educacion = {
        id: generateUniqueId(),
        nivelEducativo: req.body.nivelEducativo,
        institucion: req.body.institucion,
        fechaInicio: req.body.fechaInicio,
        fechaFin: req.body.fechaFin,
        descripcion: req.body.descripcion,
    };

    try {
        console.log("Actualizando educacion en la base de datos");
        const usuarioActualizado = await UsuarioFinalModel.findOneAndUpdate({ correo: correoSeleccionado }, { $push: { educacion: educacion } }, { new: true });
        console.log("Usuario actualizado:", usuarioActualizado);
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json(error);
    }
});

app.delete("/educacion/:correo/:id", async function (req, res) {
    console.log("Atendiendo solicitud DELETE /educacion");

    const correoSeleccionado = req.params.correo;
    console.log("Correo seleccionado:", correoSeleccionado);

    const idSeleccionado = parseInt(req.params.id);
    console.log("Id seleccionado:", idSeleccionado);

    try {
        console.log("Eliminando educacion en la base de datos");
        const usuario = await UsuarioFinalModel.findOne({ correo: correoSeleccionado });

        if (!usuario) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Find the index of the educacion with the given ID in the array
        const educacionIndex = usuario.educacion.findIndex(edu => edu.id == idSeleccionado);
        console.log("Educacion array:", usuario.educacion);
        console.log("Educacion index:", educacionIndex);

        if (educacionIndex === -1) {
            console.log("Educacion no encontrada");
            return res.status(404).json({ message: "Educacion no encontrada" });
        }

        // Use $pull to remove the educacion with the given ID from the array
        usuario.educacion.splice(educacionIndex, 1);

        // Save the updated document
        const educacionEliminada = await usuario.save();

        console.log("Educacion eliminada:", educacionEliminada);
        res.status(200).json(educacionEliminada);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json(error);
    }
});
  
app.put("/actualizarEstadoAplicacion/:id", async function (req, res) {
    console.log("Atendiendo solicitud PUT /actualizarEstadoAplicacion");

    const idSeleccionado = req.params.id; 
    console.log("Id seleccionado:", idSeleccionado);

    const estado = req.body.estadoAplicacion;
    console.log("Estado:", estado);

    try {
        console.log("Actualizando estado de aplicacion en la base de datos");

        const aplicacionActualizada = await Aplicaciones.findOneAndUpdate({_id: idSeleccionado}, { estadoAplicacion: estado }, { new: true });
        console.log("Aplicacion actualizada:", aplicacionActualizada);
        res.status(200).json(aplicacionActualizada);

        const notificacionUsuarioFinal = {
            correoRecipiente: aplicacionActualizada.correoAplicante,
            titulo: "Estado de aplicación actualizado",
            mensaje: "El estado de tu aplicación al puesto '" + aplicacionActualizada.nombrePuesto + "' ha sido actualizado a '" + estado + "'.",
            };

        await fetch("http://localhost:3000/notificaciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(notificacionUsuarioFinal),
        });

        const notificacionAdmin = {
            correoRecipiente: req.body.correoAdmin,
            titulo: "Estado de aplicación actualizado",
            mensaje: "El estado de la aplicación de " + aplicacionActualizada.nombreAplicante + " al puesto '" + aplicacionActualizada.nombrePuesto + "' ha sido actualizado a '" + estado + "'.",
            };

        await fetch("http://localhost:3000/notificaciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(notificacionAdmin),
        });

    } catch (error) {
        console.log("Error:", error);
        res.status(500).json(error);
    }
});

    

// Iniciar servidor

app.listen(3000, function proyecto() {
    console.log("Servidor escuchando en puerto 3000");
});