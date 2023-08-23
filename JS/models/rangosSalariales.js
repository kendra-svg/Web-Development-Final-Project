const mongoose = require('mongoose');
const RangosSalarialesSchema = new mongoose.Schema(
    {
        id : { type: Number, required: true },
        rangoSalarial: { type: String, required: true }
    }
);

const RangosSalariales = mongoose.model('RangosSalariales', RangosSalarialesSchema);
module.exports = RangosSalariales;