const mongoose = require('mongoose');
const usuarioFinalSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true },
        apellidos : { type: String, required: true },
        clave : { type: String, required: true },
        correo : { type: String, required: true, unique: true },
        genero: { type: String, required: true },
        experiencia: { type: Array, required: true },
        educacion : { type: Array, required: true },
        fotoPerfil : { type: String, required: false },
        curriculum : { type: String, required: false },
    }
);

const UsuarioFinalModel = mongoose.model('UsuarioFinal', usuarioFinalSchema);
module.exports = UsuarioFinalModel;
