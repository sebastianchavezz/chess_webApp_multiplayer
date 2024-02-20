"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Move = void 0;
class CastlingMove {
    constructor(rook_from_castle_x, rook_to_castle_x, rook_y) {
        this.rook_from_castle_x = rook_from_castle_x;
        this.rook_to_castle_x = rook_to_castle_x;
        this.rook_y = rook_y;
        this.castling_direction = (rook_from_castle_x - rook_to_castle_x) === 2 ? 1 : -1;
        console.log('castling direction', this.castling_direction);
    }
}
class Move {
    constructor(from, to, board) {
        this.castle = false;
        this.castleMove = null;
        this.en_passant = false;
        this.promotion = false;
        this.from = from;
        this.to = to;
        this.pieceMoved = board[from.y][from.x];
        this.pieceTaken = board[to.y][to.x];
        this.moveID = this.calculateMoveID();
    }
    calculateMoveID() {
        const { x: from_x, y: from_y } = this.from;
        const { x: to_x, y: to_y } = this.to;
        return from_y * 1000 + from_x * 100 + to_y * 10 + to_x;
    }
    equals(other) {
        return this.moveID === other.moveID;
    }
    setPromotion() {
        this.promotion = true;
    }
    getPromotion() {
        return this.promotion;
    }
    setCastle(x_from, x_to, turn) {
        let y_turn = turn ? 7 : 0;
        this.castleMove = new CastlingMove(x_from, x_to, y_turn);
        this.castle = true;
    }
    can_castle() {
        return this.castle;
    }
    setEnPassant() {
        this.en_passant = true;
    }
    take_en_passant() {
        return this.en_passant;
    }
    getChessNotation() {
        const start = this.getRankFile(this.from.y, this.from.x);
        const end = this.getRankFile(this.to.y, this.to.x);
        return start + end;
    }
    getRankFile(row, col) {
        const filesToCols = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h' };
        const ranksToRows = { 0: '1', 1: '2', 2: '3', 3: '4', 4: '5', 5: '6', 6: '7', 7: '8' };
        const colStr = filesToCols[col];
        const rowStr = ranksToRows[row];
        return colStr + rowStr;
    }
    toString() {
        return ` MoveID: ${this.moveID}, From: (x:${this.from.x}, y:${this.from.y}), To: (x:${this.to.x}, y:${this.to.y}), Piece Moved: ${this.pieceMoved}, Piece Taken: ${this.pieceTaken}`;
    }
}
exports.Move = Move;
