"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queenMoves = void 0;
const Rooks_1 = require("./Rooks");
const Bishops_1 = require("./Bishops");
function queenMoves(y, x, moves, board, turn) {
    moves = (0, Rooks_1.rookMoves)(y, x, moves, board, turn);
    moves = (0, Bishops_1.bishopMoves)(y, x, moves, board, turn);
    return moves;
}
exports.queenMoves = queenMoves;
