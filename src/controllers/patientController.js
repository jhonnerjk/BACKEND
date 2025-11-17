const Patient = require('../models/Patient');

// Crear paciente
exports.createPatient = async (req, res) => {
    const { nombreCompleto, ci, fechaNacimiento, telefono } = req.body;
    try {
        const existingPatient = await Patient.findOne({ ci });
        if (existingPatient) {
            return res.status(400).json({ message: 'Ya existe un paciente con ese CI.' });
        }

        const newPatient = new Patient({ nombreCompleto, ci, fechaNacimiento, telefono });
        await newPatient.save();
        res.status(201).json({ message: 'Paciente creado exitosamente.', patient: newPatient });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

// Obtener todos los pacientes
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

// Obtener un paciente por ID
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado.' });
        }
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

// Actualizar paciente
exports.updatePatient = async (req, res) => {
    const { nombreCompleto, ci, fechaNacimiento, telefono } = req.body;
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { nombreCompleto, ci, fechaNacimiento, telefono },
            { new: true, runValidators: true }
        );
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado.' });
        }
        res.json({ message: 'Paciente actualizado exitosamente.', patient });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};

// Eliminar paciente
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado.' });
        }
        res.json({ message: 'Paciente eliminado exitosamente.' });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor.', error: err.message });
    }
};
