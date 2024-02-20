"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rookMoves = void 0;
//src/logic/Rooks.ts
const Move_1 = require("./Move");
function rookMoves(y, x, moves, board, turn) {
    return turn ? whiteRook(y, x, moves, board) : blackRook(y, x, moves, board);
}
exports.rookMoves = rookMoves;
function blackRook(y, x, moves, board) {
    const directions = [
        { dx: 0, dy: 1 }, // UP
        { dx: 0, dy: -1 }, // DOWN
        { dx: 1, dy: 0 }, // RIGHT
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
            moves.push(new Move_1.Move({ x, y }, { x: newX, y: newY }, board));
            // Check if it's an enemy piece
            if (piece.toLowerCase() === piece && piece !== '.') {
                moves.push(new Move_1.Move({ x, y }, { x: newX, y: newY }, board));
                break;
            }
            i++;
        }
    }
    return moves;
}
function whiteRook(y, x, moves, board) {
    // Define the directions: UP, DOWN, RIGHT, LEFT
    const directions = [
        { dx: 0, dy: 1 }, // UP
        { dx: 0, dy: -1 }, // DOWN
        { dx: 1, dy: 0 }, // RIGHT
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
            moves.push(new Move_1.Move({ x, y }, { x: newX, y: newY }, board));
            // Check if it's an enemy piece
            if (piece.toUpperCase() === piece && piece !== '.') {
                moves.push(new Move_1.Move({ x, y }, { x: newX, y: newY }, board));
                break;
            }
            i++;
        }
    }
    return moves;
}
