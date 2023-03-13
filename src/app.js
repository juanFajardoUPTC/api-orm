const express = require("express");
// const req = require("express/lib/request");
// const res = require("express/lib/response");
const path = require("path");
const app = express();

const { PrismaClient } = require('@prisma/client') 
const prisma = new PrismaClient()


//config
app.set('port', process.env.PORT || 3000);

//static
app.use(express.static(path.join(__dirname,'public')));

//start
app.get("/",(req,res)=>{
    res.json({msg:"hola"})
})


app.post("/estudiantes/agregar",async (req,res)=>{
    console.log(req.body);
    // const estudiante = await prisma.estudiantes.create({
    //     data: req.body
    // })
    res.json({})
})

const server = app.listen(app.get('port'),()=>{
    console.log('Funciona en puerto: ', app.get('port'));
});