const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares (Configuraciones)
app.use(cors()); // Permite peticiones de otros dominios
app.use(express.json()); // Permite que el servidor entienda JSON

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a la API de Inventario' });
});

// Aquí importamos las rutas
app.use('/api/bodegas', require('./routes/bodegaRoutes'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));
app.use('/api/activos', require('./routes/activoRoutes'));
app.use('/api/movimientos', require('./routes/movimientoRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reportes', require('./routes/reporteRoutes'));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});