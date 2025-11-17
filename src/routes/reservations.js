const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const checkToken = require('../middleware/checkToken');
const checkRole = require('../middleware/checkRole');

router.post('/', checkToken, checkRole.isDocente, reservationController.createReservation);
router.get('/', checkToken, reservationController.getAllReservations);
router.get('/my-reservations', checkToken, checkRole.isDocente, reservationController.getMyReservations);
router.get('/:id', checkToken, reservationController.getReservationById);
router.patch('/:id/status', checkToken, checkRole.isGestor, reservationController.updateReservationStatus);
router.put('/:id', checkToken, reservationController.updateReservation);
router.delete('/:id', checkToken, reservationController.deleteReservation);

module.exports = router;
