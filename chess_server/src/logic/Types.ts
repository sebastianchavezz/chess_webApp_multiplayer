//src/logic/Types.ts

import { Move } from "./Move";

export type From ={
    x: number;
    y: number;

}
export type To ={
    x: number;
    y: number;
}

export type Piece = {
    color: boolean;
    board: string[][];
    from: From;
    to: To;
    piece_type : string;
}

export type Board= {
    board: string[][];
}

export type Chess ={
    board: string[][];
    moveFunctions: Record<string, Function>;
    turn: boolean;
    moveLog: Move[];
    whiteKingLocation: [number, number];
    blackKingLocation: [number, number];
    checkmate: boolean;
    stalemate: boolean;
    kingSide: boolean;
    queenSide: boolean;
    kingMoved: boolean;
    previousMove: Move;
}