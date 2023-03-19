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
    res.json({msg:"hola perra BEBE"})
})
// Crear un nuevo estudiante
app.post('/estudiantes/crear', async (req, res) => {
    try{
    console.log(req.body);
    const { nombre, apellido, tipo_documento, numero_documento, estado, genero } = req.body;
    const student = await prisma.estudiantes.create({
        data:{
            nombre,
            apellido,
            tipo_documento,
            numero_documento,
            estado,
            genero
        },
    })
    res.json({msg:"estudiante creado",estudiantes:student})
    }catch(error){
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear el estudiante' });
    }
});

// Editar un estudiante existente
app.put('/estudiantes/:id', async (req, res) => {
  const estudianteActualizado = await prisma.estudiantes.update({
    where: { codigo: parseInt(req.params.id) },
    data: {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      tipo_documento: req.body.tipo_documento,
      numero_documento: req.body.numero_documento,
      genero: req.body.genero
    }
  });
  res.json(estudianteActualizado);
});

// Desactivar un estudiante
app.delete('/estudiantes/:id', async (req, res) => {
  const estudianteDesactivado = await prisma.estudiantes.update({
    where: { codigo: parseInt(req.params.id) },
    data: {
      estado: 0
    }
  });
  res.json(estudianteDesactivado);
});

// Listar todos los estudiantes
app.get('/estudiantes', async (req, res) => {
  const estudiantes = await prisma.estudiantes.findMany();
  res.json(estudiantes);
});

const server = app.listen(app.get('port'),()=>{
    console.log('Funciona en puerto: ', app.get('port'));
});