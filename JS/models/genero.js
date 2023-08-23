const mongoose = require('mongoose');
const GenerosSchema = new mongoose.Schema(
    {
        id : { type: Number, required: true, unique: true },
        genero: { type: String, required: true, unique: true }
    },
    { 
        timestamps: true, 
    }
);

const Generos = mongoose.model('Generos', GenerosSchema);
module.exports = Generos;