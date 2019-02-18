const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = process.env.PORT || 4000

// Middleware
app.use(express.static(__dirname + '\\..\\client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// Setteando mongoose
var Message = mongoose.model('Message', {
    name: String,
    message: String,
    postedAt: Date
});

var dbUrl = 'mongodb://ftourn123:abc123@ds139295.mlab.com:39295/chat-app'

// End points y handlers
app.get('/messages', (req, res) => {
    Message.find({}).sort('-postedAt').limit(5).exec((err, messages) => {
        res.send(messages);
    });
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err)
            sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })
});

// Conexión socket.io
io.on('connection', () => {
    console.log('Se conectó un usuario');
});

// Iniciando conexión con la base de datos
mongoose.connect(dbUrl, (err) => {
    console.log('Base de datos conectada');
});

// Iniciando servidor http
const server = http.listen(PORT, () => {
    console.log('Escuchando en puerto ' + server.address().port);
});