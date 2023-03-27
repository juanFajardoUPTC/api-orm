const express =require("express");
const router = express.router();
const controllersInscripxiones = require('../controllers/inscripciones');

router.get('/',controllersInscripxiones.getInscripciones)
      .post('/:agregar',controllersInscripxiones.postAgrearInscripcion)
      .put('/:actualizar',controllersInscripxiones.putActualizarInscripcion)
      .patch(':/cambiar-fecha',controllersInscripxiones.patchtcambiarFecha)
;