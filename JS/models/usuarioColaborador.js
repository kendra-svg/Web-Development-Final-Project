const mongoose = require("mongoose");
const usuarioColaboradorSchema = new mongoose.Schema({
    empresa: { type: String, required: true },
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
    genero: { type: String, required: true },
    rol : { type: String, required: true },
    fotoPerfil: { type: String, required: true },
});

const UsuarioColaboradorModel = mongoose.model("usuarioColaborador", usuarioColaboradorSchema);
module.exports = UsuarioColaboradorModel;
