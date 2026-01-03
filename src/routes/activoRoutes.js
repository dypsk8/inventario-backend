const express = require('express');
const router = express.Router();
const activoController = require('../controllers/activoController');

router.get('/', activoController.obtenerActivos);
router.post('/', activoController.crearActivo);
router.get('/:id', activoController.obtenerActivoPorId);
router.put('/:id', activoController.actualizarActivo);
router.delete('/:id', activoController.eliminarActivo);

module.exports = router;