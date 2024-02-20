//src/logic/Chess_game.ts
import {Chess} from './Types';
import {Move} from './Move';
import {pawnMoves } from './Pawns';
import { rookMoves} from './Rooks';
import { bishopMoves} from './Bishops';
import {queenMoves} from './Queens';
import {nightMoves} from './Knights';
import {kingMoves} from './King';
import { printLine } from '../util/utils';

export function createChess_position(board:string[][],
  turn:boolean, 
  whiteKingLocation:[number,number], 
  blackKingLocation:[number,number], 
  kingSide: boolean, queenSide: boolean,
  kingMoved:boolean,
  previousMove:Move): Chess {

    const moveFunctions: Record<string, (r: number, c: number, moves: Move[], board: string[][], turn:boolean ) => void> = {

      'r':rookMoves,
      'b':bishopMoves,
      'q':queenMoves,
      'n':nightMoves
    };
  
    const chess: Chess = {
      board: board,
      moveFunctions: moveFunctions,
      turn: turn,
      moveLog: [],
      whiteKingLocation: whiteKingLocation,
      blackKingLocation: blackKingLocation,
      checkmate: false,
      stalemate: false,
      kingSide: kingSide,
      queenSide: queenSide,
      kingMoved: kingMoved,
      previousMove: previousMove
    };
  
    return chess;
  }
  
export function undoMove(chess: Chess): void {
  const move = chess.moveLog.pop();
  if (move) {
    const pieceTaken = move.pieceTaken;
    const from = move.from;
    const to = move.to;
    chess.board[to.y][to.x] = pieceTaken;
    chess.board[from.y][from.x] = move.pieceMoved;
  } else {
    console.log('move is null');
    console.log('Check at makeMove function and undoMove function in Chess_game.ts');
  }
}
export function isCheck(opponentMoves: Move[], kingLocation: [number, number]): boolean {
  const isCheck = opponentMoves.some((move) => move.to.y === kingLocation[0] && move.to.x === kingLocation[1]);
  return isCheck;
}


export function make_move(chess: Chess, move: Move): void {
  //make the move on the board 
  const from = move.from;
  const to = move.to;
  chess.board[to.y][to.x] = chess.board[from.y][from.x];
  chess.board[from.y][from.x] = '.';
  chess.moveLog.push(move);
}

function isValidMove(chess: Chess, move: Move): boolean {
  //create a new chess position for the opponent
  const oppenentChessPosition = createChess_position(chess.board, 
    !chess.turn, 
    chess.whiteKingLocation,
     chess.blackKingLocation,
     //potential BUG, solution is to query from db 
     chess.kingSide, 
     chess.queenSide,
     chess.kingMoved,
     move);
  //make the move for the player
  make_move(oppenentChessPosition, move);
  //get all the moves for the opponent
  const opponentMoves = getAllPossibleMoves(oppenentChessPosition, [], oppenentChessPosition.turn);
  opponentMoves.forEach((move) => {
    console.log('opponent move', move);
  });
  //get the location of the opponent's king
  const [king_y, king_x] = chess.turn ? chess.whiteKingLocation : chess.blackKingLocation;
  //check if the opponent is attacking the king
  const isValid = !isCheck(opponentMoves, [king_y, king_x]);
  //undo the move
  undoMove(oppenentChessPosition);
  return isValid;
}

export function getValidMoves(chess: Chess): Move[] {
  //get all the moves 
  const moves: Move[] = getAllPossibleMoves(chess, [], chess.turn);
  const validMoves : Move[]= [];
  // for each move, check if it is valid
  for (const move of moves) {
    if (move.pieceMoved === 'k'|| move.pieceMoved === 'K'){
      //update the king location
      const temp = chess.turn ? chess.whiteKingLocation : chess.blackKingLocation;
      if (chess.turn){
        chess.whiteKingLocation = [move.to.y, move.to.x];
      } else {
        chess.blackKingLocation = [move.to.y, move.to.x];
      }
      if (isValidMove(chess, move)) {
        //check if the king can castle and you are not in check
        if (move.can_castle() ){
          let direction = move.castleMove?.castling_direction;
          let x = move.from.x + (direction ?? 0);
          let move_x = new Move({x: move.from.x, y: move.from.y}, {x: x, y: move.to.y}, chess.board);
          let move2_x = new Move({x: move.from.x, y: move.from.y}, {x: move.from.x, y: move.from.y}, chess.board);
          if (chess.turn){
            chess.whiteKingLocation = [move.to.y, x];
          } else {
            chess.blackKingLocation = [move.to.y, x];
          }
          //needs to be improved
          if (isValidMove(chess, move_x)&& isValidMove(chess, move2_x)){
            validMoves.push(move);
          }
        }
        else 
        {
          validMoves.push(move);
        }
      }
      //undo the move
      if (chess.turn) {
        chess.whiteKingLocation = temp;
      } else {
        chess.blackKingLocation = temp;
      }
    }
    else if (isValidMove(chess, move)) {
      validMoves.push(move);
    }
  //check if the game is over
  if (validMoves.length === 0){
    console.log('VALID MOVES LENGTH', validMoves.length);
    const opponentMoves = getAllPossibleMoves(chess, [], !chess.turn);
    const [king_y, king_x] = chess.turn ? chess.whiteKingLocation : chess.blackKingLocation;
    if (isCheck(opponentMoves, [king_y, king_x])){
      chess.checkmate = true;
      console.log('CHECKMATE');
    }else{
      chess.stalemate = true;
      console.log('STALEMATE');
    }
  }
}
  //needs improvement
  return validMoves;
}

export function getAllPossibleMoves(chess: Chess, moves:Move[], turn:boolean): Move[] {
    for (let y = 0; y < chess.board.length; y++) {
      for (let x = 0; x < chess.board[y].length; x++) {
          const piece = chess.board[y][x];
          if (piece !== '.' && ((piece.toLowerCase() === piece && turn === true)||(piece.toUpperCase() === piece && turn === false))){
            if (piece.toLowerCase() === 'k'){
              moves = kingMoves(y, x, moves, chess.board, turn, chess);
            }else if (piece.toLowerCase() === 'p'){
              moves = pawnMoves(y, x, moves, chess.board, turn, chess);
            }
            else{
            moves = chess.moveFunctions[piece.toLowerCase()](y, x, moves, chess.board, turn);
            }
            //console.log('moves :', moves);
          }
      }
    }
    return moves;
}