const mongoose = require('mongoose');
const NotificacionesSchema = new mongoose.Schema(
    {
        correoRecipiente: { type: String, required: true },
        titulo: { type: String, required: true },
        mensaje: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Notificaciones = mongoose.model('Notificaciones', NotificacionesSchema);
module.exports = Notificaciones;