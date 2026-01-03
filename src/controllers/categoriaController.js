const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categorias.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// 2. Crear una categoría
const crearCategoria = async (req, res) => {
  const { nombre, prefijo } = req.body;

  if (!nombre || !prefijo) {
    return res.status(400).json({ error: 'Nombre y prefijo son obligatorios' });
  }

  try {
    const nuevaCategoria = await prisma.categorias.create({
      data: {
        nombre,
        prefijo: prefijo.toUpperCase() // Guardamos siempre en mayúsculas (ej: "LPT")
      }
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear categoría (quizás el nombre ya existe)' });
  }
};

// 3. Eliminar categoría
const eliminarCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    // OJO: Si intentas borrar una categoría que ya tiene activos asignados,
    // Prisma/Postgres lanzará un error de "Foreign Key Constraint".
    await prisma.categorias.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    // Código de error P2003 en Prisma significa violación de clave foránea
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'No se puede eliminar: Hay activos usando esta categoría.' });
    }
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};

module.exports = {
  obtenerCategorias,
  crearCategoria,
  eliminarCategoria
};