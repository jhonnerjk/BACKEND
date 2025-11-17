const Appointment = require('../models/Appointment');

// Crear turno (solo recepcionista)
exports.createAppointment = async (req, res) => {
    const { patient, medico, fecha, hora, motivo } = req.body;
    try {
        const newAppointment = new Appointment({ patient, medico, fecha, hora, motivo });
        await newAppointment.save();
        res.status(201).json({ message: 'Turno creado exitosamente.', appointment: newAppointment });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

// Obtener todos los turnos (con filtros opcionales)
exports.getAllAppointments = async (req, res) => {
    try {
        const { medico, estado } = req.query;
        let filter = {};
        
        if (medico) filter.medico = medico;
        if (estado) filter.estado = estado;

        const appointments = await Appointment.find(filter)
            .populate('patient', 'nombreCompleto ci')
            .populate('medico', 'email role');
        
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

// Obtener turnos de un médico específico
exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ medico: req.user.userId })
            .populate('patient', 'nombreCompleto ci telefono');
        
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

// Obtener un turno por ID
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'nombreCompleto ci telefono')
            .populate('medico', 'email');
        
        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado.' });
        }
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

// Actualizar turno (recepcionista puede modificar todo, médico solo el estado)
exports.updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado.' });
        }

        // Si es médico, solo puede actualizar sus propios turnos y solo el estado
        if (req.user.role === 'medico') {
            if (appointment.medico.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'No puedes modificar turnos de otros médicos.' });
            }
            // Solo puede cambiar el estado
            if (req.body.estado) {
                appointment.estado = req.body.estado;
            }
        } else if (req.user.role === 'recepcionista') {
            // Recepcionista puede actualizar cualquier campo
            Object.assign(appointment, req.body);
        }

        await appointment.save();
        res.json({ message: 'Turno actualizado exitosamente.', appointment });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

// Cancelar turno (recepcionista)
exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { estado: 'CANCELADO' },
            { new: true }
        );
        
        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado.' });
        }
        
        res.json({ message: 'Turno cancelado exitosamente.', appointment });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

// Eliminar turno (solo admin)
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado.' });
        }
        res.json({ message: 'Turno eliminado exitosamente.' });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};
