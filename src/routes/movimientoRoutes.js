const express = require('express');
const router = express.Router();
const movimientoController = require('../controllers/movimientoController');
const verificarToken = require('../middleware/authMiddleware'); // <--- IMPORTAR

router.post('/traslado', verificarToken, movimientoController.realizarTraslado);
router.get('/', verificarToken, movimientoController.obtenerHistorial);

module.exports = router;