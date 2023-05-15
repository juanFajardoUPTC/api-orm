const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const nodemailer = require('nodemailer');

const getEstudiantesConInscripcionesActuales = async (req, res) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'cfbg1999@gmail.com',
            pass: 'tfberwcmpjvuzreo'
        },
        tls: {
            rejectUnauthorized: false // Ignorar errores de certificado
        }
    });

    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Establecer la hora en 00:00:00
    // console.log('Fecha actual:', fechaActual);
    const formattedFechaActual = fechaActual.toISOString().slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(formattedFechaActual)) {
        console.log(fechaActual, "= ", formattedFechaActual);
    }
    const fecha = new Date(formattedFechaActual);
    try {
        const estudiantes = await prisma.estudiantes.findMany({
            where: {
                inscripciones: {
                    some: {
                        OR: [
                            { fecha_inscripcion: { equals: fecha } },// Filtra las inscripciones con la fecha actual formateada
                        ]
                    }
                }
            },
            include: {
                inscripciones: true
            }
        });
        for (const estudiante of estudiantes) {
            const { nombre, apellido, numero_documento, inscripciones } = estudiante;
           

            let tableBody = '';
            const inscripcionesString = JSON.stringify(inscripciones);
            // Generar las filas de la tabla para cada estudiante
            const inscripcionesHtml = inscripciones.map(inscripcion => `<li>${inscripcion}</li>`).join('');
            const row = `
    <tr>
      <td>${nombre}</td>
      <td>${apellido}</td>
      <td>${numero_documento}</td>
      <td>
        <ul>
          ${inscripcionesHtml}
        </ul>
      </td>
    </tr>
  `;

            tableBody += row;
            // Generar el cuerpo completo del correo
const correoBody = `
<h2>Estimado ${"Admin"},\n\nlas incripciones por estudiantes del dia de hoy son las siguientes:\n\n </h2>
<h2>Tabla de Estudiantes e Inscripciones</h2>
<table>
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Apellido</th>
      <th>Número de Documento</th>
      <th>Inscripciones</th>
    </tr>
  </thead>
  <tbody>
    ${tableBody}
  </tbody>
</table>
`;
            // Crea el contenido del correo electrónico con las inscripciones del estudiante
            let contenidoCorreo = `Estimado ${"Admin"},\n\nlas incripciones por estudiantes del dia de hoy son las siguientes:\n\n`;
            // for (const estudiante of estudiantes) {
            //     contenidoCorreo += `- ${estudiante.nombre} ${estudiante.apellido}\n`;
            // }
            const mailOptions = {
                from: 'cfbg1999@gmail.com',
                to: 'cristian.becerra08@uptc.edu.co',
                subject: 'Inscripciones a materias',
                text: contenidoCorreo,
                html: correoBody
            };

            // Envía el correo electrónico

            const info = await transporter.sendMail(mailOptions);
            console.log(info)
        }
        res.json(estudiantes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener la lista de estudiantes" });
    }

}




module.exports = {
    getEstudiantesConInscripcionesActuales,
}


