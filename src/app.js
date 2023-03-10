const express = require("express");
const path = require("path");
const app = express();


//config
app.set('port', process.env.PORT || 3000);

//static
app.use(express.static(path.join(__dirname,'public')));

//start
const server = app.listen(app.get('port'),()=>{
    console.log('Funciona en puerto: ', app.get('port'));
});