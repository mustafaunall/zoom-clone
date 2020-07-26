const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io').listen(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/oda=${uuidV4()}`)
})

app.get('/oda=:oda', (req, res) => {
    res.render('oda', { odaId: req.params.oda })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
        
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(80)