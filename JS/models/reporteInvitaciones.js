const mongoose = require('mongoose');
const ReporteInvitacionesSchema = new mongoose.Schema(
    {
        id : { type: Number, required: true },
        nombre: { type: String, required: true },
        apellido: { type: String, required: true },
        correo: { type: String, required: true },
        estado: { type: String, required: true },

    }
);

const Invitaciones = mongoose.model('Invitaciones', ReporteInvitacionesSchema);
module.exports = Invitaciones;