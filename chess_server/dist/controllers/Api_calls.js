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
exports.validateMoveSocket = exports.getCretorName = exports.joinRoom = exports.createRoom = exports.roomRepository = exports.gameRepository = exports.playerRepository = exports.getRepository = exports.manager = void 0;
const Room_1 = require("../entities/Room");
const Player_1 = require("../entities/Player");
const Game_1 = require("../entities/Game");
const db_1 = __importDefault(require("../db/db"));
const ValidationLogic_1 = require("../logic/ValidationLogic");
const utils_1 = require("../util/utils");
exports.manager = db_1.default.manager;
exports.getRepository = db_1.default.getRepository;
exports.playerRepository = db_1.default.getRepository(Player_1.Player);
exports.gameRepository = db_1.default.getRepository(Game_1.Game);
exports.roomRepository = db_1.default.getRepository(Room_1.Room);
const createRoom = (req, res, io) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Creating room');
    const playerName = req.body.playerName;
    const room_number = `${Date.now()}`;
    const player = new Player_1.Player();
    player.name = playerName;
    player.color = true;
    yield exports.playerRepository.save(player);
    const match = new Game_1.Game();
    match.is_finished = false;
    match.move_history = "";
    match.player = player;
    match.turn = true;
    match.board = [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        Array(8).fill('.'), // Empty row
        Array(8).fill('.'), // Empty row
        Array(8).fill('.'), // Empty row
        Array(8).fill('.'), // Empty row
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
    ];
    // Use save instead of insert to get the generated ID
    const savedGame = yield exports.gameRepository.save(match);
    const room = new Room_1.Room();
    room.id = room_number;
    room.game = savedGame;
    room.amount_player = 1;
    yield exports.roomRepository.insert(room);
    console.log('Room created');
    res.json({ playerColor: player.color, room: room_number, board: match.board, gameId: savedGame.id });
    io.emit('playerCreated', { creatorName: playerName, roomId: room_number });
});
exports.createRoom = createRoom;
// Import necessary entities and decorators
const joinRoom = (req, res, io) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    const playerName = req.body.playerName;
    try {
        // Find the room with the given ID, including the associated game and ordering by game ID
        const room = yield exports.roomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.game', 'game')
            .leftJoinAndSelect('game.player', 'player') // Join the player associated with the game
            .where('room.id = :roomId', { roomId })
            .orderBy('game.id', 'DESC') // Order by game ID, assuming you want the latest game
            .getOne();
        if (!room) {
            throw new Error('Room not found');
        }
        if (room.amount_player >= 2) {
            throw new Error('Room full');
        }
        // Update the amount of players in the room
        room.amount_player += 1;
        yield exports.roomRepository.save(room);
        console.log("Joining room");
        // Create a new player
        const player = new Player_1.Player();
        player.name = playerName;
        player.color = false; // Assuming player color is set based on the number of players in the room
        yield exports.playerRepository.save(player);
        // Use the existing game entity associated with the room
        const existingGame = room.game;
        // Log the player, room, and game information
        console.log(player.name);
        console.log(room.game.id);
        // If there is a player associated with the game, get the name of the player
        const firstPlayerName = existingGame.player ? existingGame.player.name : '';
        console.log(`First player in the game: ${firstPlayerName}`);
        // Respond with playerColor and gameId
        res.json({ playerColor: player.color, gameId: existingGame.id, board: existingGame.board });
        io.emit('playerJoined', { opponentName: playerName, roomId });
    }
    catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Room not found or room full' });
    }
});
exports.joinRoom = joinRoom;
const getCretorName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.params;
    console.log('roomId :', roomId);
    const room = yield exports.roomRepository
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.game', 'game')
        .leftJoinAndSelect('game.player', 'player')
        .where('room.id = :roomId', { roomId })
        .orderBy('game.id', 'DESC')
        .getOne();
    if (!room) {
        throw new Error('Room not found');
    }
    const creatorName = room.game.player.name;
    console.log('creatorName :', creatorName);
    res.json({ creatorName });
});
exports.getCretorName = getCretorName;
const validateMoveSocket = (socket, io) => __awaiter(void 0, void 0, void 0, function* () {
    socket.on('validateMoveSocket', (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('---------------------------------------------------');
        try {
            const roomId = data.roomId;
            // Ensure roomId is provided
            if (!roomId) {
                throw new Error('Room ID is missing');
            }
            // Retrieve the latest game by roomId
            const room = yield exports.roomRepository
                .createQueryBuilder('room')
                .leftJoinAndSelect('room.game', 'game')
                .where('room.id = :roomId', { roomId })
                .orderBy('game.id', 'DESC')
                .getOne();
            if (!room || !room.game) {
                throw new Error('Room or game not found');
            }
            const turn = data.color;
            const from_X = data.from.col;
            const from_Y = data.from.row;
            const whos_turn = turn ? 'white' : 'black';
            //logs
            console.log('room.game.turn :', room.game.turn);
            const board = room.game.board;
            //check for previous move
            const previousMove = room.game.move_history ? JSON.parse(room.game.move_history) : null;
            if (!(board && board[from_Y] && board[from_Y][from_X])) {
                callback({ isValidMove: false, error: 'Invalid move' });
                throw new Error('Invalid move');
            }
            //check if is the turn of the player and if the piece is the color of the player
            if (room.game.turn === turn && board[from_Y][from_X] === board[from_Y][from_X].toLowerCase()) {
                const rowIndex = data.to.row;
                const colIndex = data.to.col;
                const kingSide = data.kingSide;
                const queenSide = data.queenSide;
                const kingMoved = data.kingMoved;
                if (kingSide === null || queenSide === null || kingMoved === null) {
                    throw new Error('ERROR KINGSIDE OR QUEENSIDE IS NULL');
                }
                const [updated_board, isValidMove, updated_move, isCheck, isCheckmate, isStalemate, kingSide_ans, queenSide_ans, kingMoved_ans] = (0, ValidationLogic_1.moveValidation)(from_X, from_Y, colIndex, rowIndex, board, turn, kingSide, queenSide, kingMoved, previousMove);
                //if the move is valid
                if (isValidMove) {
                    //add the updated board to the game db
                    room.game.board = updated_board;
                    //switch the turn
                    room.game.turn = !turn;
                    //update move history
                    room.game.move_history = JSON.stringify(updated_move);
                    //save the game in the db
                    yield exports.gameRepository.save(room.game);
                    //return the updated board
                    callback({ isValidMove: true, board: (0, utils_1.formatBoard_to_return)(updated_board), isCheck, isCheckmate, isStalemate, kingSide: kingSide_ans, queenSide: queenSide_ans, kingMoved: kingMoved_ans });
                    io.emit('boardState', { board: (0, utils_1.formatBoard_to_return)(updated_board) }); // Broadcasting to all connected sockets
                }
                else {
                    //move is not valid
                    callback({ isValidMove: false, board: (0, utils_1.formatBoard_to_return)(board), isCheck: false, isCheckmate: false, isStalemate: false, kingSide, queenSide, kingMoved });
                    io.emit('boardState', { board: (0, utils_1.formatBoard_to_return)(board) }); // Broadcasting to all connected sockets
                }
            }
            else {
                // Handle the case when board is null or its elements are undefined
                console.log('Invalid move');
                callback({ isValidMove: false, error: 'Invalid move' });
            }
        }
        catch (error) {
            console.error(error);
            callback({ isValidMove: false, error: 'Invalid move' });
        }
    }));
});
exports.validateMoveSocket = validateMoveSocket;
