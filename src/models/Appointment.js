const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    medico: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    motivo: { type: String },
    estado: {
        type: String,
        enum: ['PROGRAMADO', 'ATENDIDO', 'AUSENTE', 'CANCELADO'],
        default: 'PROGRAMADO'
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);