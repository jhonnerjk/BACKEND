const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkToken = require('../middleware/checkToken');
const checkRole = require('../middleware/checkRole');

//crear usuario
router.post('/', checkToken, checkRole.isAdmin, userController.createUser);

//ver usuarios (solo admin)
router.get('/', checkToken, checkRole.isAdmin, userController.getAllUsers);

//ver solo médicos (recepcionista y admin)
router.get('/doctors', checkToken, userController.getDoctors);

module.exports = router;
