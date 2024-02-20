//src/logic/Rooks.ts
import { Move } from "./Move";


export function rookMoves(y: number, x: number, moves: Move[], board: string[][], turn:boolean): Move[] {
  return turn ? whiteRook(y, x, moves, board) : blackRook(y, x, moves, board); 
}

function blackRook(y:number, x:number, moves:Move[], board:string[][]):Move[]{
    const directions = [
        { dx: 0, dy: 1 },  // UP
        { dx: 0, dy: -1 }, // DOWN
        { dx: 1, dy: 0 },  // RIGHT
        { dx: -1, dy: 0 }, // LEFT
      ];
      
      // Iterate through each direction
      for (const dir of directions) {
        let i = 1;
        while (i < 8) {
          const newX = x + i * dir.dx;
          const newY = y + i * dir.dy;
          // Check if new position is out of bounds
          if (newX < 0 || newX > 7 || newY < 0 || newY > 7) {
            break;
          }
          const piece = board[newY][newX];
          // Check if it's a friendly piece
          if (piece.toUpperCase() === piece && piece !== '.') {
            break;
          }
          moves.push(new Move({ x, y }, { x: newX, y: newY }, board));
          // Check if it's an enemy piece
          if (piece.toLowerCase() === piece && piece !== '.') {
            moves.push(new Move({ x, y }, { x: newX, y: newY }, board));
            break;
          }
          i++;
        }
      }

    return moves;
}

function whiteRook(y: number, x: number, moves: Move[], board: string[][]): Move[] {

  // Define the directions: UP, DOWN, RIGHT, LEFT
  const directions = [
    { dx: 0, dy: 1 },  // UP
    { dx: 0, dy: -1 }, // DOWN
    { dx: 1, dy: 0 },  // RIGHT
    { dx: -1, dy: 0 }, // LEFT
  ];

  // Iterate through each direction
  for (const dir of directions) {
    let i = 1;
    while (i < 8) {
      const newX = x + i * dir.dx;
      const newY = y + i * dir.dy;
      // Check if new position is out of bounds
      if (newX < 0 || newX > 7 || newY < 0 || newY > 7) {
        break;
      }
      const piece = board[newY][newX];
      // Check if it's a friendly piece
      if (piece.toLowerCase() === piece && piece !== '.') {
        break;
      }
      moves.push(new Move({ x, y }, { x: newX, y: newY }, board));
      // Check if it's an enemy piece
      if (piece.toUpperCase() === piece && piece !== '.') {
        moves.push(new Move({ x, y }, { x: newX, y: newY }, board));
        break;
      }
      i++;
    }
  }
  return moves;
}
