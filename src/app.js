const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const path = require("path");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma =new PrismaClient()

//config
app.set('port', process.env.PORT || 3000);

//static
app.use(express.static(path.join(__dirname,'public')));

//start
app.get("/",(req,res)=>{
    res.json({msg:"hola perra"})
})

app.post('/estudiantes', async (req, res) => {
    try {
      const estudiante = await prisma.estudiantes.create({
        data: {
          codigo: req.body.codigo,
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          tipo_documento: req.body.tipo_documento,
          numero_documento: req.body.numero_documento,
          estado: req.body.estado,
          genero: req.body.genero
        }
      });
      res.json(estudiante);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear el estudiante');
    }
  });



const server = app.listen(app.get('port'),()=>{
    console.log('Funciona en puerto: ', app.get('port'));
});