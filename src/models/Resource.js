const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipo: { 
        type: String, 
        required: true,
        enum: ['SALA', 'EQUIPO']
    },
    capacidad: { type: Number }, // Solo para salas
    estado: {
        type: String,
        enum: ['DISPONIBLE', 'FUERA_DE_SERVICIO'],
        default: 'DISPONIBLE'
    },
    descripcion: { type: String },
    ubicacion: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);