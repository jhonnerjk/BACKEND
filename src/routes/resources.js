const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const checkToken = require('../middleware/checkToken');
const checkRole = require('../middleware/checkRole');

router.post('/', checkToken, checkRole.isGestor, resourceController.createResource);
router.get('/', checkToken, resourceController.getAllResources);
router.get('/:id', checkToken, resourceController.getResourceById);
router.put('/:id', checkToken, checkRole.isGestor, resourceController.updateResource);
router.delete('/:id', checkToken, checkRole.isAdmin, resourceController.deleteResource);

module.exports = router;
