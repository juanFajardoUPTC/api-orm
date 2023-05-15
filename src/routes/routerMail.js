const express = require('express');
const router = express.Router();
const controllerMail = require('../controllers/mail');

router.get('/',controllerMail.getEstudiantesConInscripcionesActuales)
     
      ;
module.exports= router;