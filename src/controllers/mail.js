const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const nodemailer = require('nodemailer');



/**obtener  Obtención de los estudiantes con sus inscripciones del día actual */
/*const getInscripciones = async (req, res) => {
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Establecer la hora en 00:00:00
    console.log('Fecha actual:', fechaActual);
    try {
      const inscripciones = await prisma.inscripciones.findMany({
        where: {
          fecha_inscripcion: {
            lte: fechaActual, // Utilizamos el operador "lte" para comparar "menor o igual"
          },
        },
        include: {
          estudiantes: true,
        },
      });
  
      res.json(inscripciones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al obtener la lista de estudiantes" });
    }
  } */

  const getInscripciones = async (req, res) => {
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Establecer la hora en 00:00:00
    console.log('Fecha actual:', fechaActual);
  
    try {
      const inscripciones = await prisma.inscripciones.findMany({
        where: {
          OR: [
            { fecha_inscripcion: fechaActual },
            { fecha_inscripcion: { contains: fechaActual.toISOString().slice(0, 10) } },
          ],
        },
        include: {
          estudiantes: true,
        },
      });
  
      res.json(inscripciones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al obtener la lista de estudiantes" });
    }
  }
  
  
  module.exports={
    getInscripciones,
  }
  

