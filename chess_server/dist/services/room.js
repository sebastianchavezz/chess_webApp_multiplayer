"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinRoom = exports.createRoom = exports.getRepository = exports.manager = void 0;
const db_1 = __importDefault(require("../db/db"));
const Room_1 = require("../entities/Room");
const Player_1 = require("../entities/Player");
exports.manager = db_1.default.manager;
exports.getRepository = db_1.default.getRepository;
const createRoom = () => {
    const room_number = `${Date.now()}`;
    const room = Room_1.Room.create({
        id: room_number,
    });
    room.save();
    console.log('Room created');
    return "success";
};
exports.createRoom = createRoom;
const joinRoom = (roomId, playerName) => {
    const room = (0, exports.getRepository)(Room_1.Room).findOne({ relations: ['players'], where: { id: roomId } });
    if (!room) {
        throw new Error('Room not found');
    }
    const playerColor = false;
    const player = new Player_1.Player();
    player.name = playerName;
    player.color = playerColor;
    (0, exports.getRepository)(Player_1.Player).save(player);
    return { playerColor };
};
exports.joinRoom = joinRoom;
