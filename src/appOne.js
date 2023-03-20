const express = require('express');
const { PrismaClient } = require('@prisma/client')  //importa el constructor de prisma clienet desde el moduloulo "'@prisma/client'"



const prisma = new PrismaClient() //instancia 
const app = express()


app.use(express.json()) //middleware convierte de json a javascrid 



app.get('/',(req,res) => {
    res.send('Prueba')
}
)


//crear 
app.post("/estudiantes/agregar", async (req, res) => {
    console.log(req.body);
    const estudiante = await prisma.estudiantes.create({data: req.body})
    res.json({ msg: "creado", estudiante })

})

//obtener Estudinates 
app.get("/estudiantes", async (req, res) => {
    const estudiantes= await prisma.estudiantes.findMany();
    res.json({ estudiantes })
   
    
})


app.listen(3000, ()=>
     console.log('Aplicacion en ejecucion')
);



