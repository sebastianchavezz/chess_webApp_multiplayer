//src/logic/ValidationLogic.ts
import { formatBoard_to_return, printBoard, printLine } from '../util/utils';
import {Piece, Chess} from './Types';
import { createChess_position, getAllPossibleMoves, getValidMoves } from "./Chess_game";
import { Move } from "./Move";

type isValid= boolean;
type isCheck= boolean;
type isCheckmate= boolean;
type isStalemate= boolean;
type kingSide = boolean;
type queenSide = boolean;
type kingMoved = boolean;
//return board, isMoveValid, isCheck, isCheckmate, isStalemate
type ValidationResult = [string[][], isValid, Move ,isCheck, isCheckmate, isStalemate, kingSide, queenSide, kingMoved];

export function udpateBoard(piece: Piece): string[][] {
    const newBoard = JSON.parse(JSON.stringify(piece.board)); // Create a deep copy
    newBoard[piece.to.y][piece.to.x] = newBoard[piece.from.y][piece.from.x];
    newBoard[piece.from.y][piece.from.x] = '.';
    return newBoard;
}

function getKingLocation(board:string[][], color:boolean):[number,number]{
    let kingLocation:[number,number] = [0,0];
    let king = color ? 'k' : 'K';
    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            if (board[y][x] === king){
                kingLocation = [y,x];
            }
        }
    }
    return kingLocation;
}

function updateRook_move(chess:Chess, move:Move){
    if(!chess.kingSide && 
    (move.pieceMoved ==='r' || move.pieceMoved === 'R') 
    && move.from.x === 7){
        console.log('kingside moved');
        chess.kingSide = true;
    }
    if(!chess.queenSide && 
        (move.pieceMoved ==='R' || move.pieceMoved === 'r')
         && move.from.x === 0){
        console.log('blackRook queenSide moved');
        chess.queenSide = true;
    }
}
function updateKing_move(chess:Chess, move:Move){
    if(!chess.kingMoved && 
        (move.pieceMoved ==='k' || move.pieceMoved === 'K')){
        console.log('king moved');
        chess.kingMoved = true;
    }
}

export function moveValidation (
    x_from:number,
    y_from:number,
    x_to:number,
    y_to:number,
    board:string[][],
    turn:boolean,
    kingSide:boolean,
    queenSide:boolean,
    kingMoved:boolean,
    previousMove:Move,
    ):ValidationResult{

    
    //board needs to be trimmed of spaces
    board = formatBoard_to_return(board);
    //black means we go from top to bottom
    if (!turn){
        y_from = 7 - y_from;
        x_from = 7 - x_from;
        y_to = 7 - y_to;
        x_to = 7 - x_to;
    }

    let piece: Piece = { color: turn,
        board: board,
        from: {x: x_from, y: y_from},
        to: {x: x_to, y: y_to},
        piece_type: board[y_from][x_from],
    }
    let whiteKing = getKingLocation(piece.board, true);
    let blackKing = getKingLocation(piece.board, false);
    const chess = createChess_position(piece.board, turn, whiteKing, blackKing, kingSide, queenSide, kingMoved, previousMove);
    const allPossibleMoves = getValidMoves(chess);
    const move = new Move(piece.from, piece.to,piece.board);

    for (let i = 0; i < allPossibleMoves.length; i++) {
        //console.log('allPossibleMoves[i] :', allPossibleMoves[i].moveID);
        if (allPossibleMoves[i].equals(move)) {
            printLine();
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
            return [udpateBoard(piece), true, move_update,false, chess.checkmate, chess.stalemate,chess.kingSide, chess.queenSide, chess.kingMoved];
        }
    }
    return [board,false, previousMove,false, false, false, kingSide, queenSide, kingMoved];
    }
