const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'secreto_super_seguro';

const verificarToken = (req, res, next) => {
  // El token suele venir en el header: "Authorization: Bearer kjh345k3j45..."
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Sacamos la palabra "Bearer"

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No hay token.' });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.usuario = verified; // Guardamos los datos del usuario en la petición
    next(); // Dejamos pasar a la siguiente función
  } catch (error) {
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = verificarToken;