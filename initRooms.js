// initRooms.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/motel', { useNewUrlParser: true, useUnifiedTopology: true });

const roomSchema = new mongoose.Schema({
  id: Number,
  status: String,
  startTime: Date,
  clientName: String,
  services: Array
});

const Room = mongoose.model('Room', roomSchema);

async function init() {
  await Room.deleteMany({});
  for (let i = 1; i <= 10; i++) {
    const room = new Room({ id: i, status: 'available', startTime: null, clientName: '', services: [] });
    await room.save();
  }
  mongoose.disconnect();
}

init();
