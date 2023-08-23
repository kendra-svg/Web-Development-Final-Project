const mongoose = require('mongoose');
const invitacionesPuestos = new mongoose.Schema({
    idPuesto: { type: String, required: true },
    nombrePuesto: { type: String, required: true },
    correoInvitado: { type: String, required: true },
    nombreAdministrador: { type: String, required: true },
    correoAdministrador: { type: String, required: true },
    empresa: { type: String, required: true },
}, { timestamps: true });

const InvitacionesPuestos = mongoose.model('invitacionesPuestos', invitacionesPuestos);
module.exports = InvitacionesPuestos;
