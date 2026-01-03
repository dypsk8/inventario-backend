const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/', categoriaController.obtenerCategorias);
router.post('/', categoriaController.crearCategoria);
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;