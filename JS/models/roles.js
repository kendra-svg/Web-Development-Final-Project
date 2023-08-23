const mongoose = require('mongoose');
const RolesSchema = new mongoose.Schema(
    {
        id : { type: Number, required: true },
        rol: { type: String, required: true }
    }
);

const Roles = mongoose.model('Roles', RolesSchema);
module.exports = Roles;
