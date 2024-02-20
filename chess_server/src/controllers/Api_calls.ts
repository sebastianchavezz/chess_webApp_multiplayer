// src/controller/API_calls.ts
import { Request, Response } from 'express';
import { Room } from '../entities/Room';
import { Player } from '../entities/Player';
import { Game } from '../entities/Game';
import pool from '../db/db';
import {moveValidation, udpateBoard} from '../logic/ValidationLogic';
import { formatBoard_to_return} from '../util/utils';
import { Server, Socket } from 'socket.io';

export const manager = pool.manager;
export const getRepository = pool.getRepository;

export const playerRepository = pool.getRepository(Player);
export const gameRepository = pool.getRepository(Game);
export const roomRepository = pool.getRepository(Room);

export const createRoom = async (req: Request, res: Response, io:Server): Promise<void> => {
  console.log('Creating room');

  const playerName: string = req.body.playerName;

  const room_number: string = `${Date.now()}`;

  const player = new Player();
  player.name = playerName;
  player.color = true;
  await playerRepository.save(player);

  const match = new Game();
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
  const savedGame = await gameRepository.save(match);

  const room = new Room();
  room.id = room_number;
  room.game = savedGame;
  room.amount_player = 1;
  await roomRepository.insert(room);

  console.log('Room created');

  res.json({ playerColor: player.color, room: room_number, board: match.board, gameId: savedGame.id});
  io.emit('playerCreated', { creatorName:playerName, roomId: room_number });
};

// Import necessary entities and decorators

export const joinRoom = async (req: Request, res: Response, io: Server): Promise<void> => {
  const { roomId } = req.params;
  const playerName = req.body.playerName;

  try {
    // Find the room with the given ID, including the associated game and ordering by game ID
    const room = await roomRepository
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
    await roomRepository.save(room);

    console.log("Joining room");

    // Create a new player
    const player = new Player();
    player.name = playerName;
    player.color = false; // Assuming player color is set based on the number of players in the room
    await playerRepository.save(player);

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

    io.emit('playerJoined', {opponentName: playerName, roomId });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Room not found or room full' });
  }
};

export const getCretorName = async (req: Request, res: Response): Promise<void> => {

  const { roomId } = req.params;

  console.log('roomId :', roomId);
  const room = await roomRepository
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
};

export const validateMoveSocket = async (socket: Socket, io: Server): Promise<void> => {
  socket.on('validateMoveSocket', async (data, callback) => {
    console.log('---------------------------------------------------');
    try {
      const roomId = data.roomId;

      // Ensure roomId is provided
      if (!roomId) {
        throw new Error('Room ID is missing');
      }
      // Retrieve the latest game by roomId
      const room = await roomRepository
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.game', 'game')
        .where('room.id = :roomId', { roomId })
        .orderBy('game.id', 'DESC')
        .getOne();

      if (!room || !room.game) {
        throw new Error('Room or game not found');
      }
      const turn: boolean = data.color;
      const from_X = data.from.col;
      const from_Y = data.from.row;
      const whos_turn: string = turn ? 'white' : 'black';

      //logs
      console.log('room.game.turn :', room.game.turn);
      const board: string[][] | null = room.game.board;
      
      //check for previous move
      const previousMove = room.game.move_history ? JSON.parse(room.game.move_history) : null;

      if (!(board && board[from_Y] && board[from_Y][from_X])) {
        callback({ isValidMove: false, error: 'Invalid move' });
        throw new Error('Invalid move');
      }

      //check if is the turn of the player and if the piece is the color of the player
      if (room.game.turn===turn && board[from_Y][from_X] === board[from_Y][from_X].toLowerCase()) {
        const rowIndex = data.to.row;
        const colIndex = data.to.col;
        const kingSide = data.kingSide;
        const queenSide = data.queenSide;
        const kingMoved = data.kingMoved;
        if(kingSide === null|| queenSide === null || kingMoved === null){
          throw new Error('ERROR KINGSIDE OR QUEENSIDE IS NULL');
        }
        const [updated_board, isValidMove, updated_move,isCheck, isCheckmate, isStalemate, kingSide_ans, queenSide_ans, kingMoved_ans] = moveValidation(from_X, from_Y, colIndex, rowIndex, board, turn, kingSide, queenSide, kingMoved, previousMove);
        
        //if the move is valid
        if (isValidMove){
          //add the updated board to the game db
          room.game.board = updated_board;
          //switch the turn
          room.game.turn = !turn;
          //update move history
          room.game.move_history = JSON.stringify(updated_move);
          //save the game in the db
          await gameRepository.save(room.game);
          //return the updated board
          callback({ isValidMove: true, board: formatBoard_to_return(updated_board), isCheck, isCheckmate, isStalemate, kingSide: kingSide_ans, queenSide: queenSide_ans, kingMoved: kingMoved_ans});
          io.emit('boardState', { board: formatBoard_to_return(updated_board) }); // Broadcasting to all connected sockets

        }else{
          //move is not valid
          callback({ isValidMove: false, board: formatBoard_to_return(board),isCheck:false, isCheckmate:false, isStalemate:false, kingSide, queenSide, kingMoved});
          io.emit('boardState', { board: formatBoard_to_return(board) }); // Broadcasting to all connected sockets
        }

      }else {
        // Handle the case when board is null or its elements are undefined
        console.log('Invalid move');
        callback({ isValidMove: false, error: 'Invalid move'});
      }
    }
    catch (error) {
      console.error(error);
      callback({ isValidMove: false, error: 'Invalid move' });
    }
  });
};
