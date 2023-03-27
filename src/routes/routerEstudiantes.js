const express = require('express');
const router = express.Router();
const controllersEstudiantes= require('../controllers/estudiantes');

router.get('/', controllersEstudiantes.getEstudiantes)
      .post('/:agregar', controllersEstudiantes.postAgrearEstudiante)
      .patch('/:cambiar-estado',controllersEstudiantes.patchtcambiarEstado)
      .put('/:actualizar',controllersEstudiantes.putActualizar)
      .get('/:orden',controllersEstudiantes.getOrden)
      .get('/:filtro',controllersEstudiantes.getFiltro);
module.exports = router;                            