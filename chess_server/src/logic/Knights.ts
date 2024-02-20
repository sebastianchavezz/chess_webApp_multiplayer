import { Move } from "./Move";


export function nightMoves(y: number, x: number, moves: Move[], board: string[][], turn:boolean): Move[] {
  return turn ? whiteKnight(y, x, moves, board) : blackKnight(y, x, moves, board);

}

function blackKnight(y: number, x: number, moves: Move[], board: string[][]): Move[] {
  getKnightMoves(y, x, moves, board, false);
  return moves;
}

function whiteKnight(y: number, x: number, moves: Move[], board: string[][]): Move[] {
  getKnightMoves(y, x, moves, board, true);
  return moves;
}

function getKnightMoves(row: number, col: number, moves: Move[], board: string[][], isWhite: boolean): void {
  const directions = [
    { dr: 1, dc: 2 },
    { dr: 2, dc: 1 },
    { dr: 1, dc: -2 },
    { dr: 2, dc: -1 },
    { dr: -1, dc: 2 },
    { dr: -2, dc: 1 },
    { dr: -1, dc: -2 },
    { dr: -2, dc: -1 },
  ];

  for (const dir of directions) {
    const newRow = row + dir.dr;
    const newCol = col + dir.dc;

    if (isValidMove(newRow, newCol, board, isWhite)) {
      moves.push(new Move({ x: col, y: row }, { x: newCol, y: newRow }, board));
    }
  }
}

function isValidMove(row: number, col: number, board: string[][], isWhite: boolean): boolean {
  if (row >= 0 && row < 8 && col >= 0 && col < 8) {
    const piece = board[row][col];

    if (isWhite) {
      return piece === '.' || (piece.toUpperCase() === piece && piece != '.');
    } else {
      return piece === '.' || (piece.toLowerCase() === piece && piece != '.');
    }
  }
  return false;
}
