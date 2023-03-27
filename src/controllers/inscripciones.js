const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getInscripciones = async (req, res) => {
    try {
        const inscripciones = await prisma.inscripciones.findMany();
        res.json({ inscripciones })
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener inscripciones" });
    }
}
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

const postAgrearInscripcion = async (req, res) => {
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

}

const putActualizarInscripcion = async (req, res) => {
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
}

const patchtcambiarFecha = async (req, res) => {
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

}
module.exports={
    getInscripciones,
    postAgrearInscripcion,
    putActualizarInscripcion,
    patchtcambiarFecha
}