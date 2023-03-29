const express = require('express');
const router = express.Router();
const controllersMaterias= require('../controllers/materias');
const { post } = require('./routerEstudiantes');

router.get('/',controllersMaterias.getMaterias)
      .post('/:agregar',controllersMaterias.postAgrearMaterias)
      .patch('/:cambiar-estado',controllersMaterias.patchtcambiarEstado)
      .put('/:actualizar',controllersMaterias.putActualizar)
      ;
module.exports= router;