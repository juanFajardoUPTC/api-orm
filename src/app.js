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
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

const workEstiantes= require('./routes/routerEstudiantes');
const workMaterias= require('./routes/routerMaterias');
app.use('/estudiantes',workEstiantes);
app.use('/materias',workMaterias);


const server = app.listen(app.get('port'), () => {
    console.log('Funciona en puerto: ', app.get('port'));
});