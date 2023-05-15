const express = require("express");
// const req = require("express/lib/request");
// const res = require("express/lib/response");
const path = require("path");
const app = express();

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//config
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

const workEstiantes= require('./routes/routerEstudiantes');
const workMaterias= require('./routes/routerMaterias');
const workIncripciones= require('./routes/routerInscripciones');
const workUsuarios= require('./routes/routerUsuarios');
const workMail= require('./routes/routerMail');

app.use('/estudiantes',workEstiantes);
app.use('/materias',workMaterias);
app.use('/inscripciones',workIncripciones);
app.use('/usuarios',workUsuarios);
app.use('/mail',workMail);

const server = app.listen(app.get('port'), () => {
    console.log('Funciona en puerto: ', app.get('port'));
});