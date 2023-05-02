const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
  try {
    const allUsers = await prisma.usuarios.findMany()
    res.json(allUsers);
  } catch (error) {
    res.status(500);
    res.send('Usuarios no econtrados/error');
  }
};

const postCreateUser = async (req, res) => {
  try {

    const { nombre_usuario, correo_electronico, estado, credenciales } = req.body;
    if (!nombre_usuario || !correo_electronico || !estado || !credenciales) {
      res.status(400).send('Los parámetros requeridos no están presentes');
      return;
    }
    console.log('entre ');
    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.usuarios.findFirst({
      where: {
        correo_electronico: correo_electronico,
      },
    });

    if (usuarioExistente) {
      res.status(400).json({ error: 'Ya existe un usuario con este correo electrónico' });
      return;
    }
    // Crear el usuario
    const usuarioCreado = await prisma.usuarios.create({
      data: {
        nombre_usuario,
        correo_electronico,
        estado,
      },
    });
    // Crear las credenciales
    const usuer = await prisma.usuario
    const credencialesCreadas = await prisma.credenciales.create({
      data: {
        usuario: nombre_usuario,
        contrasena: await bcrypt.hash(credenciales.contrasena, saltRounds)
      },
    });
    // Devolver una respuesta JSON con el usuario creado
    res.status(201).json({
      message: 'Usuario creado correctamente',
      body: {
        user: { nombre_usuario, correo_electronico, estado, credenciales: credencialesCreadas },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Usuario no creado' });
  }
};

/**generea metodo para verificar la sesion con la tabla credenciales y genera un jwt */
const postLogin = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;
    if (!usuario || !contrasena) {
      res.status(400).send('Los parámetros requeridos no están presentes');
      return;
    }
    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.credenciales.findFirst({
      where: {
        usuario: usuario,
      },
    });
    if (!usuarioExistente) {
      res.status(400).json({ error: 'Usuario no Registado/o usuario incorrecto' });
      return;
    }
    // Verificar si la contraseña es correcta
    const contrasenaCorrecta = await bcrypt.compare(contrasena, usuarioExistente.contrasena);
    if (!contrasenaCorrecta) {
      res.status(400).json({ error: 'Contraseña incorrecta' });
      return;
    }
    // Crear el token 
    const token = jwt.sign(
      {
        usuario: usuarioExistente.usuario,
        id: usuarioExistente.id,
        contrasena:usuarioExistente.contrasena
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '60s',
      }
    );
    // Devolver una respuesta JSON con el usuario creado
    res.status(201).json({
      message: 'Usuario creado correctamente',
      body: {
        user: { usuarioExistente, token },
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sesion incorrecta/token no generado' });
  }
};
/**genere el metodod para autenticar el jwt y dar accedo a otras rutas */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    if (new Date(user.exp * 1000) < new Date()) {
      console.log('TOKEN EXPIRADO');
      return res.sendStatus(401);
    }
    console.log('TOKEN VIGENTE');
    req.user = user;
    next();
  });
};


module.exports = {
  getUsers,
  postCreateUser,
  postLogin,
  authenticateToken
}