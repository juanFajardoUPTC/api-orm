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
    try {
        const estudiantes = await prisma.estudiantes.findMany();
        res.json({ estudiantes })
    } catch (error) {
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



app.patch("/estudiantes/cambiar-estado", async (req, res) => {
    try {
        console.log('Cuerpo', req.body);

        const codigo = Number(req.body.codigo);
        const estado = req.body.estado;
        const estudiante = await prisma.estudiantes.update({
            where: { codigo: codigo },
            data: { estado: estado }
        })
        res.json({ msg: "estado actualizado", estudiante })
    } catch (error) {
        console.error(error);
        if (error.code === "P2025") {
            res.status(404).json({ mensaje: `No se encontró un estudiante con el código ${req.params.codigo}` });
        } else {
            res.status(500).json({ mensaje: "Error al actualizar ESTADO el estudiante" });
        }
    }
})
app.put("/estudiantes/actualizar", async (req, res) => {
    try {
        console.log(req.body);
        const codigo = req.body.codigo
        delete req.body.codigo
        const estudiante = await prisma.estudiantes.upsert({
            where: { codigo: codigo || 0 },
            update: req.body,
            create: req.body
        })
        res.json({ msg: "estudiante actualizado", estudiante })
    } catch (error) {
        console.error(error);
        if (error.code === "P2025") {
            res.status(404).json({ mensaje: `No se encontró un estudiante con el código ${req.params.codigo}` });
        } else {
            res.status(500).json({ mensaje: "Error al actualizar estudiante" });
        }
    }
})
app.get('/estudiantes/orden', async (req, res) => {
    try {
      const { ordenarPor } = req.query
      const estudiantes = await prisma.estudiantes.findMany({
        orderBy: {
          [ordenarPor]: 'asc'
        }
      })
  
      res.json(estudiantes)
    } catch (error) {
      console.error(error)
      res.status(500).json({ mensaje: 'Error al obtener la lista de estudiantes' })
    }
  })

  app.get('/estudiantes/filtro', async (req, res) => {
    try { 
      const { codigo, apellido, nombre, tipo_documento,numero_documento,estado,genero } = req.query; //parámetros de consulta
      const estudiantes = await prisma.estudiantes.findMany({ // Consulta a la base de datos utilizando Prisma
        where: { // Se especifica el criterio de búsqueda
          AND: [ // Se utilizan varios criterios AND para filtrar los estudiantes
            codigo ? { codigo } : null, // Si el parámetro codigo existe, se agrega el criterio de búsqueda al objeto, sino se agrega un valor nulo
            apellido ? { apellido: { contains: apellido } } : null, 
            nombre ? { nombre: { contains: nombre } } : null, 
            tipo_documento? {tipo_documento:{ contains:tipo_documento}}:null, 
            numero_documento? {numero_documento:{contains:numero_documento}}:null, 
            estado?{estado:{contains:estado}}:null, 
            genero?{genero:{contains:genero}}:null, 
          ].filter(Boolean), // Se filtran los valores nulos del arreglo de criterios
        },
      });
      res.json(estudiantes); // Se envían los estudiantes encontrados
    } catch (error) { 
      console.error(error); 
      res.status(500).json({ mensaje: 'Error al obtener la lista de estudiantes' }); 
    }
  });
//----------------------------------------------------- API MATERIAS----------------------------------------------

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
            where: { codigo: codigo || 0 },
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

//-------------------------------------------------------Api Inscripciones-------------------------

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
        const { codigo_estudiante, codigo_materia, fecha_inscripcion } = req.body
        console.log('SSSSSSSSSS',req.body);
        const estudiante = await validateStudent(codigo_estudiante);
        const materia = await validateMatter(codigo_materia);

        const inscripcion = await prisma.inscripciones.create({
            data: {
                codigo_estudiante: estudiante.codigo,
                codigo_materia: materia.codigo,
                fecha_inscripcion: new Date(fecha_inscripcion)
                // fecha_inscripcion: new Date()  // fecha del pc 
            }
        });
        res.json({ msg: "creada", inscripcion })
    } catch (error) {
        console.error(error);
        if (error.code == "P2002") {
            res.status(400).json({ mensaje: "ya se encuentra registrado en la asignatura el estudiante" });
        } else if (error.message === "No se encontró al estudiante registrado") {
            res.status(400).json({ mensaje: "No se encontró al estudiante registrado" });
        } else if(error.message === "No hay una materia con ese codigo") {
            res.status(400).json({ mensaje: "No se encontró la asignatura" });
        }else{
            res.status(500).json({ mensaje: "Error al crear la inscripción" });
        }
    }
})




async function validateStudent(codigo_estudiante) {
    const estudiante = await prisma.estudiantes.findUnique({
        where: {
            codigo: codigo_estudiante,
        },
    });
    if (!estudiante) {
        throw new Error("No se encontró al estudiante registrado");
    }
    return estudiante;
}


async function validateMatter(codigo_materia) {
    const materia = await prisma.materias.findUnique({
        where: {
            codigo: codigo_materia,
        },
    });
    if (!materia) {
        throw new Error("No hay una materia con ese codigo");
    }
    return materia;
}


app.put("/actualizar/incripcion", async (req, res) => {
    try {
        const { id_inscripcion, codigo_estudiante, codigo_materia } = req.body;
        delete req.body.id_inscripcion
        await validateStudent(codigo_estudiante);
        await validateMatter(codigo_materia);
        const inscripcion = await prisma.inscripciones.upsert({
            where: { id_inscripcion: id_inscripcion  || 0 }, 
            update: req.body,
            create: req.body
        });
        res.json({ msg: "Inscripción actualizada", inscripcion });
    } catch (error) {
        console.error(error);
        if (error.code == "P2002") {
            res.status(400).json({ mensaje: "ya se encuentra registardo el estudiante en la asignatura (no se puede realizar otra inscripcion)" });
        } else if (error.message === "No se encontró al estudiante registrado") {
            res.status(400).json({ mensaje: "No se encontró al estudiante registrado" });
        } else if (error.message === "No hay una materia con ese codigo") {
            res.status(400).json({ mensaje: "No se encontró la asignatura" });
        } else {
            res.status(500).json({ mensaje: "Error al actualizar la inscripción" });
        }
    }
});



// no lo veo necesario mjero implementar en la base un esatdo si esta activo o inactivo como si cancelara 
app.patch("/inscripcion/cambiar-fecha", async (req, res) => {
    try {
        console.log('Cuerpo', req.body);
        const { id_inscripcion, fecha_inscripcion } = req.body;
        const incripcion = await prisma.inscripciones.update({
            where: { id_inscripcion: id_inscripcion },
            data: { fecha_inscripcion: new Date(fecha_inscripcion) }
        })
        res.json({ msg: "fecha actualizada", incripcion })
    } catch (error) {
        console.error(error);
        if (error.code === "P2025") {
            res.status(404).json({ mensaje: 'No se encontró la inscripcion' });
        } else {
            res.status(500).json({ mensaje: "Error al actualizar la fecha  de la inscripcion" });
        }
    }
})


const server = app.listen(app.get('port'), () => {
    console.log('Funciona en puerto: ', app.get('port'));
});