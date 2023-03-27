const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getMaterias = async (req, res) => {
    try {
        const materias = await prisma.materias.findMany();
        res.json({ materias })
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener la lista de materias" });
    }
}

const postAgrearMaterias = async (req, res) => {
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

}
const patchtcambiarEstado = async (req, res) => {
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
}
const putActualizar = async (req, res) => {
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
}

module.exports={
    getMaterias,
    postAgrearMaterias,
    patchtcambiarEstado,
    putActualizar
}