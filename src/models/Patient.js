const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    nombreCompleto: { type: String, required: true },
    ci: { type: String, required: true, unique: true },
    fechaNacimiento: { type: Date, required: true },
    telefono: { type: String }
});

module.exports = mongoose.model('Patient', PatientSchema);