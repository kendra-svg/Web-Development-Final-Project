const mongoose = require('mongoose');
const AplicacionesSchema = new mongoose.Schema(
    {
        nombrePuesto : { type: String, required: true },
        nombreAplicante: { type: String, required: true },
        correoAplicante: { type: String, required: true},
        estadoAplicacion: { type: String, required: true },
        requisitosMinimos: { type: String, required: true },
        requisitosDeseados: { type: String, required: true },
        empresa: { type: String, required: true },
        cvAplicante: { type: String, required: true },
    } ,
    {
        timestamps: true,
    }
);

const Aplicaciones = mongoose.model('Aplicaciones', AplicacionesSchema);
module.exports = Aplicaciones;
