const express =require("express");
const router = express.Router();
const controllersUsuarios = require('../controllers/usuarios');

router.get('/',controllersUsuarios.getUsers)
      .post('/crear',controllersUsuarios.postCreateUser)
      .post('/login',controllersUsuarios.postLogin)
      /**llama a autenticar */
      .post('/autenticar',controllersUsuarios.authenticateToken)
      
      ;
module.exports= router;