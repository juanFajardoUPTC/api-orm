const express = require('express');
const router = express.Router();
const controllersEstudiantes= require('../controllers/estudiantes');
const authenticateToken = require('../controllers/auth');

router.get('/', authenticateToken,controllersEstudiantes.getEstudiantes)
      .post('/:agregar', controllersEstudiantes.postAgrearEstudiante)
      .patch('/:cambiar-estado',controllersEstudiantes.patchtcambiarEstado)
      .put('/:actualizar',controllersEstudiantes.putActualizar)
      .get('/:filtro',controllersEstudiantes.getFiltro);
module.exports = router;                            