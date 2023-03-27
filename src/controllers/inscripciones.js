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