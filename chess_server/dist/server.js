"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3001;
// Keep track of rooms and players
const rooms = {};
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Create a room
app.post('/create-room', (req, res) => {
    const room = createRoom();
    res.json({ room });
});
// Join a room
app.post('/join-room/:room', (req, res) => {
    const room = req.params.room;
    const playerName = req.body.playerName;
    // Check if the room exists
    if (!rooms[room]) {
        return res.status(404).json({ error: 'Room not found' });
    }
    const playerColor = assignPlayerColor(room);
    // Add the player to the room
    rooms[room].players.push(playerName);
    rooms[room].players.push(playerColor);
    res.json({ room, playerColor });
});
// Your chess move validation endpoint
app.post('/validate-move', (req, res) => {
    // Extract move details from the request body
    const { board, from, to } = req.body;
    console.log('From:', from);
    console.log('To:', to);
    // Log the 2D array using console.table
    console.log('Board:');
    console.table(board);
    // Perform move validation logic (replace with your actual validation logic)
    const isValidMove = validateMove(board, from, to);
    // Send the validation result back to the frontend
    res.json({ isValidMove });
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// Your move validation logic (replace with your actual validation logic)
function validateMove(board, from, to) {
    let piece = board[from.row][from.col];
    if (piece === 'P' || piece === 'p') {
        return false;
    }
    return true;
}
function createRoom() {
    // Generate a unique room name (you can use a more sophisticated logic)
    const room = `Room${Date.now()}`;
    rooms[room] = { players: [] };
    return room;
}
function assignPlayerColor(room) {
    const { players } = rooms[room];
    return players.length === 0 ? 'white' : 'black';
}
