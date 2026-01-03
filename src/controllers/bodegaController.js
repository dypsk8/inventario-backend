const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Obtener todas las bodegas (Solo las activas)
const obtenerBodegas = async (req, res) => {
  try {
    const bodegas = await prisma.bodegas.findMany({
      where: { activa: true } // Filtramos para no mostrar las eliminadas
    });
    res.json(bodegas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener bodegas' });
  }
};

// 2. Crear una nueva bodega
const crearBodega = async (req, res) => {
  const { nombre, ubicacion } = req.body; // Recibimos datos del frontend

  try {
    const nuevaBodega = await prisma.bodegas.create({
      data: {
        nombre,
        ubicacion
      }
    });
    res.status(201).json(nuevaBodega);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la bodega' });
  }
};

// 3. Actualizar una bodega
const actualizarBodega = async (req, res) => {
  const { id } = req.params; // El ID viene en la URL
  const { nombre, ubicacion } = req.body;

  try {
    const bodegaActualizada = await prisma.bodegas.update({
      where: { id: parseInt(id) }, // Convertimos el ID de texto a número
      data: { nombre, ubicacion }
    });
    res.json(bodegaActualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la bodega' });
  }
};

// 4. Eliminar bodega (Borrado Lógico)
const eliminarBodega = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.bodegas.update({
      where: { id: parseInt(id) },
      data: { activa: false } // No borramos, solo desactivamos
    });
    res.json({ message: 'Bodega eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar la bodega' });
  }
};

module.exports = {
  obtenerBodegas,
  crearBodega,
  actualizarBodega,
  eliminarBodega
};