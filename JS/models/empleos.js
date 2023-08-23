const mongoose = require('mongoose');
const EmpleosSchema = new mongoose.Schema(
    {
        empresa: { type: String, required: true },
        titulo: { type: String, required: true },
        visibilidad: { type: String, required: true },
        rangoSalarialID: { type: Number, required: true },
        rangoSalarial: { type: String, required: true },
        requisitosMinimos: { type: String, required: true },
        requisitosDeseados: { type: String, required: true },
        correoGerente: { type: String, required: true },
    },
    { 
        timestamps: true, 
    }
);

const Empleos = mongoose.model('Empleos', EmpleosSchema);
module.exports = Empleos;