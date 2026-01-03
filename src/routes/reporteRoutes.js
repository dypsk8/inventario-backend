const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

// Podríamos protegerla con 'verificarToken' si quieres que solo usuarios logueados descarguen
const verificarToken = require('../middleware/authMiddleware');

router.get('/inventario', verificarToken, reporteController.generarReporteInventario);

module.exports = router;