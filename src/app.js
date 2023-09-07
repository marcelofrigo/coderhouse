const express = require('express');
const path = require('path'); // No necesitas asignar __dirname a un nuevo valor
const handlebars = require('express-handlebars');
const viewRouter = require('./routes/views.router.js'); // Asumiendo que este es un archivo CommonJS
const { Server } = require('socket.io');

const app = express();
const httpServer = app.listen(8080, () => console.log("Escuchando en el puerto 8080"));

const io = new Server(httpServer);

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'));
app.use('/', viewRouter);

let messages = [];
io.on('connection',socket=>{
    console.log("Nuevo cliente conectado");

    socket.broadcast.emit('userConnected', { user: 'Nuevo usuario conectado' });

    socket.on('message', data => {
        messages.push(data)
        io.emit('messageLogs',messages)
    });

    socket.on('authenticate', () => {
        socket.emit('messageLogs',messages);
    })
})