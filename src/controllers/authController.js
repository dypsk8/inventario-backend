const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secreto_super_seguro'; // Lo ideal es poner esto en .env

// 1. Registrar usuario 
const registro = async (req, res) => {
  const { nombre_completo, email, password, rol_id } = req.body;

  try {
    // Verificar si ya existe
    const usuarioExiste = await prisma.usuarios.findUnique({ where: { email } });
    if (usuarioExiste) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario
    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        nombre_completo,
        email,
        password: passwordHash,
        rol_id: parseInt(rol_id) // Asegúrate de tener roles creados (1=Admin, etc)
      }
    });

    res.status(201).json({ message: 'Usuario creado exitosamente' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// 2. Iniciar Sesión (Login)
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario
    const usuario = await prisma.usuarios.findUnique({ 
        where: { email },
        // CORRECCIÓN 1: Prisma llama a la relación 'roles' (plural), no 'rol'
        include: { roles: true } 
    });
    
    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Generar Token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        // CORRECCIÓN 2: Accedemos a .roles (plural) porque así lo llamamos arriba
        rol: usuario.roles?.nombre 
      },
      SECRET_KEY,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre_completo,
        // CORRECCIÓN 3: Aquí también ajustamos para la respuesta
        rol: usuario.roles?.nombre
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error en el login' });
  }
};

module.exports = { registro, login };