"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMove = exports.joinRoom = exports.createRoom = exports.roomRepository = exports.gameRepository = exports.playerRepository = exports.getRepository = exports.manager = void 0;
const Room_1 = require("../entities/Room");
const Player_1 = require("../entities/Player");
const Game_1 = require("../entities/Game");
const db_1 = __importDefault(require("../db/db"));
exports.manager = db_1.default.manager;
exports.getRepository = db_1.default.getRepository;
exports.playerRepository = db_1.default.getRepository(Player_1.Player);
exports.gameRepository = db_1.default.getRepository(Game_1.Game);
exports.roomRepository = db_1.default.getRepository(Room_1.Room);
const createRoom = (req, res) => {
    console.log('Creating room');
    console.log(req.body);
    const playerName = req.body.playerName;
    const room_number = `${Date.now()}`;
    console.log(room_number);
    const player = new Player_1.Player();
    player.name = playerName;
    player.color = true;
    exports.playerRepository.insert(player);
    const match = new Game_1.Game();
    match.is_finished = false;
    match.move_history = "";
    match.player = player;
    exports.gameRepository.insert(match);
    const room = new Room_1.Room();
    room.id = room_number;
    room.game = match;
    room.amount_player = 1;
    exports.roomRepository.insert(room);
    console.log('Room created');
    res.json({ playerColor: player.color, room: room_number });
};
exports.createRoom = createRoom;
const joinRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    const playerName = req.body.playerName;
    console.log('room: ', roomId);
    try {
        const room = yield exports.roomRepository.findOne({ where: { id: roomId } });
        if (!room) {
            throw new Error('Room not found');
        }
        if (room.amount_player >= 2) {
            throw new Error('Room full');
        }
        room.amount_player += 1;
        yield exports.roomRepository.save(room);
        console.log("Joining room");
        const playerColor = false;
        console.log(playerName);
        console.log(room);
        const player = new Player_1.Player();
        player.name = playerName;
        player.color = playerColor;
        exports.playerRepository.insert(player);
        res.json({ playerColor: playerColor });
    }
    catch (error) {
        res.status(404).json({ error: 'Room not found' });
    }
});
exports.joinRoom = joinRoom;
const validateMove = (req, res) => {
    console.log('Validating move');
    res.json({ valid: true });
};
exports.validateMove = validateMove;
