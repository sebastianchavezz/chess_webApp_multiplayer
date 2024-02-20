//src/logic/Pawns.ts
import { Move } from "./Move";
import { Chess } from "./Types";

export function pawnMoves(y:number, x:number, moves:Move[], board:string[][], turn:boolean, chess:Chess):Move[]{
    return turn ? whitePawn(y, x, moves, board, chess) : blackPawn(y, x, moves, board, chess);
}

function blackPawn(y:number, x:number, moves:Move[], board:string[][], chess:Chess):Move[] {
    // Check if the square in front of the pawn is empty
    if(board[y+1][x] === '.'){
        //check for promotion
        if (y + 1 === 7) {
            let move = new Move({x:x, y:y}, {x:x, y:y+1}, board);
            move.setPromotion();
            console.log('promotion move', move);
            moves.push(move);
        }else{
            moves.push(new Move({x:x, y:y}, {x:x, y:y+1}, board));
        }
        // Check if the pawn is in its starting position and if the square two squares in front of the pawn is empty
        if(y === 1 && board[y+2][x] === '.'){
            moves.push(new Move({x:x, y:y}, {x:x, y:y+2}, board));
        }
    }
    if (x - 1 >= 0){
        const opponentPiece = board[y + 1][x - 1];
        // Check if the square is not empty and if it's a white piece (lowercase letter)
        if (opponentPiece !== '.' && opponentPiece.toLowerCase() === opponentPiece) {
            //check for promotion
            if (y + 1 === 7) {
                let move = new Move({x:x, y:y}, {x:x-1, y:y+1}, board);
                move.setPromotion();
                console.log('promotion move', move);
                moves.push(move);
            }else{
                moves.push(new Move({x:x, y:y}, {x:x-1, y:y+1}, board));
            }
        }
    }
    if (x + 1 <= 7){
        const opponentPiece = board[y + 1][x + 1];
        // Check if the square is not empty and if it's a white piece (lowercase letter)
        if (opponentPiece !== '.' && opponentPiece.toLowerCase() === opponentPiece) {
            //check for promotion
            if (y + 1 === 7) {
                let move = new Move({x:x, y:y}, {x:x+1, y:y+1}, board);
                move.setPromotion();
                console.log('promotion move', move);
                moves.push(move);
            }else{
                moves.push(new Move({x:x, y:y}, {x:x+1, y:y+1}, board));
            }
        }
    }
    let previousMove = chess.previousMove;
    if(!previousMove) return moves;
    let piecePreviousMove = previousMove.pieceMoved;
    let from = previousMove.from;
    let to = previousMove.to;
    //check for en passant right side
    if (piecePreviousMove === 'p' && from.y === 6 && to.y === 4 && to.x === x + 1) {
        let en_passant_move = new Move({x: x, y: y}, {x: x + 1, y: y + 1}, board);
        en_passant_move.setEnPassant();
        moves.push(en_passant_move);
        //chess.board[to.y][to.x] = '.'; // Remove the captured pawn from the board
    }
    
    //check for en passant left side
    if (piecePreviousMove === 'p' && from.y === 6 && to.y === 4 && to.x === x - 1) {
        let en_passant_move = new Move({x: x, y: y}, {x: x - 1, y: y + 1}, board);
        en_passant_move.setEnPassant();
        moves.push(en_passant_move);
        //chess.board[to.y][to.x] = '.'; // Remove the captured pawn from the board
    }
    
    return moves;
}

function whitePawn(y:number, x:number, moves:Move[], board:string[][], chess:Chess):Move[] {
    
    // Check if the square in front of the pawn is empty
    if(board[y-1][x] === '.'){
        if(y - 1 === 0){
            let move = new Move({x:x, y:y}, {x:x, y:y-1}, board);
            move.setPromotion();
            console.log('promotion move', move);
            moves.push(move);
        }else{
            moves.push(new Move({x:x, y:y}, {x:x, y:y-1}, board));
        }
        // Check if the pawn is in its starting position and if the square two squares in front of the pawn is empty
        if(y === 6 && board[y-2][x] === '.'){
            moves.push(new Move({x:x, y:y}, {x:x, y:y-2}, board));
        }
    }
    // chekck for potential captures of the left side
    if (x - 1 >= 0){
        const opponentPiece = board[y - 1][x - 1];
        // Check if the square is not empty and if it's a black piece (capital letter)
        if (opponentPiece !== '.' && opponentPiece.toUpperCase() === opponentPiece) {
            if(y - 1 === 0){
                let move = new Move({x:x, y:y}, {x:x-1, y:y-1}, board);
                move.setPromotion();
                console.log('promotion move', move);
                moves.push(move);
            }else{
                moves.push(new Move({x:x, y:y}, {x:x-1, y:y-1}, board));
            }
        }
    }

    //check for potential captures of the right side
    if (x + 1 <= 7){
        const opponentPiece = board[y - 1][x + 1];
        // Check if the square is not empty and if it's a black piece (capital letter)
        if (opponentPiece !== '.' && opponentPiece.toUpperCase() === opponentPiece) {
            if(y - 1 === 0){
                let move = new Move({x:x, y:y}, {x:x+1, y:y-1}, board);
                move.setPromotion();
                moves.push(move);
            }else{
                moves.push(new Move({x:x, y:y}, {x:x+1, y:y-1}, board));
            }
        }
    }
    
    //check for en passant right side
    let previousMove = chess.previousMove;
    if (!previousMove) return moves;
    let piecePreviousMove = previousMove.pieceMoved;
    let from = previousMove.from;
    let to = previousMove.to;
    if (piecePreviousMove === 'P' && from.y === 1 && to.y === 3 && to.x === x + 1 && y === 3) {
        let en_passant_move = new Move({x: x, y: y}, {x: x + 1, y: y - 1}, board);
        en_passant_move.setEnPassant(); 
        moves.push(en_passant_move);
    }
    //check for en passant left sid.e
    if (piecePreviousMove === 'P' && from.y === 1 && to.y === 3 && to.x === x - 1) {
        let en_passant_move = new Move({x: x, y: y}, {x: x - 1, y: y - 1}, board);
        en_passant_move.setEnPassant(),
        moves.push(en_passant_move);
    }
    return moves;
}