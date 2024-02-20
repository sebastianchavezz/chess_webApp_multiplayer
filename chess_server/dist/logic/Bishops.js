"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bishopMoves = void 0;
const Move_1 = require("./Move");
function bishopMoves(y, x, moves, board, turn) {
    return turn ? whiteBishop(y, x, moves, board) : blackBishop(y, x, moves, board);
}
exports.bishopMoves = bishopMoves;
function blackBishop(y, x, moves, board) {
    const directions = [
        { dx: 1, dy: 1 }, // UP-RIGHT
        { dx: 1, dy: -1 }, // UP-LEFT
        { dx: -1, dy: 1 }, // DOWN-RIGHT
        { dx: -1, dy: -1 }, // DOWN-LEFT
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
function whiteBishop(y, x, moves, board) {
    const directions = [
        { dx: 1, dy: 1 }, // UP-RIGHT
        { dx: 1, dy: -1 }, // UP-LEFT
        { dx: -1, dy: 1 }, // DOWN-RIGHT
        { dx: -1, dy: -1 }, // DOWN-LEFT
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
