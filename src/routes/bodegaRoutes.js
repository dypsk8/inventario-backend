const express = require('express');
const router = express.Router();
const bodegaController = require('../controllers/bodegaController');

// Definir las rutas
router.get('/', bodegaController.obtenerBodegas);       // GET /api/bodegas
router.post('/', bodegaController.crearBodega);         // POST /api/bodegas
router.put('/:id', bodegaController.actualizarBodega);  // PUT /api/bodegas/1
router.delete('/:id', bodegaController.eliminarBodega); // DELETE /api/bodegas/1

module.exports = router;