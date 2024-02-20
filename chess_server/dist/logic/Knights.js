"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nightMoves = void 0;
const Move_1 = require("./Move");
function nightMoves(y, x, moves, board, turn) {
    return turn ? whiteKnight(y, x, moves, board) : blackKnight(y, x, moves, board);
}
exports.nightMoves = nightMoves;
function blackKnight(y, x, moves, board) {
    getKnightMoves(y, x, moves, board, false);
    return moves;
}
function whiteKnight(y, x, moves, board) {
    getKnightMoves(y, x, moves, board, true);
    return moves;
}
function getKnightMoves(row, col, moves, board, isWhite) {
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
            moves.push(new Move_1.Move({ x: col, y: row }, { x: newCol, y: newRow }, board));
        }
    }
}
function isValidMove(row, col, board, isWhite) {
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
        const piece = board[row][col];
        if (isWhite) {
            return piece === '.' || (piece.toUpperCase() === piece && piece != '.');
        }
        else {
            return piece === '.' || (piece.toLowerCase() === piece && piece != '.');
        }
    }
    return false;
}
