const mongoose = require('mongoose');
const AdminsSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true, unique: true },
        correo: { type: String, required: true, unique: true },
        contrasena: { type: String, required: true },
        descripcion: { type: String, required: false },
        fotoPerfil: { type: String, required: false },
    },
    {
        timestamps: true,
    }
);

const Admins = mongoose.model('Admins', AdminsSchema);
module.exports = Admins;