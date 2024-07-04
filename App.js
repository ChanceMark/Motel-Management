// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Paper, 
  Grid 
} from '@mui/material';
import './App.css';

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
    <Container>
      <Typography variant="h3" gutterBottom>Motel Management System</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField 
            label="Client Name" 
            variant="outlined" 
            fullWidth 
            value={clientName} 
            onChange={(e) => setClientName(e.target.value)} 
          />
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            onClick={() => handleCheckin(selectedRoom)} 
            style={{ marginTop: '10px' }}
          >
            Check In
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField 
            label="Service" 
            variant="outlined" 
            fullWidth 
            value={service} 
            onChange={(e) => setService(e.target.value)} 
          />
          <Button 
            variant="contained" 
            color="secondary" 
            fullWidth 
            onClick={() => handleAddService(selectedRoom)} 
            style={{ marginTop: '10px' }}
          >
            Add Service
          </Button>
        </Grid>
      </Grid>

      <Button 
        variant="contained" 
        color="error" 
        fullWidth 
        onClick={() => handleCheckout(selectedRoom)} 
        style={{ marginTop: '20px' }}
      >
        Check Out
      </Button>

      <Paper style={{ marginTop: '20px', padding: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Services</TableCell>
              <TableCell>Time Remaining</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map(room => (
              <TableRow 
                key={room.id} 
                hover 
                selected={selectedRoom === room.id}
                onClick={() => setSelectedRoom(room.id)}
              >
                <TableCell>{room.id}</TableCell>
                <TableCell>{room.status}</TableCell>
                <TableCell>{room.clientName}</TableCell>
                <TableCell>{room.services.join(', ')}</TableCell>
                <TableCell>
                  {room.status === 'occupied' ? 
                    (4 - ((new Date() - new Date(room.startTime)) / 1000 / 60 / 60)).toFixed(2) + ' hours' 
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {room.status === 'available' ? 
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleCheckin(room.id)}
                    >
                      Check In
                    </Button> 
                    : 
                    <Button 
                      variant="contained" 
                      color="error" 
                      onClick={() => handleCheckout(room.id)}
                    >
                      Check Out
                    </Button>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default App;
