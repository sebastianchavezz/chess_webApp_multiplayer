"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const Api_calls_1 = require("./controllers/Api_calls");
const Api_calls_2 = require("./controllers/Api_calls"); // Import socket functions
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:8080", // Adjust with your frontend origin
        methods: ["GET", "POST"]
    }
});
const port = 3001;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// WebSocket logic
io.on('connection', (socket) => {
    console.log('A user connected');
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    (0, Api_calls_2.validateMoveSocket)(socket, io);
});
app.post('/create-room', (req, res) => (0, Api_calls_1.createRoom)(req, res, io));
app.post('/join-room/:roomId', (req, res) => (0, Api_calls_1.joinRoom)(req, res, io));
app.get('/creator-name/:roomId', Api_calls_1.getCretorName);
// Remove the API versions of validateMove and boardState
// app.post('/validate-move', (req, res) => validateMove(req, res, io));
// app.post('/boardState-update/:roomId', (req, res) => boardState(req, res, io));
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
