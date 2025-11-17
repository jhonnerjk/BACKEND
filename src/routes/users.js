const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkToken = require('../middleware/checkToken');
const checkRole = require('../middleware/checkRole');

router.post('/', checkToken, checkRole.isAdmin, userController.createUser);
router.get('/', checkToken, checkRole.isAdmin, userController.getAllUsers);
router.patch('/:id', checkToken, checkRole.isAdmin, userController.updateUser);
router.get('/docentes', checkToken, userController.getDocentes);

module.exports = router;
