// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

const ENDPOINT = "http://localhost:4000";
const socket = socketIOClient(ENDPOINT);

function App() {
  const [rooms, setRooms] = useState([]);
  const [clientName, setClientName] = useState('');
  const [service, setService] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await axios.get('/rooms');
      setRooms(response.data);
    };

    fetchRooms();
    socket.on('roomStatus', data => {
      setRooms(data);
    });
    socket.on('alert', data => {
      alert(`Room ${data.roomId}: ${data.message}`);
    });
  }, []);

  const handleCheckin = async (roomId) => {
    const response = await axios.post('/checkin', { roomId, clientName });
    if (response.data.success) {
      setClientName('');
    } else {
      alert(response.data.message);
    }
  };

  const handleAddService = async (roomId) => {
    const response = await axios.post('/addService', { roomId, service });
    if (response.data.success) {
      setService('');
    } else {
      alert(response.data.message);
    }
  };

  const handleCheckout = async (roomId) => {
    const response = await axios.post('/checkout', { roomId });
    if (response.data.success) {
      setSelectedRoom(null);
    } else {
      alert(response.data.message);
    }
  };

  return (
    <div className="App">
      <h1>Motel Management System</h1>
      <div>
        <input 
          type="text" 
          value={clientName} 
          onChange={(e) => setClientName(e.target.value)} 
          placeholder="Client Name" 
        />
        <button onClick={() => handleCheckin(selectedRoom)}>Check In</button>
      </div>
      <div>
        <input 
          type="text" 
          value={service} 
          onChange={(e) => setService(e.target.value)} 
          placeholder="Service" 
        />
        <button onClick={() => handleAddService(selectedRoom)}>Add Service</button>
      </div>
      <button onClick={() => handleCheckout(selectedRoom)}>Check Out</button>
      <table>
        <thead>
          <tr>
            <th>Room</th>
            <th>Status</th>
            <th>Client</th>
            <th>Services</th>
            <th>Time Remaining</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id} onClick={() => setSelectedRoom(room.id)}>
              <td>{room.id}</td>
              <td>{room.status}</td>
              <td>{room.clientName}</td>
              <td>{room.services.join(', ')}</td>
              <td>
                {room.status === 'occupied' ? 
                  (4 - ((new Date() - new Date(room.startTime)) / 1000 / 60 / 60)).toFixed(2) + ' hours' 
                  : 'N/A'}
              </td>
              <td>
                {room.status === 'available' ? <button onClick={() => handleCheckin(room.id)}>Check In</button> 
                : <button onClick={() => handleCheckout(room.id)}>Check Out</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
