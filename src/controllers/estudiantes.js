const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const getEstudiantes = async (req, res) => {
    try {
        const estudiantes = await prisma.estudiantes.findMany();
        res.json({ estudiantes })
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener la lista de estudiantes" });
    }
}

const postAgrearEstudiante = async (req, res) => {
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
}
const patchtcambiarEstado = async (req, res) => {
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
}
const putActualizar = async (req, res) => {
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
}
const getOrden = async (req, res) => {
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
}
const getFiltro = async (req, res) => {
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
}
module.exports={
    getEstudiantes,
    postAgrearEstudiante,
    patchtcambiarEstado,
    putActualizar,
    getOrden,
    getFiltro

}