// src/app.ts
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { createRoom, getCretorName, joinRoom } from './controllers/Api_calls';
import {validateMoveSocket } from './controllers/Api_calls'; // Import socket functions

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",  // Adjust with your frontend origin
    methods: ["GET", "POST"]
  }
});
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// WebSocket logic
io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  validateMoveSocket(socket, io);
});

app.post('/create-room', (req, res) => createRoom(req, res,io));
app.post('/join-room/:roomId', (req, res) => joinRoom(req, res,io));
app.get('/creator-name/:roomId', getCretorName);
// Remove the API versions of validateMove and boardState
// app.post('/validate-move', (req, res) => validateMove(req, res, io));
// app.post('/boardState-update/:roomId', (req, res) => boardState(req, res, io));

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
