import {Move} from './Move';
import {rookMoves} from './Rooks';
import {bishopMoves} from './Bishops';

export function queenMoves(y:number, x:number, moves:Move[], board:string[][], turn:boolean):Move[]{
    moves = rookMoves(y,x,moves,board,turn);
    moves = bishopMoves(y,x,moves,board,turn);
    return moves;
}

