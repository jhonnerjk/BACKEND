const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const checkToken = require('../middleware/checkToken');
const checkRole = require('../middleware/checkRole');

// Solo recepcionista y admin pueden gestionar pacientes
router.post('/', checkToken, checkRole.isReceptionist, patientController.createPatient);
router.get('/', checkToken, patientController.getAllPatients);
router.get('/:id', checkToken, patientController.getPatientById);
router.put('/:id', checkToken, checkRole.isReceptionist, patientController.updatePatient);
router.delete('/:id', checkToken, checkRole.isAdmin, patientController.deletePatient);

module.exports = router;
