"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveValidation = exports.udpateBoard = void 0;
//src/logic/ValidationLogic.ts
const utils_1 = require("../util/utils");
const Chess_game_1 = require("./Chess_game");
const Move_1 = require("./Move");
function udpateBoard(piece) {
    const newBoard = JSON.parse(JSON.stringify(piece.board)); // Create a deep copy
    newBoard[piece.to.y][piece.to.x] = newBoard[piece.from.y][piece.from.x];
    newBoard[piece.from.y][piece.from.x] = '.';
    return newBoard;
}
exports.udpateBoard = udpateBoard;
function getKingLocation(board, color) {
    let kingLocation = [0, 0];
    let king = color ? 'k' : 'K';
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[y][x] === king) {
                kingLocation = [y, x];
            }
        }
    }
    return kingLocation;
}
function updateRook_move(chess, move) {
    if (!chess.kingSide &&
        (move.pieceMoved === 'r' || move.pieceMoved === 'R')
        && move.from.x === 7) {
        console.log('kingside moved');
        chess.kingSide = true;
    }
    if (!chess.queenSide &&
        (move.pieceMoved === 'R' || move.pieceMoved === 'r')
        && move.from.x === 0) {
        console.log('blackRook queenSide moved');
        chess.queenSide = true;
    }
}
function updateKing_move(chess, move) {
    if (!chess.kingMoved &&
        (move.pieceMoved === 'k' || move.pieceMoved === 'K')) {
        console.log('king moved');
        chess.kingMoved = true;
    }
}
function moveValidation(x_from, y_from, x_to, y_to, board, turn, kingSide, queenSide, kingMoved, previousMove) {
    //board needs to be trimmed of spaces
    board = (0, utils_1.formatBoard_to_return)(board);
    //black means we go from top to bottom
    if (!turn) {
        y_from = 7 - y_from;
        x_from = 7 - x_from;
        y_to = 7 - y_to;
        x_to = 7 - x_to;
    }
    let piece = { color: turn,
        board: board,
        from: { x: x_from, y: y_from },
        to: { x: x_to, y: y_to },
        piece_type: board[y_from][x_from],
    };
    let whiteKing = getKingLocation(piece.board, true);
    let blackKing = getKingLocation(piece.board, false);
    const chess = (0, Chess_game_1.createChess_position)(piece.board, turn, whiteKing, blackKing, kingSide, queenSide, kingMoved, previousMove);
    const allPossibleMoves = (0, Chess_game_1.getValidMoves)(chess);
    const move = new Move_1.Move(piece.from, piece.to, piece.board);
    for (let i = 0; i < allPossibleMoves.length; i++) {
        //console.log('allPossibleMoves[i] :', allPossibleMoves[i].moveID);
        if (allPossibleMoves[i].equals(move)) {
            (0, utils_1.printLine)();
            if (allPossibleMoves[i].can_castle()) {
                const castleMove = allPossibleMoves[i].castleMove;
                if (castleMove) {
                    piece.board[castleMove.rook_y][castleMove.rook_from_castle_x] = '.';
                    piece.board[castleMove.rook_y][castleMove.rook_to_castle_x] = allPossibleMoves[i].pieceMoved === 'k' ? 'r' : 'R';
                }
            }
            if (allPossibleMoves[i].take_en_passant()) {
                console.log('take_en_passant');
                const previousMove_x = chess.previousMove.to.x;
                const previousMove_y = chess.previousMove.to.y;
                //update the board, remove the captured pawn
                piece.board[previousMove_y][previousMove_x] = '.';
                allPossibleMoves[i].pieceTaken = 'p';
            }
            if (allPossibleMoves[i].getPromotion()) {
                console.log('promotion');
                allPossibleMoves[i].pieceMoved = chess.turn ? 'q' : 'Q';
                piece.board[allPossibleMoves[i].from.y][allPossibleMoves[i].from.x] = allPossibleMoves[i].pieceMoved;
            }
            updateRook_move(chess, allPossibleMoves[i]);
            updateKing_move(chess, allPossibleMoves[i]);
            const move_update = allPossibleMoves[i];
            return [udpateBoard(piece), true, move_update, false, chess.checkmate, chess.stalemate, chess.kingSide, chess.queenSide, chess.kingMoved];
        }
    }
    return [board, false, previousMove, false, false, false, kingSide, queenSide, kingMoved];
}
exports.moveValidation = moveValidation;
