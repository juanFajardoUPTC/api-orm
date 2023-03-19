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

//static
app.use(express.static(path.join(__dirname, 'public')));

//start
////obtener lista de estudantes ya esta listo
app.get("/estudiantes", async (req, res) => {
    try{
        const estudiantes= await prisma.estudiantes.findMany();
        res.json({ estudiantes })
    }catch(error){
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener la lista de estudiantes" });
    }
    
})

//ya esta listo
app.post("/estudiantes/agregar", async (req, res) => {
    try {
        console.log(req.body);
        const estudiante = await prisma.estudiantes.create({
            data: req.body
        })
        res.json({ msg: "creado", estudiante })
    } catch (error) {
        console.error(error);
        // Si el error se debe a que se violó una restricción única, responder con un mensaje específico
        if (error.code === "P2002") {
            res.status(400).json({ mensaje: "Ya existe un estudiante con el mismo código o número de documento" });
        } else {
            res.status(500).json({ mensaje: "Error al crear el estudiante" });
        }
    }
})


app.patch("/estudiantes/cambiar-estado", async(req,res) =>{
    try{
        console.log('Cuerpo',req.body);
        const codigo = Number(req.body.codigo);
        const estado= req.body.estado;
        const estudiante = await prisma.estudiantes.update({
            where:{ codigo: codigo },
            data:{estado: estado}
        })
        res.json({ msg: "estado actualizado", estudiante })
    }catch (error){
        console.error(error);
        if (error.code === "P2025") {
            res.status(404).json({ mensaje: `No se encontró un estudiante con el código ${req.params.codigo}` });
        } else {
         res.status(500).json({ mensaje: "Error al actualizar ESTADO el estudiante" });
        }
    }
})
app.put("/estudiantes/actualizar",async(req,res)=>{
    try{
        console.log(req.body);
        const codigo = req.body.codigo;
        delete req.body.codigo;
        const estudiante = await prisma.estudiantes.upsert({
            where: { codigo: codigo },
            create: req.body,
            update: req.body, 
        })
        res.json({ msg: "estudiante actualizado", estudiante })
    }catch (error){
        console.error(error);
        if (error.code === "P2025") {
            res.status(404).json({ mensaje: `No se encontró un estudiante con el código ${req.params.codigo}` });
        } else {
         res.status(500).json({ mensaje: "Error al actualizar estudiante" });
        }
    }
})
const server = app.listen(app.get('port'), () => {
    console.log('Funciona en puerto: ', app.get('port'));
});
