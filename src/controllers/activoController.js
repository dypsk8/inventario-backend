const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Obtener TODOS los activos (Sin filtros, el Frontend se encarga)
const obtenerActivos = async (req, res) => {
  try {
    const activos = await prisma.activos.findMany({
      include: {
        categorias: true, // Relación con Categorías
        bodegas: true     // Relación con Bodegas
      }
    });
    
    // Mapeo opcional para limpiar el JSON (singularizar nombres)
    const activosLimpios = activos.map(activo => ({
      ...activo,
      categoria: activo.categorias,
      bodega: activo.bodegas,
      categorias: undefined,
      bodegas: undefined
    }));

    res.json(activosLimpios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener activos' });
  }
};

// 2. Crear activo
const crearActivo = async (req, res) => {
  const { 
    codigo, nombre, descripcion, categoria_id, bodega_id, valor_compra, fecha_adquisicion 
  } = req.body;

  try {
    const nuevoActivo = await prisma.activos.create({
      data: {
        codigo,
        nombre,
        descripcion,
        categoria_id: parseInt(categoria_id),
        bodega_id: parseInt(bodega_id),
        valor_compra: parseFloat(valor_compra),
        fecha_adquisicion: new Date(fecha_adquisicion),
        estado: 'DISPONIBLE'
      }
    });
    res.status(201).json(nuevoActivo);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'El código del activo ya existe.' });
    }
    res.status(400).json({ error: 'Error al crear el activo.' });
  }
};

// 3. Buscar por ID
const obtenerActivoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const activo = await prisma.activos.findUnique({
      where: { id: parseInt(id) },
      include: { categorias: true, bodegas: true }
    });
    if (!activo) return res.status(404).json({ error: 'Activo no encontrado' });
    res.json(activo);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el activo' });
  }
};

// 4. Actualizar activo
const actualizarActivo = async (req, res) => {
  const { id } = req.params;
  const datos = req.body;

  try {
    // Conversiones de seguridad
    if (datos.fecha_adquisicion) datos.fecha_adquisicion = new Date(datos.fecha_adquisicion);
    if (datos.valor_compra) datos.valor_compra = parseFloat(datos.valor_compra);
    if (datos.categoria_id) datos.categoria_id = parseInt(datos.categoria_id);
    if (datos.bodega_id) datos.bodega_id = parseInt(datos.bodega_id);

    const activoActualizado = await prisma.activos.update({
      where: { id: parseInt(id) },
      data: datos
    });
    res.json(activoActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el activo' });
  }
};

// 5. DAR DE BAJA (Soft Delete)
// Actualiza el estado a 'BAJA' en lugar de borrar el registro
const eliminarActivo = async (req, res) => {
  const { id } = req.params;

  try {
    const activoBaja = await prisma.activos.update({
      where: { id: parseInt(id) },
      data: {
        estado: 'BAJA' // Esto debe coincidir con tu ENUM en Postgres
      }
    });
    res.json({ message: 'Activo dado de baja', activo: activoBaja });
  } catch (error) {
    res.status(400).json({ error: 'Error al dar de baja el activo' });
  }
};

module.exports = {
  obtenerActivos,
  crearActivo,
  obtenerActivoPorId,
  actualizarActivo,
  eliminarActivo
};