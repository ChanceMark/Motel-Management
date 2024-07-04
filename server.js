// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb://localhost:27017/motel', { useNewUrlParser: true, useUnifiedTopology: true });

const roomSchema = new mongoose.Schema({
  id: Number,
  status: String,
  startTime: Date,
  clientName: String,
  services: Array
});

const Room = mongoose.model('Room', roomSchema);

app.use(express.json());

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/rooms', async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

app.post('/checkin', async (req, res) => {
  const { roomId, clientName } = req.body;
  const room = await Room.findOne({ id: roomId });
  if (room && room.status === 'available') {
    room.status = 'occupied';
    room.startTime = new Date();
    room.clientName = clientName;
    room.services = [];
    await room.save();
    io.emit('roomStatus', await Room.find());
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Room not available or invalid room ID' });
  }
});

app.post('/addService', async (req, res) => {
  const { roomId, service } = req.body;
  const room = await Room.findOne({ id: roomId });
  if (room && room.status === 'occupied') {
    room.services.push(service);
    await room.save();
    io.emit('roomStatus', await Room.find());
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Room not occupied or invalid room ID' });
  }
});

app.post('/checkout', async (req, res) => {
  const { roomId } = req.body;
  const room = await Room.findOne({ id: roomId });
  if (room && room.status === 'occupied') {
    room.status = 'available';
    room.startTime = null;
    room.clientName = '';
    room.services = [];
    await room.save();
    io.emit('roomStatus', await Room.find());
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Room not occupied or invalid room ID' });
  }
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});

setInterval(async () => {
  const rooms = await Room.find();
  rooms.forEach(room => {
    if (room.status === 'occupied') {
      const timeDiff = (new Date() - room.startTime) / 1000 / 60 / 60;
      if (timeDiff >= 4) {
        io.emit('alert', { roomId: room.id, message: 'Room time exceeded 4 hours' });
      }
    }
  });
}, 60000); // Check every minute
