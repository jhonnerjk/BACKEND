const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    recurso: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    solicitante: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    proposito: { type: String, required: true },
    estado: {
        type: String,
        enum: ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'FINALIZADA'],
        default: 'PENDIENTE'
    },
    motivoRechazo: { type: String },
    aprobadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);