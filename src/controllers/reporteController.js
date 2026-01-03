const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PDFDocument = require('pdfkit');

const generarReporteInventario = async (req, res) => {
  try {
    // 1. Obtener datos de la BD
    const activos = await prisma.activos.findMany({
      include: {
        bodegas: true,
        categorias: true
      },
      orderBy: {
        bodega_id: 'asc' // Ordenados por bodega para que se vea organizado
      }
    });

    // 2. Configurar el PDF
    const doc = new PDFDocument({ margin: 50 });

    // Configurar cabeceras de respuesta HTTP para que el navegador sepa que es un PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=reporte_inventario.pdf');

    // Conectar el PDF a la respuesta (Pipe)
    doc.pipe(res);

    // --- DISEÑO DEL REPORTE ---

    // Encabezado
    doc.fontSize(20).text('Reporte General de Activos Fijos', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown(2);

    // Cabecera de la Tabla (Dibujamos una línea y los títulos)
    const tableTop = 150;
    const codigoX = 50;
    const nombreX = 150;
    const bodegaX = 350;
    const estadoX = 500;

    doc.font('Helvetica-Bold');
    doc.text('CÓDIGO', codigoX, tableTop);
    doc.text('NOMBRE DEL ACTIVO', nombreX, tableTop);
    doc.text('UBICACIÓN', bodegaX, tableTop);
    doc.text('ESTADO', estadoX, tableTop);

    // Línea separadora
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Cuerpo de la Tabla (Los datos)
    let currentY = tableTop + 30;
    doc.font('Helvetica');

    activos.forEach((activo) => {
      // Si llegamos al final de la hoja, agregamos una nueva
      if (currentY > 700) {
        doc.addPage();
        currentY = 50; // Reiniciar posición Y
      }

      const nombreBodega = activo.bodegas ? activo.bodegas.nombre : 'Sin Asignar';
      const nombreActivo = activo.nombre.substring(0, 25); // Cortar nombres muy largos

      doc.text(activo.codigo, codigoX, currentY);
      doc.text(nombreActivo, nombreX, currentY);
      doc.text(nombreBodega, bodegaX, currentY);
      doc.text(activo.estado, estadoX, currentY);

      currentY += 20; // Bajar 20px para la siguiente fila
    });

    // Pie de página con total
    doc.moveDown(2);
    doc.font('Helvetica-Bold').text(`Total de Activos: ${activos.length}`, { align: 'right' });

    // 3. Finalizar el documento
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar el reporte' });
  }
};

module.exports = { generarReporteInventario };