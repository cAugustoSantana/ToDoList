const SPDY = require('spdy');
const fs = require('fs');
const express = require("express");
const todosRouter = require('./routes/toDo');

const app = express();
const port = 3000

const options = {
    key : fs.readFileSync('./certs/server.key'),
    cert: fs.readFileSync('./certs/server.crt'),
    spdy:{
        protocols:['h2']
    }
}

const server = SPDY.createServer(options,app);

app.use('/items',todosRouter);
app.use('items/filter',todosRouter);
app.use('items/:id',todosRouter);

server.on('error',(err) => console.error(err));

server.listen(port, () => {
    console.log(`El servidor esta inicializado en el puerto ${port}`);
});