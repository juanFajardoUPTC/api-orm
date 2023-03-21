const express = require('express');
const { PrismaClient } = require('@prisma/client')  //importa el constructor de prisma clienet desde el moduloulo "'@prisma/client'"



const prisma = new PrismaClient() //instancia 
const app = express()


app.use(express.json()) //middleware convierte de json a javascrid 



app.get('/',(req,res) => {
    res.send('Prueba')
}
)


app.get("/estudiantes", async (req, res) => {
    try{
        const estudiantes= await prisma.estudiantes.findMany();
        res.json({ estudiantes })
    }catch(error){
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener la lista de estudiantes" });
    }
    
})


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
        const codigo = req.body.codigo
        delete req.body.codigo
        const estudiante = await prisma.estudiantes.upsert({
            where: { codigo: codigo },
            update: req.body,
            create: req.body
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

//---------------------------------------materias-------------------------------------------

app.get("/materias", async (req, res) => {
    try {
        const materias = await prisma.materias.findMany();
        res.json({ materias })
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener la lista de materias" });
    }

})

app.post("/materias/agregar", async (req, res) => {
    try {
        console.log(req.body);
        const materia = await prisma.materias.create({
            data: req.body
        })
        res.json({ msg: "creado", materia })
    } catch (error) {
        console.error(error);
        // Si el error se debe a que se violó una restricción única, responder con un mensaje específico
        if (error.code === "P2002") {
            res.status(400).json({ mensaje: "Ya existe una materia con el mismo código " });
        } else {
            res.status(500).json({ mensaje: "Error al crear la materia" });
        }
    }
})

app.patch("/materias/cambiar-estado", async (req, res) => {
    try {
        console.log('Cuerpo', req.body);

        const codigo = Number(req.body.codigo);
        const estado = req.body.estado;
        const materia = await prisma.materias.update({
            where: { codigo: codigo },
            data: { estado: estado }
        })
        res.json({ msg: "estado actualizado", materia })
    } catch (error) {
        console.error(error);
        if (error.code === "P2025") {
            res.status(404).json({ mensaje: `No se encontró una materia con el código ${req.params.codigo}` });
        } else {
            res.status(500).json({ mensaje: "Error al actualizar ESTADO de la materia" });
        }
    }
})

app.put("/materias/actualizar", async (req, res) => {
    try {
        console.log(req.body);
        const codigo = req.body.codigo
        delete req.body.codigo
        const materia = await prisma.materias.upsert({
            where: { codigo: codigo },
            update: req.body,
            create: req.body
        })
        res.json({ msg: "materia actualizada", materia })
    } catch (error) {
        console.error(error);
        if (error.code === "P2025") {
            res.status(404).json({ mensaje: `No se encontró una materia con el código ${req.params.codigo}` });
        } else {
            res.status(500).json({ mensaje: "Error al actualizar materia" });
        }
    }
})

//----------------------------------- inscripciones --------------------------------------

app.get("/inscripciones", async (req, res) => {
    try {
        const inscripciones = await prisma.inscripciones.findMany();
        res.json({ inscripciones })
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener inscripciones" });
    }
})


app.post("/agregar/incripciones", async (req, res) => {
    try {
        const {codigo_estudiante, codigo_materia} = req.body

        const estudiante = await prisma.estudiantes.findFirstOrThrow({
            where: {
                codigo: codigo_estudiante
            },
        });

        const materia = await prisma.materias.findFirstOrThrow({
            where: {
                codigo: codigo_materia
            }
        });

        const inscripcion = await prisma.inscripciones.create({
            data: {
                codigo_estudiante: estudiante.codigo,
                codigo_materia: materia.codigo,
                fecha_inscripcion: new Date ()
            }
        } );
        res.json({ msg: "creada", inscripcion})
    } catch (error) {
        console.error(error);
        if(error.code == "P2025" ){
             res.status(404).json({mensaje:"uno o más registros que se requieren no se encontraron"});
        }else if(error.code == "P2002") {
            res.status(400).json({mensaje:"ya se encuentra registrado en la asignatura el estudiante"});
        }else{
            res.status(400).json({mensaje:"error:"});
        }
    }
})  


app.put("/actualizar/incripcion", async (req, res) => {
    try {
      const { id_inscripcion } = req.body;
      const inscripcion = await prisma.inscripciones.upsert({
        where: { id_inscripcion: id_inscripcion },
        update: req.body,
        create: req.body
      });
      res.json({ msg: "Inscripción actualizada", inscripcion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al actualizar la inscripción" });
    }
  });


app.listen(3000, ()=>
     console.log('Aplicacion en ejecucion')
);



