const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Realizar un Traslado (Mover de Bodega A -> Bodega B)
const realizarTraslado = async (req, res) => {
  const { 
    activo_id, 
    bodega_destino_id,  
    observacion 
  } = req.body;

  // Lo sacamos del token (gracias al middleware)
  const usuario_id = req.usuario.id;

  try {
    // 1. Validaciones previas (Lectura)
    const activo = await prisma.activos.findUnique({
      where: { id: parseInt(activo_id) }
    });

    if (!activo) {
      return res.status(404).json({ error: 'Activo no encontrado' });
    }

    if (activo.bodega_id === parseInt(bodega_destino_id)) {
      return res.status(400).json({ error: 'El activo ya se encuentra en esa bodega' });
    }

    // 2. LA TRANSACCIÓN (Escritura segura)
    const resultado = await prisma.$transaction(async (tx) => {
      
      // A. Crear la cabecera del movimiento
      const nuevoMovimiento = await tx.movimientos.create({
        data: {
          usuario_id: parseInt(usuario_id),
          tipo: 'TRASLADO', // Valor del ENUM
          observacion: observacion,
          fecha: new Date()
        }
      });

      // B. Crear el detalle del movimiento (Historial)
      await tx.detalles_movimiento.create({
        data: {
          movimiento_id: nuevoMovimiento.id,
          activo_id: parseInt(activo_id),
          bodega_origen_id: activo.bodega_id, // Tomamos la ubicación actual antes de cambiarla
          bodega_destino_id: parseInt(bodega_destino_id)
        }
      });

      // C. Actualizar la ubicación del activo
      const activoActualizado = await tx.activos.update({
        where: { id: parseInt(activo_id) },
        data: {
          bodega_id: parseInt(bodega_destino_id)
        }
      });

      return { movimiento: nuevoMovimiento, activo: activoActualizado };
    });

    // Si todo sale bien, respondemos
    res.json({
      message: 'Traslado exitoso',
      data: resultado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al realizar el traslado' });
  }
};

// Obtener historial de movimientos
const obtenerHistorial = async (req, res) => {
  try {
    const movimientos = await prisma.movimientos.findMany({
      include: {
        usuarios: true, 
        // Incluimos los detalles
        detalles_movimiento: {
          include: {
            activos: true,
            bodegas_detalles_movimiento_bodega_origen_idTobodegas: true, // Nombres largos que genera Prisma por tener 2 relaciones a la misma tabla
            bodegas_detalles_movimiento_bodega_destino_idTobodegas: true
          }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    });
    res.json(movimientos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};

module.exports = {
  realizarTraslado,
  obtenerHistorial
};