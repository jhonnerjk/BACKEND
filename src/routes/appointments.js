const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const checkToken = require('../middleware/checkToken');
const checkRole = require('../middleware/checkRole');

// Crear turno (solo recepcionista)
router.post('/', checkToken, checkRole.isReceptionist, appointmentController.createAppointment);

// Ver todos los turnos (con filtros)
router.get('/', checkToken, appointmentController.getAllAppointments);

// Ver mis turnos (médico)
router.get('/my-appointments', checkToken, checkRole.isMedico, appointmentController.getMyAppointments);

// Ver turno específico
router.get('/:id', checkToken, appointmentController.getAppointmentById);

// Actualizar turno (recepcionista: todo, médico: solo estado)
router.put('/:id', checkToken, appointmentController.updateAppointment);

// Cancelar turno (recepcionista)
router.put('/:id/cancel', checkToken, checkRole.isReceptionist, appointmentController.cancelAppointment);

// Eliminar turno (solo admin)
router.delete('/:id', checkToken, checkRole.isAdmin, appointmentController.deleteAppointment);

module.exports = router;
