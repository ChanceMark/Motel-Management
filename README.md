# Motel Management System

A simple motel management system with an admin panel to manage room occupancy, services, and checkout, built with React, Express, MongoDB, and Material-UI.

## Features

- Check-in clients to rooms
- Add services to rooms
- Check out clients from rooms
- Alert when room occupancy exceeds 4 hours
- Real-time updates using Socket.IO

## Technologies Used

- React
- Material-UI
- Express
- MongoDB
- Socket.IO
- Axios

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/motel-management.git
   cd motel-management
   ```

2. **Install server dependencies:**

   ```bash
   npm install
   ```

3. **Install client dependencies:**

   ```bash
   cd client
   npm install
   ```

4. **Set up MongoDB:**

   Make sure MongoDB is installed and running on your machine. Initialize the database with room data:

   ```bash
   node initRooms.js
   ```

## Running the Application

1. **Start the server:**

   ```bash
   node server.js
   ```

2. **Start the client:**

   Open another terminal and navigate to the `client` directory:

   ```bash
   cd client
   npm start
   ```

## Project Structure

```plaintext
motel-management/
├── client/               # React client application
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── App.css
│       └── index.js
├── initRooms.js          # Script to initialize MongoDB with room data
├── server.js             # Express server
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Usage

1. **Check-in a client:**

   - Enter the client's name and click the "Check In" button.

2. **Add a service:**

   - Enter the service details and click the "Add Service" button.

3. **Check out a client:**

   - Click the "Check Out" button.

4. **Real-time updates:**

   - The admin panel updates in real-time when room statuses change.
   - An alert is shown when a room's occupancy exceeds 4 hours.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.IO](https://socket.io/)

Make sure to replace `https://github.com/yourusername/motel-management.git` with the actual URL of your repository if you plan to publish it on GitHub or another platform. This README provides an overview of the project, setup instructions, usage guidelines, and acknowledgments.
