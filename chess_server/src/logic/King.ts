//src/logic/King.ts
import { Move } from "./Move";
import { Chess } from "./Types";

export function kingMoves(y: number, x: number, moves: Move[], board: string[][], turn:boolean, chess:Chess): Move[] {
  const normalMoves= turn ? whiteKing(y, x, moves, board) : blackKing(y, x, moves, board);

  if(canCastleKingSide(chess, turn)){
    //this is the updated King piece
    let move1 = new Move({x, y}, {x: x+2, y}, board);
    move1.setCastle(7,5,turn);
    normalMoves.push( move1);
  }
  if (canCastleQueenSide(chess, turn)){
    let move2 = new Move({x, y}, {x: x-2, y}, board);
    move2.setCastle(0,3,turn);
    //this is the updated King piece
    normalMoves.push(move2);
  }
  return normalMoves;
}


function whiteKing(y: number, x: number, moves: Move[], board: string[][]): Move[] {
  const kingMoves: number[][] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  for (const move of kingMoves) {
    const endRow = y + move[0];
    const endCol = x + move[1];

    if (endRow >= 0 && endRow < 8 && endCol >= 0 && endCol < 8) {
      const endPiece = board[endRow][endCol];

      if (endPiece === '.' || endPiece.toUpperCase() === endPiece) {
        moves.push(new Move({ x, y }, { x: endCol, y: endRow }, board));
      }
    }
  }

  return moves;
}

function blackKing(y: number, x: number, moves: Move[], board: string[][]): Move[] {
  const kingMoves: number[][] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  for (const move of kingMoves) {
    const endRow = y + move[0];
    const endCol = x + move[1];

    if (endRow >= 0 && endRow < 8 && endCol >= 0 && endCol < 8) {
      const endPiece = board[endRow][endCol];

      if (endPiece === '.' || endPiece.toLowerCase() === endPiece) {
        moves.push(new Move({ x, y }, { x: endCol, y: endRow }, board));
      }
    }
  }
  return moves;
}

function canCastleQueenSide(chess:Chess, turn: boolean): boolean{
  if (!chess.queenSide && !chess.kingMoved){
    if (!turn){
      if (chess.board[0][1] === '.' && chess.board[0][2] === '.' && chess.board[0][3] === '.'){
        return true;
      }
    } else {
      if (chess.board[7][1] === '.' && chess.board[7][2] === '.' && chess.board[7][3] === '.'){
        return true;
      }
    }
  }
  return false;
}

function canCastleKingSide(chess: Chess, turn: boolean): boolean {
  //this means the rook has not moved
  if (!chess.kingSide && !chess.kingMoved){
    if (!turn){
      if (chess.board[0][5] === '.' && chess.board[0][6] === '.'){
        return true;
      }
    } else {
      if (chess.board[7][5] === '.' && chess.board[7][6] === '.'){
        return true;
      }
    }
  }
  return false;
}